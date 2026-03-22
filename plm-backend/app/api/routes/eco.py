from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.eco import ECO, ECOStage, ECOStatus
from app.models.product import Product
from app.models.user import User, RoleEnum
from app.schemas.eco import ECOCreate, ECOResponse, ECOStageCreate, ECOStageResponse
from app.deps import get_current_user, require_roles

router = APIRouter(prefix="/ecos", tags=["ECO"])


def ensure_default_stages(db: Session) -> list[ECOStage]:
    stages = db.query(ECOStage).order_by(ECOStage.order.asc()).all()
    if stages:
        return stages

    default_stages = [
        ECOStage(name="New", requires_approval=False, approver_role=None, approver_user_id=None, order=1, is_default=True),
        ECOStage(name="Approval", requires_approval=True, approver_role="approver", approver_user_id=None, order=2, is_default=False),
        ECOStage(name="Done", requires_approval=False, approver_role=None, approver_user_id=None, order=3, is_default=False),
    ]
    db.add_all(default_stages)
    db.commit()
    return db.query(ECOStage).order_by(ECOStage.order.asc()).all()

@router.get("", response_model=List[ECOResponse])
def get_ecos(stage_id: Optional[int] = None, eco_type: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(ECO)
    if stage_id is not None:
        query = query.filter(ECO.stage_id == stage_id)
    if eco_type is not None:
        query = query.filter(ECO.eco_type == eco_type)
    if status is not None:
        query = query.filter(ECO.status == status)
    return query.all()


@router.get("/stages", response_model=List[ECOStageResponse])
def get_eco_stages(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stages = ensure_default_stages(db)
    return stages


@router.post("/stages/configure")
def configure_eco_stages(db: Session = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.admin))):
    stages = ensure_default_stages(db)
    return {"message": "ECO stages configured", "count": len(stages)}


@router.post("/stages", response_model=ECOStageResponse, status_code=status.HTTP_201_CREATED)
def create_eco_stage(stage_in: ECOStageCreate, db: Session = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.admin))):
    if stage_in.requires_approval and not stage_in.approver_user_id and not stage_in.approver_role:
        raise HTTPException(status_code=400, detail="Approver user or role is required when approval is enabled")

    if stage_in.approver_user_id is not None:
        approver_user = db.query(User).filter(User.id == stage_in.approver_user_id).first()
        if not approver_user:
            raise HTTPException(status_code=404, detail="Approver user not found")

    order_value = stage_in.order
    if order_value is None:
        max_order = db.query(ECOStage).order_by(ECOStage.order.desc()).first()
        order_value = (max_order.order + 1) if max_order else 1

    stage = ECOStage(
        name=stage_in.name,
        requires_approval=stage_in.requires_approval,
        approver_role=stage_in.approver_role,
        approver_user_id=stage_in.approver_user_id,
        order=order_value,
        is_default=stage_in.is_default,
    )

    db.add(stage)
    db.commit()
    db.refresh(stage)
    return stage

@router.post("", response_model=ECOResponse, status_code=status.HTTP_201_CREATED)
def create_eco(eco_in: ECOCreate, db: Session = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.engineering, RoleEnum.admin))):
    product = db.query(Product).filter(Product.id == eco_in.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    ensure_default_stages(db)
    first_stage = db.query(ECOStage).order_by(ECOStage.order.asc()).first()
    if not first_stage:
        raise HTTPException(status_code=500, detail="No ECO stages configured")
        
    db_eco = ECO(
        title=eco_in.title,
        eco_type=eco_in.eco_type,
        product_id=eco_in.product_id,
        bom_id=eco_in.bom_id,
        user_id=current_user.id,
        stage_id=first_stage.id,
        version_update=eco_in.version_update,
        effective_date=eco_in.effective_date
    )
    db.add(db_eco)
    db.commit()
    db.refresh(db_eco)
    return db_eco


@router.post("/{id}/approve", response_model=ECOResponse)
def approve_eco(id: int, db: Session = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.approver, RoleEnum.admin))):
    eco = db.query(ECO).filter(ECO.id == id).first()
    if not eco:
        raise HTTPException(status_code=404, detail="ECO not found")

    creator = db.query(User).filter(User.id == eco.user_id).first()
    if creator and creator.role != RoleEnum.engineering:
        raise HTTPException(status_code=400, detail="Only ECOs created by engineering can be approved")

    if eco.status == ECOStatus.applied:
        raise HTTPException(status_code=400, detail="ECO is already approved")

    stages = db.query(ECOStage).order_by(ECOStage.order.asc()).all()
    if not stages:
        raise HTTPException(status_code=500, detail="No ECO stages configured")

    current_index = -1
    stage = None
    for idx, candidate in enumerate(stages):
        if candidate.id == eco.stage_id:
            current_index = idx
            stage = candidate
            break

    if stage is None:
        raise HTTPException(status_code=400, detail="ECO is in an invalid stage")

    if stage.requires_approval:
        if stage.approver_user_id and current_user.id != stage.approver_user_id:
            raise HTTPException(status_code=403, detail="This stage can only be approved by the assigned user")
        if stage.approver_role and current_user.role.value != stage.approver_role and current_user.role != RoleEnum.admin:
            raise HTTPException(status_code=403, detail="Your role cannot approve this stage")

    next_stage = stages[current_index + 1] if current_index + 1 < len(stages) else None
    if next_stage:
        eco.stage_id = next_stage.id
        eco.status = ECOStatus.applied if next_stage.name.lower() == "done" else ECOStatus.open
    else:
        eco.status = ECOStatus.applied

    db.commit()
    db.refresh(eco)
    return eco

@router.get("/{id}", response_model=ECOResponse)
def get_eco(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    eco = db.query(ECO).filter(ECO.id == id).first()
    if not eco:
        raise HTTPException(status_code=404, detail="ECO not found")
    return eco
