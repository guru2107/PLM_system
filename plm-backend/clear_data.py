"""
Script to clear all data from the database while keeping tables intact
"""
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models.user import User
from app.models.product import Product
from app.models.bom import BOM, BOMComponent, BOMOperation
from app.models.eco import ECO, ECOStage

def clear_all_data():
    """Delete all data from all tables"""
    db: Session = SessionLocal()
    try:
        # Delete in order of dependencies (foreign keys)
        print("Clearing ECOs...")
        db.query(ECO).delete()
        
        print("Clearing BOM Operations...")
        db.query(BOMOperation).delete()
        
        print("Clearing BOM Components...")
        db.query(BOMComponent).delete()
        
        print("Clearing BOMs...")
        db.query(BOM).delete()
        
        print("Clearing Products...")
        db.query(Product).delete()
        
        print("Clearing Users...")
        db.query(User).delete()
        
        print("Clearing ECO Stages...")
        db.query(ECOStage).delete()
        
        db.commit()
        print("✅ All data cleared successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    clear_all_data()
