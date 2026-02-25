from pydantic import BaseModel
from typing import List, Optional

class SectionBase(BaseModel):
    name: str

class SectionCreate(SectionBase):
    class_id: int

class Section(SectionBase):
    id: int
    class_id: int

    class Config:
        from_attributes = True

class ClassRoomBase(BaseModel):
    name: str

class ClassRoomCreate(ClassRoomBase):
    pass

class ClassRoom(ClassRoomBase):
    id: int
    sections: List[Section] = []

    class Config:
        from_attributes = True

class SubjectBase(BaseModel):
    name: str
    code: str

class SubjectCreate(SubjectBase):
    pass

class Subject(SubjectBase):
    id: int

    class Config:
        from_attributes = True
