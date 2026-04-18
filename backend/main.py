from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.api.api_v1.api import api_router

load_dotenv()

app = FastAPI(title="School Management System API", version="1.0.0")

# Build CORS origins list from environment
allowed_origins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"]
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    # Remove any trailing slashes and spaces which would break CORS exact matching
    clean_url = frontend_url.strip().rstrip("/")
    allowed_origins.append(clean_url)

# CORS config allowing frontend to fetch
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to the SMS API. Documentation at /docs"}
