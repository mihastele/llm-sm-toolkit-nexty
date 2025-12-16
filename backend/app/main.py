from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import structlog

from app.api import auth, projects, models, datasets, training, endpoints, research, assistant
from app.core.config import settings

logger = structlog.get_logger()

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting LLM Toolkit API")
    yield
    logger.info("Shutting down LLM Toolkit API")

app = FastAPI(
    title="LLM Toolkit API",
    description="Backend API for LLM fine-tuning, deployment, and deep research",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(models.router, prefix="/api/models", tags=["models"])
app.include_router(datasets.router, prefix="/api/projects/{project_id}/datasets", tags=["datasets"])
app.include_router(training.router, prefix="/api/projects/{project_id}/fine-tunes", tags=["training"])
app.include_router(endpoints.router, prefix="/api/projects/{project_id}/endpoints", tags=["endpoints"])
app.include_router(research.router, prefix="/api/projects/{project_id}/research", tags=["research"])
app.include_router(assistant.router, prefix="/api/assistant", tags=["assistant"])

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "version": "0.1.0"}
