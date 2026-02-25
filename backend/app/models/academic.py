from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class ClassRoom(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # e.g., "Grade 10"
    
    sections = relationship("Section", back_populates="class_room")

class Section(Base):
    __tablename__ = "sections"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)  # e.g., "A", "B", "C"
    class_id = Column(Integer, ForeignKey("classes.id"))
    class_teacher_id = Column(Integer, ForeignKey("teacher_profiles.id"), nullable=True)
    
    class_room = relationship("ClassRoom", back_populates="sections")
    class_teacher = relationship("TeacherProfile", back_populates="sections")
    students = relationship("StudentProfile", back_populates="section")
    
class Subject(Base):
    __tablename__ = "subjects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False) # e.g., "Mathematics"
    code = Column(String, unique=True, index=True) # e.g., "MATH101"
