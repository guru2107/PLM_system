"""Pydantic schemas for request/response validation"""
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List
from enum import Enum


# ====================== Enums ======================

class UserRoleSchema(str, Enum):
    ENGINEERING = "Engineering"
    APPROVER = "Approver"
    OPERATIONS = "Operations"
    ADMIN = "Admin"


class ProductStatusSchema(str, Enum):
    ACTIVE = "Active"
    ARCHIVED = "Archived"


class ECOTypeSchema(str, Enum):
    PRODUCT = "Product"
    BOM = "BoM"


class ECOStageNameSchema(str, Enum):
    NEW = "New"
    APPROVAL = "Approval"
    DONE = "Done"


class ApprovalStatusSchema(str, Enum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"


# ====================== User Schemas ======================

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRoleSchema


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: UserRoleSchema
    created_at: datetime

    class Config:
        from_attributes = True


# ====================== Product Schemas ======================

class ProductCreate(BaseModel):
    name: str
    sale_price: float
    cost_price: float


class ProductResponse(BaseModel):
    id: int
    name: str
    sale_price: float
    cost_price: float
    current_version: int
    status: ProductStatusSchema
    created_at: datetime

    class Config:
        from_attributes = True


# ====================== Product Version Schemas ======================

class ProductVersionCreate(BaseModel):
    product_id: int
    version_number: int
    sale_price: float
    cost_price: float
    attachment_url: Optional[str] = None
    status: str


class ProductVersionResponse(BaseModel):
    id: int
    product_id: int
    version_number: int
    sale_price: float
    cost_price: float
    attachment_url: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# ====================== BoM Schemas ======================

class BoMComponentCreate(BaseModel):
    component_product_id: int
    quantity: float


class BoMComponentResponse(BaseModel):
    id: int
    bom_id: int
    component_product_id: int
    quantity: float

    class Config:
        from_attributes = True


class OperationCreate(BaseModel):
    operation_name: str
    time_minutes: float
    work_center: str


class OperationResponse(BaseModel):
    id: int
    bom_id: int
    operation_name: str
    time_minutes: float
    work_center: str

    class Config:
        from_attributes = True


class BillOfMaterialCreate(BaseModel):
    product_version_id: int
    bom_version: int
    status: str
    components: Optional[List[BoMComponentCreate]] = None
    operations: Optional[List[OperationCreate]] = None


class BillOfMaterialResponse(BaseModel):
    id: int
    product_version_id: int
    bom_version: int
    status: str
    created_at: datetime
    components: Optional[List[BoMComponentResponse]] = None
    operations: Optional[List[OperationResponse]] = None

    class Config:
        from_attributes = True


# ====================== ECO Stage Schemas ======================

class ECOStageCreate(BaseModel):
    name: ECOStageNameSchema
    sequence_order: int
    approval_required: bool


class ECOStageResponse(BaseModel):
    id: int
    name: ECOStageNameSchema
    sequence_order: int
    approval_required: bool

    class Config:
        from_attributes = True


# ====================== ECO Approval Schemas ======================

class ECOApprovalCreate(BaseModel):
    eco_id: int
    approved_by: int
    status: ApprovalStatusSchema


class ECOApprovalResponse(BaseModel):
    id: int
    eco_id: int
    approved_by: int
    approval_date: Optional[datetime]
    status: ApprovalStatusSchema

    class Config:
        from_attributes = True


# ====================== ECO Schemas ======================

class EngineeringChangeOrderCreate(BaseModel):
    title: str
    eco_type: ECOTypeSchema
    product_id: Optional[int] = None
    bom_id: Optional[int] = None
    effective_date: datetime
    version_update: bool = False


class EngineeringChangeOrderResponse(BaseModel):
    id: int
    title: str
    eco_type: ECOTypeSchema
    product_id: Optional[int]
    bom_id: Optional[int]
    created_by: int
    effective_date: datetime
    version_update: bool
    stage_id: int
    created_at: datetime
    approvals: Optional[List[ECOApprovalResponse]] = None

    class Config:
        from_attributes = True


# ====================== Audit Log Schemas ======================

class AuditLogResponse(BaseModel):
    id: int
    action: str
    table_name: str
    record_id: int
    old_value: Optional[str]
    new_value: Optional[str]
    changed_by: int
    timestamp: datetime

    class Config:
        from_attributes = True
