from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey, Boolean, Date
from datetime import datetime
import enum
from app.core.database import Base

class ECOType(str, enum.Enum):
    product = "product"
    bom = "bom"

class ECOStatus(str, enum.Enum):
    open = "open"
    applied = "applied"

class ECOStage(Base):
    __tablename__ = "eco_stages"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    requires_approval = Column(Boolean, default=False)
    approver_role = Column(String(50), nullable=True)
    approver_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    order = Column(Integer, nullable=False)
    is_default = Column(Boolean, default=False)

class ECO(Base):
    __tablename__ = "ecos"

    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    eco_type = Column(Enum(ECOType), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    bom_id = Column(Integer, ForeignKey("boms.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    stage_id = Column(Integer, ForeignKey("eco_stages.id"), nullable=False)
    version_update = Column(Boolean, default=True)
    effective_date = Column(Date, nullable=True)
    status = Column(Enum(ECOStatus), default=ECOStatus.open)
    created_at = Column(DateTime, default=datetime.utcnow)
