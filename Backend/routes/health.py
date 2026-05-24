import logging

from fastapi import APIRouter
from redis.asyncio import RedisError
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from Backend.core.redis import get_redis
from Backend.database import async_session_factory
from Backend.schemas.response import HealthResponse

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health():
    redis_ok = False
    db_ok = False

    try:
        r = await get_redis()
        await r.ping()
        redis_ok = True
    except RedisError as exc:
        logger.warning("Redis health check failed: %s", exc)

    try:
        async with async_session_factory() as session:
            await session.execute(text("SELECT 1"))
        db_ok = True
    except SQLAlchemyError as exc:
        logger.warning("DB health check failed: %s", exc)

    from Backend.agents.win_probability import _model
    model_loaded = _model is not None

    return HealthResponse(
        status="ok" if redis_ok and db_ok else "degraded",
        redis=redis_ok,
        db=db_ok,
        model_loaded=model_loaded,
    )
