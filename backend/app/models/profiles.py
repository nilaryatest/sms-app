from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.core.database import Base

class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    roll_number = Column(String, unique=True, index=True)
    enrollment_date = Column(Date)
    
    # Section Assignment (e.g., Grade 10 - Section A)
    section_id = Column(Integer, ForeignKey("sections.id"))

    # Relationships
    user = relationship("User", back_populates="student_profile")
    section = relationship("Section", back_populates="students")
    results = relationship("Result", back_populates="student")

class TeacherProfile(Base):
    __tablename__ = "teacher_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    employee_id = Column(String, unique=True, index=True)
    joining_date = Column(Date)

    user = relationship("User", back_populates="teacher_profile")
    sections = relationship("Section", back_populates="class_teacher")
