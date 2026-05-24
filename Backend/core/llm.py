import logging

import groq

from Backend.config import settings

logger = logging.getLogger(__name__)

_client = groq.AsyncGroq(api_key=settings.GROQ_API_KEY)


async def call_llm(system: str, prompt: str, max_tokens: int = 150) -> str:
    try:
        response = await _client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": prompt},
            ],
            max_tokens=max_tokens,
        )
        return response.choices[0].message.content.strip()
    except Exception as exc:
        logger.warning("Groq call failed (%s: %s) — using fallback", type(exc).__name__, exc)
        return "Great delivery!"
