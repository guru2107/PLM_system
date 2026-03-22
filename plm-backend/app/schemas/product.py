from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from app.models.product import ProductStatus

class ProductCreate(BaseModel):
    name: str
    sale_price: float = 0.0
    cost_price: float = 0.0
    attachments: Optional[str] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sale_price: Optional[float] = None
    cost_price: Optional[float] = None
    attachments: Optional[str] = None

class ProductResponse(BaseModel):
    id: int
    name: str
    sale_price: float
    cost_price: float
    version: int
    status: ProductStatus
    attachments: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
