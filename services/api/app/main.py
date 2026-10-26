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
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_private_network_access_headers(request: Request, call_next):
    if request.method == "OPTIONS" and request.headers.get("access-control-request-private-network"):
        response = JSONResponse(status_code=200, content={})
        response.headers["Access-Control-Allow-Private-Network"] = "true"
        response.headers["Access-Control-Allow-Origin"] = request.headers.get("origin", "*")
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, HEAD"
        response.headers["Access-Control-Allow-Headers"] = "*"
        return response
    response = await call_next(request)
    response.headers["Access-Control-Allow-Private-Network"] = "true"
    return response

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

# Mount and serve built frontend static files if present
import os
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

possible_dist_paths = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "apps", "web", "dist")),
    os.path.abspath(os.path.join(os.getcwd(), "apps", "web", "dist")),
]

dist_path = None
for p in possible_dist_paths:
    if os.path.isdir(p) and os.path.exists(os.path.join(p, "index.html")):
        dist_path = p
        break

if dist_path:
    logger.info(f"Serving built web frontend from: {dist_path}")
    assets_dir = os.path.join(dist_path, "assets")

    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
        app.mount("/vayyuedge/assets", StaticFiles(directory=assets_dir), name="vayyuedge_assets")

    @app.get("/")
    @app.get("/index.html")
    async def serve_index():
        return FileResponse(os.path.join(dist_path, "index.html"))

    @app.get("/vayyuedge")
    @app.get("/vayyuedge/")
    @app.get("/vayyuedge/index.html")
    async def serve_vayyuedge_index():
        return FileResponse(os.path.join(dist_path, "index.html"))

    # Catch-all static mounting
    app.mount("/vayyuedge", StaticFiles(directory=dist_path, html=True), name="vayyuedge_static")
    app.mount("/", StaticFiles(directory=dist_path, html=True), name="static")


