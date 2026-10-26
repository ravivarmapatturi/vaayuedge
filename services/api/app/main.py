import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.router import api_router
from app.core.config import settings

# Configure logging
logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("vayyuedge")

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting VayyuEdge API service...")
    logger.info(f"Processing Mode: {settings.PROCESSING_MODE}")
    logger.info(f"ASR Adapter: {settings.ASR_ADAPTER}")
    logger.info(f"Translation Adapter: {settings.TRANSLATION_ADAPTER}")
    logger.info(f"TTS Adapter: {settings.TTS_ADAPTER}")
    yield
    logger.info("Shutting down VayyuEdge API service.")

app = FastAPI(
    title="VayyuEdge API",
    description="Offline-first, lightweight English to Telugu speech intelligence backend.",
    version="0.2.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global error handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception during {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred while processing your request."}
    )

# Include API routes
app.include_router(api_router)

# Optionally mount built frontend static files if present
import os
from fastapi.staticfiles import StaticFiles

possible_dist_paths = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "apps", "web", "dist")),
    os.path.abspath(os.path.join(os.getcwd(), "apps", "web", "dist")),
]
for dist_path in possible_dist_paths:
    if os.path.isdir(dist_path) and os.path.exists(os.path.join(dist_path, "index.html")):
        logger.info(f"Mounting built web frontend from: {dist_path}")
        app.mount("/", StaticFiles(directory=dist_path, html=True), name="static")
        break

