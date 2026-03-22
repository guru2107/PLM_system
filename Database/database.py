"""Database connection and session management"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from typing import Generator

# Database configuration
DATABASE_URL = "postgresql://postgres:Jainam051205%40@localhost:5432/plm_db"

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Set to False in production
    future=True,
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,
)

# Base class for all models
Base = declarative_base()


def get_db() -> Generator:
    """Dependency injection for FastAPI to get DB session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables in the database"""
    Base.metadata.create_all(bind=engine)


def drop_db():
    """Drop all tables from the database (use with caution!)"""
    Base.metadata.drop_all(bind=engine)
