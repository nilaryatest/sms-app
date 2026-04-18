from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.user import User, UserRole
from app.core.security import get_password_hash

def seed_db():
    db = SessionLocal()
    try:
        # Check if admin already exists
        # Check if admin already exists
        admin = db.query(User).filter(User.email == "admin@school.com").first()
        if not admin:
            print("Creating admin...")
            admin = User(
                email="admin@school.com",
                hashed_password=get_password_hash("admin123"),
                first_name="System",
                last_name="Admin",
                role=UserRole.ADMIN,
                is_active=True
            )
            db.add(admin)
            db.commit()
            print("Super admin created successfully.")
        else:
            print("Admin user already exists.")
            
        superadmin = db.query(User).filter(User.email == "superadmin@school.com").first()
        if not superadmin:
            print("Creating super admin...")
            superadmin = User(
                email="superadmin@school.com",
                hashed_password=get_password_hash("superadmin123"),
                first_name="Super",
                last_name="Admin",
                role=UserRole.SUPERADMIN,
                is_active=True
            )
            db.add(superadmin)
            db.commit()
            print("Super admin created successfully.")
            
        clerk = db.query(User).filter(User.email == "clerk@school.com").first()
        if not clerk:
            print("Creating clerk...")
            clerk = User(
                email="clerk@school.com",
                hashed_password=get_password_hash("clerk123"),
                first_name="Financial",
                last_name="Clerk",
                role=UserRole.CLERK,
                is_active=True
            )
            db.add(clerk)
            db.commit()
            print("Clerk created successfully.")
            
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
            
        # --- Add Basic Academic Data & Profiles ---
        from app.models.academic import ClassRoom, Section
        from app.models.profiles import TeacherProfile, StudentProfile
        from datetime import datetime

        # Ensure at least one Class and Section exists
        classroom = db.query(ClassRoom).filter(ClassRoom.name == "Class 10").first()
        if not classroom:
            classroom = ClassRoom(name="Class 10")
            db.add(classroom)
            db.commit()
            db.refresh(classroom)

        section = db.query(Section).filter(Section.name == "A").first()
        if not section:
            section = Section(name="A", class_id=classroom.id)
            db.add(section)
            db.commit()
            db.refresh(section)

        # Create Teacher Profile
        teacher_profile = db.query(TeacherProfile).filter(TeacherProfile.user_id == teacher.id).first()
        if not teacher_profile:
            teacher_profile = TeacherProfile(
                user_id=teacher.id,
                employee_id="T001",
                designation="Senior Math Teacher",
                department="Mathematics",
                joining_date=datetime.now().date(),
                contact_number="555-0011",
                address="123 Teacher Lane"
            )
            db.add(teacher_profile)
            db.commit()

        # Create Student Profile
        student_profile = db.query(StudentProfile).filter(StudentProfile.user_id == student.id).first()
        if not student_profile:
            student_profile = StudentProfile(
                user_id=student.id,
                admission_number="ADM-2026-01",
                roll_number="10",
                class_id=classroom.id,
                section_id=section.id,
                date_of_birth=datetime(2010, 5, 15).date(),
                gender="Female",
                blood_group="O+",
                guardian_name="Mr. Smith",
                guardian_contact="555-0099",
                address="456 Student Blvd"
            )
            db.add(student_profile)
            db.commit()
            
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
