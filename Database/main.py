"""Main FastAPI application"""
from fastapi import FastAPI, Depends, HTTPException, Request, Header
from sqlalchemy.orm import Session
from database import get_db, init_db
from models import User, Product, EngineeringChangeOrder
from schemas import (
    UserResponse, ProductResponse, EngineeringChangeOrderResponse
)
from typing import List

# Initialize FastAPI app
app = FastAPI(
    title="PLM System API",
    description="Product Lifecycle Management with Engineering Change Orders",
    version="1.0.0"
)

# API Key Configuration
ALLOWED_API_KEY = "10.190.117.97"  # Your IP address as API key

# API Key dependency
def verify_api_key(x_api_key: str = Header(None, alias="X-API-Key")):
    """Verify API key from request headers"""
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API Key required")
    if x_api_key != ALLOWED_API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return x_api_key


# ====================== Health Check ======================

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "PLM System API is running"}


# ====================== User Endpoints ======================

@app.get("/api/users", response_model=List[UserResponse], tags=["Users"])
async def get_users(api_key: str = Depends(verify_api_key), db: Session = Depends(get_db)):
    """Get all users"""
    users = db.query(User).all()
    return users


@app.get("/api/users/{user_id}", response_model=UserResponse, tags=["Users"])
async def get_user(user_id: int, api_key: str = Depends(verify_api_key), db: Session = Depends(get_db)):
    """Get user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}
    return user


# ====================== Product Endpoints ======================

@app.get("/api/products", response_model=List[ProductResponse], tags=["Products"])
async def get_products(api_key: str = Depends(verify_api_key), db: Session = Depends(get_db)):
    """Get all products"""
    products = db.query(Product).all()
    return products


@app.get("/api/products/{product_id}", response_model=ProductResponse, tags=["Products"])
async def get_product(product_id: int, api_key: str = Depends(verify_api_key), db: Session = Depends(get_db)):
    """Get product by ID"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return {"error": "Product not found"}
    return product


# ====================== ECO Endpoints ======================

@app.get("/api/ecos", response_model=List[EngineeringChangeOrderResponse], tags=["ECO"])
async def get_ecos(api_key: str = Depends(verify_api_key), db: Session = Depends(get_db)):
    """Get all engineering change orders"""
    ecos = db.query(EngineeringChangeOrder).all()
    return ecos


@app.get("/api/ecos/{eco_id}", response_model=EngineeringChangeOrderResponse, tags=["ECO"])
async def get_eco(eco_id: int, api_key: str = Depends(verify_api_key), db: Session = Depends(get_db)):
    """Get ECO by ID"""
    eco = db.query(EngineeringChangeOrder).filter(EngineeringChangeOrder.id == eco_id).first()
    if not eco:
        return {"error": "ECO not found"}
    return eco


# ====================== Startup Events ======================

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()
    print("✓ Database initialized")


# ====================== Run Server ======================

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting PLM API Server with API Key Authentication...")
    print(f"📋 API Key: {ALLOWED_API_KEY}")
    print("🔗 API URL: http://localhost:8000")
    print("📖 Docs: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
