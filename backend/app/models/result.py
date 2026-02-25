from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.core.database import Base

class Result(Base):
    __tablename__ = "results"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id"))
    subject_id = Column(Integer, ForeignKey("subjects.id"))
    teacher_id = Column(Integer, ForeignKey("teacher_profiles.id")) # Teacher who graded/published
    
    exam_name = Column(String, nullable=False) # e.g., "Mid-Term", "Final"
    marks_obtained = Column(Float, nullable=False)
    total_marks = Column(Float, nullable=False)
    grade = Column(String) # A, B, C, F
    date_published = Column(Date)
    
    # Relationships
    student = relationship("StudentProfile", back_populates="results")
    subject = relationship("Subject")
    teacher = relationship("TeacherProfile")
