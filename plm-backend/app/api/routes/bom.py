from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.bom import BOM, BOMComponent, BOMOperation, BOMStatus
from app.models.product import Product, ProductStatus
from app.models.user import User, RoleEnum
from app.schemas.bom import BOMCreate, BOMResponse
from app.deps import get_current_user, require_roles

router = APIRouter(prefix="/boms", tags=["Bill of Materials"])

@router.get("", response_model=List[BOMResponse])
def get_boms(product_id: Optional[int] = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(BOM)
    if product_id is not None:
        query = query.filter(BOM.product_id == product_id)
    if current_user.role == RoleEnum.operations:
        query = query.filter(BOM.status == BOMStatus.active)
    return query.all()

@router.post("", response_model=BOMResponse, status_code=status.HTTP_201_CREATED)
def create_bom(bom_in: BOMCreate, db: Session = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.engineering, RoleEnum.admin))):
    product = db.query(Product).filter(Product.id == bom_in.product_id).first()
    if not product or product.status != ProductStatus.active:
        raise HTTPException(status_code=404, detail="Active Product not found")
    
    db_bom = BOM(product_id=bom_in.product_id)
    db.add(db_bom)
    db.commit()
    db.refresh(db_bom)
    
    for comp in bom_in.components:
        db_comp = BOMComponent(bom_id=db_bom.id, **comp.model_dump())
        db.add(db_comp)
        
    for op in bom_in.operations:
        db_op = BOMOperation(bom_id=db_bom.id, **op.model_dump())
        db.add(db_op)
        
    db.commit()
    db.refresh(db_bom)
    return db_bom

@router.get("/{id}", response_model=BOMResponse)
def get_bom(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    bom = db.query(BOM).filter(BOM.id == id).first()
    if not bom:
        raise HTTPException(status_code=404, detail="BOM not found")
    return bom
