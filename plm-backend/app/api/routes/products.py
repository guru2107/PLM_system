from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.product import Product, ProductStatus
from app.models.user import User, RoleEnum
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.deps import get_current_user, require_roles

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[ProductResponse])
def get_products(status: str = "active", db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Product)
    if current_user.role == RoleEnum.operations:
        status = "active"
    if status:
        query = query.filter(Product.status == status)
    return query.all()

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product_in: ProductCreate, db: Session = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.engineering, RoleEnum.admin))):
    db_product = Product(**product_in.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/{id}", response_model=ProductResponse)
def get_product(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{id}", response_model=ProductResponse)
def update_product(id: int, product_in: ProductUpdate, db: Session = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.engineering, RoleEnum.admin))):
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = product_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(product, key, value)
    
    db.commit()
    db.refresh(product)
    return product

@router.delete("/{id}")
def delete_product(id: int, db: Session = Depends(get_db), current_user: User = Depends(require_roles(RoleEnum.admin))):
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product.status = ProductStatus.archived
    db.commit()
    return {"message": "Product archived successfully"}
