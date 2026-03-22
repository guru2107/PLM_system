from sqlalchemy import Column, Integer, String, Enum, DateTime
from datetime import datetime
import enum
from app.core.database import Base

class RoleEnum(str, enum.Enum):
    engineering = "engineering"
    approver = "approver"
    operations = "operations"
    admin = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
