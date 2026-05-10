import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import junction, camera, corridor, weather, alerts, settings as settings_router
from app.services.ws_manager import manager, tick_loop


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(tick_loop())
    yield
    task.cancel()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-Based Junction Traffic Optimization System — REST + WebSocket API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# REST routers
app.include_router(junction.router,          prefix="/api")
app.include_router(camera.router,            prefix="/api")
app.include_router(corridor.router,          prefix="/api")
app.include_router(weather.router,           prefix="/api")
app.include_router(alerts.router,            prefix="/api")
app.include_router(settings_router.router,   prefix="/api")


# WebSocket — live tick stream
@app.websocket("/ws/live")
async def websocket_live(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # keep connection alive; actual data is pushed by tick_loop
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "ws": "wss://ai-junc-backend.onrender.com/ws/live",
    }