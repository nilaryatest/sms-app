from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import User, UserRole
from app.core.security import get_password_hash

def seed_db():
    db = SessionLocal()
    try:
        # Check if admin already exists
        admin = db.query(User).filter(User.email == "admin@school.com").first()
        if not admin:
            print("Creating super admin...")
            admin = User(
                email="admin@school.com",
                hashed_password=get_password_hash("admin123"),
                first_name="Super",
                last_name="Admin",
                role=UserRole.ADMIN,
                is_active=True
            )
            db.add(admin)
            db.commit()
            print("Super admin created successfully.")
        else:
            print("Admin user already exists.")
            
        # Optional: Add a sample teacher and student
        teacher_email = "teacher@school.com"
        teacher = db.query(User).filter(User.email == teacher_email).first()
        if not teacher:
            print("Creating sample teacher...")
            teacher = User(
                email=teacher_email,
                hashed_password=get_password_hash("password123"),
                first_name="John",
                last_name="Doe",
                role=UserRole.TEACHER,
                is_active=True
            )
            db.add(teacher)
            db.commit()

        student_email = "student@school.com"
        student = db.query(User).filter(User.email == student_email).first()
        if not student:
            print("Creating sample student...")
            student = User(
                email=student_email,
                hashed_password=get_password_hash("password123"),
                first_name="Jane",
                last_name="Smith",
                role=UserRole.STUDENT,
                is_active=True
            )
            db.add(student)
            db.commit()
            
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
