from pydantic import BaseModel
from datetime import datetime
from typing import List
from app.models.bom import BOMStatus

class BOMComponentCreate(BaseModel):
    component_name: str
    quantity: float
    unit: str = "pcs"

class BOMComponentResponse(BaseModel):
    id: int
    component_name: str
    quantity: float
    unit: str

    class Config:
        from_attributes = True

class BOMOperationCreate(BaseModel):
    operation_name: str
    duration_minutes: int
    work_center: str

class BOMOperationResponse(BaseModel):
    id: int
    operation_name: str
    duration_minutes: int
    work_center: str

    class Config:
        from_attributes = True

class BOMCreate(BaseModel):
    product_id: int
    components: List[BOMComponentCreate]
    operations: List[BOMOperationCreate]

class BOMResponse(BaseModel):
    id: int
    product_id: int
    version: int
    status: BOMStatus
    created_at: datetime
    components: List[BOMComponentResponse]
    operations: List[BOMOperationResponse]

    class Config:
        from_attributes = True
