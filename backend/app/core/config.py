"""
Application configuration loaded from environment variables.

Pydantic Settings reads from .env automatically so we never
hardcode secrets — they stay in the environment.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # SQLite connection string — defaults to local file for development.
    # Override DATABASE_URL in production (e.g. a persistent disk path on Render).
    database_url: str = "sqlite:///./app.db"

    # Comma-separated list of allowed CORS origins.
    # In development this is http://localhost:3000.
    # In production this is set to the Vercel frontend URL.
    cors_origins: str = "http://localhost:3000"

    # Optional: LLM key is not required for P0 — seeded intelligence is used.
    llm_api_key: str = ""

    @property
    def cors_origins_list(self) -> list[str]:
        """Split the comma-separated CORS string into a Python list."""
        return [origin.strip() for origin in self.cors_origins.split(",")]


# Single shared settings instance — import this everywhere.
settings = Settings()
