import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
from app.config import settings
from app.database import engine, Base
from app.seed import seed_database
from app.routers import (
    auth, profile, projects, skills, experience, education,
    contact, upload, media, social_links, journey, certifications, achievements, settings as settings_router
)

# Initialize database schema
Base.metadata.create_all(bind=engine)

# Upload directory
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: auto-seed data if database is empty
    try:
        seed_database()
    except Exception as e:
        print(f"Startup seed notice: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Placement-grade REST API powering the personal portfolio application. Features automated OpenAPI documentation, short-lived JWT authentication with refresh tokens, rate-limited inquiries, and storage adapters.",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Security Headers Middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response

app.add_middleware(SecurityHeadersMiddleware)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static uploads directory (dev fallback)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Register API v1 Routers
api_v1 = settings.API_V1_STR
app.include_router(auth.router, prefix=api_v1)
app.include_router(profile.router, prefix=api_v1)
app.include_router(projects.router, prefix=api_v1)
app.include_router(skills.router, prefix=api_v1)
app.include_router(journey.router, prefix=api_v1)
app.include_router(certifications.router, prefix=api_v1)
app.include_router(experience.router, prefix=api_v1)
app.include_router(education.router, prefix=api_v1)
app.include_router(achievements.router, prefix=api_v1)
app.include_router(contact.router, prefix=api_v1)
app.include_router(upload.router, prefix=api_v1)
app.include_router(media.router, prefix=api_v1)
app.include_router(social_links.router, prefix=api_v1)
app.include_router(settings_router.router, prefix=api_v1)

@app.get("/", tags=["Health"])
def root():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "api_v1": api_v1
    }

@app.get("/health", tags=["Health"])
@app.get("/api/health", tags=["Health"])
@app.get(f"{api_v1}/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
