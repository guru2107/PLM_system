from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import auth

app = FastAPI(title="PLM System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.routes import products, bom, eco
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(bom.router)
app.include_router(eco.router)

@app.get("/")
def root():
    return {"message": "PLM System API", "status": "running"}

if __name__ == "__main__":
    import uvicorn
    from app.core.config import settings
    # Runs the server using the HOST and PORT specified in .env
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
