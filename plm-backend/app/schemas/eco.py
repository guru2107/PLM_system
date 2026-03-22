from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional
from app.models.eco import ECOType, ECOStatus

class ECOCreate(BaseModel):
    title: str
    eco_type: ECOType
    product_id: int
    bom_id: Optional[int] = None
    version_update: bool = True
    effective_date: Optional[date] = None

class ECOResponse(BaseModel):
    id: int
    title: str
    eco_type: ECOType
    product_id: int
    bom_id: Optional[int]
    user_id: int
    stage_id: int
    version_update: bool
    effective_date: Optional[date]
    status: ECOStatus
    created_at: datetime

    class Config:
        from_attributes = True


class ECOStageCreate(BaseModel):
    name: str
    requires_approval: bool = False
    approver_role: Optional[str] = None
    approver_user_id: Optional[int] = None
    order: Optional[int] = None
    is_default: bool = False


class ECOStageResponse(BaseModel):
    id: int
    name: str
    requires_approval: bool
    approver_role: Optional[str]
    approver_user_id: Optional[int]
    order: int
    is_default: bool

    class Config:
        from_attributes = True
