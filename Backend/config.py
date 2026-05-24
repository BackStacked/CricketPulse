from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    GROQ_API_KEY: str
    REDIS_URL: str = "redis://localhost:6379"
    DATABASE_URL: str
    REDIS_CHANNEL: str = "match:events"

    model_config = {"env_file": ".env"}


settings = Settings()
