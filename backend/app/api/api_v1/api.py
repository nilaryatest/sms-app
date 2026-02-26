from fastapi import APIRouter
from app.api.api_v1.endpoints import auth, users, students, results, id_card, academics, super_admin, finance, communication, routine

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(results.router, prefix="/results", tags=["results"])
api_router.include_router(id_card.router, prefix="/id-card", tags=["id-card"])
api_router.include_router(academics.router, prefix="/academics", tags=["academics"])
api_router.include_router(super_admin.router, prefix="/super-admin", tags=["super-admin"])
api_router.include_router(finance.router, prefix="/finance", tags=["finance"])
api_router.include_router(communication.router, prefix="/communication", tags=["communication"])
api_router.include_router(routine.router, prefix="/routine", tags=["routine"])
