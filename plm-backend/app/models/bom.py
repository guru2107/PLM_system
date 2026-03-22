from sqlalchemy import Column, Integer, String, Float, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base

class BOMStatus(str, enum.Enum):
    active = "active"
    archived = "archived"

class BOM(Base):
    __tablename__ = "boms"

    id = Column(Integer, primary_key=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    version = Column(Integer, default=1)
    status = Column(Enum(BOMStatus), default=BOMStatus.active)
    created_at = Column(DateTime, default=datetime.utcnow)

    components = relationship("BOMComponent", back_populates="bom", cascade="all, delete-orphan")
    operations = relationship("BOMOperation", back_populates="bom", cascade="all, delete-orphan")

class BOMComponent(Base):
    __tablename__ = "bom_components"

    id = Column(Integer, primary_key=True)
    bom_id = Column(Integer, ForeignKey("boms.id"), nullable=False)
    component_name = Column(String(255), nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String(50), default="pcs")

    bom = relationship("BOM", back_populates="components")

class BOMOperation(Base):
    __tablename__ = "bom_operations"

    id = Column(Integer, primary_key=True)
    bom_id = Column(Integer, ForeignKey("boms.id"), nullable=False)
    operation_name = Column(String(255), nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    work_center = Column(String(255), nullable=False)

    bom = relationship("BOM", back_populates="operations")
