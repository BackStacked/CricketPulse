from fastapi import APIRouter
from Backend.core.redis import get_redis
from Backend.database import async_session_factory
from Backend.schemas.response import HealthResponse
from sqlalchemy import text

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health():
    redis_ok = False
    db_ok = False

    try:
        r = await get_redis()
        await r.ping()
        redis_ok = True
    except Exception:
        pass

    try:
        async with async_session_factory() as session:
            await session.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        pass

    from Backend.agents.win_probability import _model
    model_loaded = _model is not None

    return HealthResponse(
        status="ok" if redis_ok and db_ok else "degraded",
        redis=redis_ok,
        db=db_ok,
        model_loaded=model_loaded,
    )
