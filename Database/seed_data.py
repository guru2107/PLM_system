"""Seed data for initial database population"""
from datetime import datetime, timedelta
from database import SessionLocal, engine, Base
from models import (
    User, Product, ProductVersion, BillOfMaterial, BoMComponent, Operation,
    ECOStage, EngineeringChangeOrder, ECOApproval, AuditLog,
    UserRole, ProductStatus, ECOType, ECOStageName, ApprovalStatus
)


def seed_database():
    """Populate database with seed data"""
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(User).first() is not None:
            print("Database already seeded. Skipping...")
            return
        
        # ====================== ECO Stages ======================
        print("Seeding ECO Stages...")
        new_stage = ECOStage(name=ECOStageName.NEW, sequence_order=1, approval_required=False)
        approval_stage = ECOStage(name=ECOStageName.APPROVAL, sequence_order=2, approval_required=True)
        done_stage = ECOStage(name=ECOStageName.DONE, sequence_order=3, approval_required=False)
        
        db.add_all([new_stage, approval_stage, done_stage])
        db.flush()
        
        # ====================== Users ======================
        print("Seeding Users...")
        user_engineering = User(
            name="John Engineer",
            email="john.engineer@company.com",
            password="hashed_password_1",
            role=UserRole.ENGINEERING
        )
        
        user_approver = User(
            name="Sarah Approver",
            email="sarah.approver@company.com",
            password="hashed_password_2",
            role=UserRole.APPROVER
        )
        
        user_operations = User(
            name="Mike Operations",
            email="mike.operations@company.com",
            password="hashed_password_3",
            role=UserRole.OPERATIONS
        )
        
        user_admin = User(
            name="Admin User",
            email="admin@company.com",
            password="hashed_password_4",
            role=UserRole.ADMIN
        )
        
        db.add_all([user_engineering, user_approver, user_operations, user_admin])
        db.flush()
        
        # ====================== Products ======================
        print("Seeding Products...")
        product1 = Product(
            name="Pump Assembly",
            sale_price=500.00,
            cost_price=250.00,
            current_version=1,
            status=ProductStatus.ACTIVE
        )
        
        product2 = Product(
            name="Valve Assembly",
            sale_price=300.00,
            cost_price=150.00,
            current_version=1,
            status=ProductStatus.ACTIVE
        )
        
        db.add_all([product1, product2])
        db.flush()
        
        # ====================== Product Versions ======================
        print("Seeding Product Versions...")
        product1_v1 = ProductVersion(
            product_id=product1.id,
            version_number=1,
            sale_price=500.00,
            cost_price=250.00,
            attachment_url="https://docs.example.com/pump-v1.pdf",
            status="Active"
        )
        
        product2_v1 = ProductVersion(
            product_id=product2.id,
            version_number=1,
            sale_price=300.00,
            cost_price=150.00,
            attachment_url="https://docs.example.com/valve-v1.pdf",
            status="Active"
        )
        
        db.add_all([product1_v1, product2_v1])
        db.flush()
        
        # ====================== Bills of Materials ======================
        print("Seeding Bills of Materials...")
        bom1 = BillOfMaterial(
            product_version_id=product1_v1.id,
            bom_version=1,
            status="Active"
        )
        
        db.add(bom1)
        db.flush()
        
        # ====================== BoM Components ======================
        print("Seeding BoM Components...")
        component1 = BoMComponent(
            bom_id=bom1.id,
            component_product_id=product2.id,
            quantity=2.0
        )
        
        db.add(component1)
        db.flush()
        
        # ====================== Operations ======================
        print("Seeding Operations...")
        operation1 = Operation(
            bom_id=bom1.id,
            operation_name="Assembly",
            time_minutes=45.0,
            work_center="WC-001"
        )
        
        operation2 = Operation(
            bom_id=bom1.id,
            operation_name="Testing",
            time_minutes=30.0,
            work_center="WC-002"
        )
        
        db.add_all([operation1, operation2])
        db.flush()
        
        # ====================== Engineering Change Orders ======================
        print("Seeding Engineering Change Orders...")
        eco1 = EngineeringChangeOrder(
            title="Upgrade Pump Pressure Rating",
            eco_type=ECOType.PRODUCT,
            product_id=product1.id,
            bom_id=None,
            created_by=user_engineering.id,
            effective_date=datetime.utcnow() + timedelta(days=30),
            version_update=True,
            stage_id=new_stage.id
        )
        
        db.add(eco1)
        db.flush()
        
        # ====================== ECO Approvals ======================
        print("Seeding ECO Approvals...")
        approval1 = ECOApproval(
            eco_id=eco1.id,
            approved_by=user_approver.id,
            status=ApprovalStatus.PENDING
        )
        
        db.add(approval1)
        db.flush()
        
        # ====================== Audit Logs ======================
        print("Seeding Audit Logs...")
        audit1 = AuditLog(
            action="INSERT",
            table_name="products",
            record_id=product1.id,
            old_value=None,
            new_value="Pump Assembly created",
            changed_by=user_admin.id
        )
        
        audit2 = AuditLog(
            action="INSERT",
            table_name="engineering_change_orders",
            record_id=eco1.id,
            old_value=None,
            new_value="ECO created for Pump Assembly",
            changed_by=user_engineering.id
        )
        
        db.add_all([audit1, audit2])
        
        # Commit all changes
        db.commit()
        print("\n✓ Database seeded successfully!")
        print(f"  - 4 Users created")
        print(f"  - 2 Products created")
        print(f"  - 2 Product Versions created")
        print(f"  - 1 Bill of Material created")
        print(f"  - 1 BoM Component created")
        print(f"  - 2 Operations created")
        print(f"  - 3 ECO Stages created")
        print(f"  - 1 Engineering Change Order created")
        print(f"  - 1 ECO Approval created")
        print(f"  - 2 Audit Logs created")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()


def clear_database():
    """Clear all data from database (be careful!)"""
    db = SessionLocal()
    try:
        # Delete in reverse order of dependencies
        db.query(AuditLog).delete()
        db.query(ECOApproval).delete()
        db.query(EngineeringChangeOrder).delete()
        db.query(Operation).delete()
        db.query(BoMComponent).delete()
        db.query(BillOfMaterial).delete()
        db.query(ProductVersion).delete()
        db.query(Product).delete()
        db.query(ECOStage).delete()
        db.query(User).delete()
        
        db.commit()
        print("✓ Database cleared successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error clearing database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1 and sys.argv[1] == "--clear":
        clear_database()
    else:
        seed_database()
