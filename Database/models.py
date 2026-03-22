"""SQLAlchemy models for PLM system"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from database import Base
import enum


# ====================== Enums ======================

class UserRole(str, enum.Enum):
    """User roles in the system"""
    ENGINEERING = "Engineering"
    APPROVER = "Approver"
    OPERATIONS = "Operations"
    ADMIN = "Admin"


class ProductStatus(str, enum.Enum):
    """Product status"""
    ACTIVE = "Active"
    ARCHIVED = "Archived"


class ECOType(str, enum.Enum):
    """Engineering Change Order type"""
    PRODUCT = "Product"
    BOM = "BoM"


class ECOStageName(str, enum.Enum):
    """ECO stage names"""
    NEW = "New"
    APPROVAL = "Approval"
    DONE = "Done"


class ApprovalStatus(str, enum.Enum):
    """Approval status"""
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"


# ====================== Models ======================

class User(Base):
    """User model"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.ENGINEERING)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    eco_created = relationship("EngineeringChangeOrder", back_populates="created_by_user", foreign_keys="EngineeringChangeOrder.created_by")
    eco_approved = relationship("ECOApproval", back_populates="approved_by_user")
    audit_logs = relationship("AuditLog", back_populates="changed_by_user")


class Product(Base):
    """Product model"""
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    sale_price = Column(Float, nullable=False)
    cost_price = Column(Float, nullable=False)
    current_version = Column(Integer, default=1, nullable=False)
    status = Column(Enum(ProductStatus), default=ProductStatus.ACTIVE, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    versions = relationship("ProductVersion", back_populates="product", cascade="all, delete-orphan")
    eco_orders = relationship("EngineeringChangeOrder", back_populates="product")
    as_component = relationship("BoMComponent", back_populates="component_product", foreign_keys="BoMComponent.component_product_id")


class ProductVersion(Base):
    """Product Version model"""
    __tablename__ = "product_versions"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    version_number = Column(Integer, nullable=False)
    sale_price = Column(Float, nullable=False)
    cost_price = Column(Float, nullable=False)
    attachment_url = Column(String(500), nullable=True)
    status = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    product = relationship("Product", back_populates="versions")
    bom_list = relationship("BillOfMaterial", back_populates="product_version", cascade="all, delete-orphan")


class BillOfMaterial(Base):
    """Bill of Material model"""
    __tablename__ = "bills_of_materials"

    id = Column(Integer, primary_key=True, index=True)
    product_version_id = Column(Integer, ForeignKey("product_versions.id"), nullable=False)
    bom_version = Column(Integer, nullable=False)
    status = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    product_version = relationship("ProductVersion", back_populates="bom_list")
    components = relationship("BoMComponent", back_populates="bom", cascade="all, delete-orphan")
    operations = relationship("Operation", back_populates="bom", cascade="all, delete-orphan")
    eco_orders = relationship("EngineeringChangeOrder", back_populates="bom")


class BoMComponent(Base):
    """Bill of Material Component model"""
    __tablename__ = "bom_components"

    id = Column(Integer, primary_key=True, index=True)
    bom_id = Column(Integer, ForeignKey("bills_of_materials.id"), nullable=False)
    component_product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Float, nullable=False)

    # Relationships
    bom = relationship("BillOfMaterial", back_populates="components")
    component_product = relationship("Product", back_populates="as_component", foreign_keys=[component_product_id])


class Operation(Base):
    """Operation model"""
    __tablename__ = "operations"

    id = Column(Integer, primary_key=True, index=True)
    bom_id = Column(Integer, ForeignKey("bills_of_materials.id"), nullable=False)
    operation_name = Column(String(255), nullable=False)
    time_minutes = Column(Float, nullable=False)
    work_center = Column(String(100), nullable=False)

    # Relationships
    bom = relationship("BillOfMaterial", back_populates="operations")


class ECOStage(Base):
    """Engineering Change Order Stage model"""
    __tablename__ = "eco_stages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(Enum(ECOStageName), unique=True, nullable=False)
    sequence_order = Column(Integer, nullable=False)
    approval_required = Column(Boolean, default=False, nullable=False)

    # Relationships
    eco_orders = relationship("EngineeringChangeOrder", back_populates="stage")


class EngineeringChangeOrder(Base):
    """Engineering Change Order model"""
    __tablename__ = "engineering_change_orders"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    eco_type = Column(Enum(ECOType), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    bom_id = Column(Integer, ForeignKey("bills_of_materials.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    effective_date = Column(DateTime, nullable=False)
    version_update = Column(Boolean, default=False, nullable=False)
    stage_id = Column(Integer, ForeignKey("eco_stages.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    product = relationship("Product", back_populates="eco_orders")
    bom = relationship("BillOfMaterial", back_populates="eco_orders")
    created_by_user = relationship("User", back_populates="eco_created", foreign_keys=[created_by])
    stage = relationship("ECOStage", back_populates="eco_orders")
    approvals = relationship("ECOApproval", back_populates="eco", cascade="all, delete-orphan")


class ECOApproval(Base):
    """ECO Approval model"""
    __tablename__ = "eco_approvals"

    id = Column(Integer, primary_key=True, index=True)
    eco_id = Column(Integer, ForeignKey("engineering_change_orders.id"), nullable=False)
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    approval_date = Column(DateTime, nullable=True)
    status = Column(Enum(ApprovalStatus), default=ApprovalStatus.PENDING, nullable=False)

    # Relationships
    eco = relationship("EngineeringChangeOrder", back_populates="approvals")
    approved_by_user = relationship("User", back_populates="eco_approved")


class AuditLog(Base):
    """Audit Log model"""
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(50), nullable=False)
    table_name = Column(String(100), nullable=False)
    record_id = Column(Integer, nullable=False)
    old_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)
    changed_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    changed_by_user = relationship("User", back_populates="audit_logs")
