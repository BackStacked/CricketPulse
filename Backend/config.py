from pydantic import model_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    GROQ_API_KEY: str
    REDIS_URL: str = "redis://localhost:6379"
    DATABASE_URL: str
    REDIS_CHANNEL: str = "match:events"
    # Comma-separated allowed origins, e.g. "https://app.example.com,https://www.example.com"
    # Defaults to ["*"] (open) for local development. Restrict in production.
    ALLOWED_ORIGINS: list[str] = ["*"]

    @model_validator(mode="after")
    def validate_groq_key(self) -> "Settings":
        if not self.GROQ_API_KEY.strip():
            raise ValueError(
                "GROQ_API_KEY is empty — LLM agents (commentary + alerts) will not function"
            )
        return self

    model_config = {"env_file": ".env"}


settings = Settings()
