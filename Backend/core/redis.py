import json
import logging
import redis.asyncio as aioredis
from Backend.config import settings

logger = logging.getLogger(__name__)

_redis_client = None


async def get_redis() -> aioredis.Redis:
    global _redis_client
    if _redis_client is None:
        _redis_client = aioredis.from_url(
            settings.REDIS_URL,
            decode_responses=True
        )
    return _redis_client


async def publish(channel: str, data: dict):
    client = await get_redis()
    await client.publish(channel, json.dumps(data))


async def subscribe_to_channel(channel: str, callback):
    client = await get_redis()
    pubsub = client.pubsub()

    await pubsub.subscribe(channel)

    async for message in pubsub.listen():
        if message["type"] != "message":
            continue

        try:
            payload = json.loads(message["data"])
        except json.JSONDecodeError:
            logger.exception(
                "Failed to decode Redis message on channel '%s'",
                channel
            )
            continue

        await callback(payload)