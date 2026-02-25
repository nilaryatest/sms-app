from app.core.database import Base
from app.models.user import User
from app.models.academic import ClassRoom, Section, Subject
from app.models.profiles import StudentProfile, TeacherProfile
from app.models.result import Result

# This ensures all models are loaded when Alembic imports this module,
# allowing Alembic to detect the metadata and create the migrations correctly.
