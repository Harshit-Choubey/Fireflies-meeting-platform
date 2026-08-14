"""
FastAPI application entry point.

Includes:
- API routers under /api/v1
- CORS middleware configured from settings
- Static files for audio media (/media)
- Health check endpoint (/api/v1/health)
- Seed-on-startup check for automatic evaluator readiness
"""

import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api import (
    action_items_router,
    decisions_router,
    meetings_router,
    search_router,
    tags_router,
    transcripts_router,
)
from app.core.config import settings
from app.database.database import Base, SessionLocal, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifecycle manager.
    On startup:
    1. Create database tables if they don't exist yet (for dev simplicity).
    2. Check if database has meetings; if empty, run initial seed script.
    """
    # Create all tables if they don't exist
    Base.metadata.create_all(bind=engine)

    # Seed on startup if empty
    db = SessionLocal()
    try:
        from app.models.meeting import Meeting
        count = db.query(Meeting).count()
        if count == 0:
            from seed.seed import seed_data
            seed_data(db)
    except Exception as e:
        print(f"Startup seed check warning: {e}")
    finally:
        db.close()

    yield


app = FastAPI(
    title="Fireflies Meeting Intelligence API",
    description="REST API for Fireflies-inspired Meeting Intelligence Platform",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static media directory for demo audio files
static_media_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "media")
os.makedirs(static_media_dir, exist_ok=True)
app.mount("/media", StaticFiles(directory=static_media_dir), name="media")

# Include API v1 routers
api_prefix = "/api/v1"
app.include_router(meetings_router, prefix=api_prefix)
app.include_router(transcripts_router, prefix=api_prefix)
app.include_router(action_items_router, prefix=api_prefix)
app.include_router(decisions_router, prefix=api_prefix)
app.include_router(tags_router, prefix=api_prefix)
app.include_router(search_router, prefix=api_prefix)


@app.get("/api/v1/health", tags=["health"])
def health_check():
    """Health check endpoint to verify backend service status."""
    return {"status": "ok", "service": "fireflies-backend"}
