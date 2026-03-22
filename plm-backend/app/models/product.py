from sqlalchemy import Column, Integer, String, Float, Enum, DateTime
from datetime import datetime
import enum
from app.core.database import Base

class ProductStatus(str, enum.Enum):
    active = "active"
    archived = "archived"

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    sale_price = Column(Float, default=0.0)
    cost_price = Column(Float, default=0.0)
    version = Column(Integer, default=1)
    status = Column(Enum(ProductStatus), default=ProductStatus.active)
    attachments = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
