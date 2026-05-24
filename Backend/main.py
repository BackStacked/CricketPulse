import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from Backend.config import settings
from Backend.agents.win_probability import load_model
from Backend.database import create_db_tables
from Backend.core.redis import get_redis, subscribe_to_channel
from Backend.core.ws_manager import manager
from Backend.core.event_processor import process_event
from Backend.routes.health import router as health_router
from Backend.routes.match import router as match_router
from Backend.routes.websocket import router as ws_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("[CricketPulse] Starting up...")
    load_model()
    await create_db_tables()
    redis = await get_redis()
    await redis.ping()
    print("[CricketPulse] Redis connected")

    async def on_event(event_dict: dict):
        await process_event(event_dict, manager)

    task = asyncio.create_task(
        subscribe_to_channel(settings.REDIS_CHANNEL, on_event)
    )
    print(f"[CricketPulse] Subscribed to Redis channel: {settings.REDIS_CHANNEL}")
    print("[CricketPulse] Ready — waiting for ball events...")

    yield

    task.cancel()
    print("[CricketPulse] Shutdown complete")


app = FastAPI(
    title="CricketPulse",
    description="Real-time multi-agent IPL AI backend",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(match_router)
app.include_router(ws_router)
