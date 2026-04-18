from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from app.api.api_v1.api import api_router

load_dotenv()

app = FastAPI(title="School Management System API", version="1.0.0")

# Build CORS origins list from environment. 
# Update these domains if you move to a custom domain.
allowed_origins = [
    "https://sms-app-red.vercel.app",
    "https://school-website-sigma-one.vercel.app"
]

# You can also add custom domains dynamically using the FRONTEND_URL environment variable
# on your Render dashboard (comma separated for multiple)
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    for url in frontend_url.split(","):
        clean_url = url.strip().rstrip("/")
        if clean_url and clean_url not in allowed_origins:
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
