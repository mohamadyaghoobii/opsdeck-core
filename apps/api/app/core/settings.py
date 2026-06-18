from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "OpsDeck API"
    app_env: str = "development"
    app_version: str = "0.2.0"
    api_prefix: str = "/api"
    database_url: str = "sqlite:///./opsdeck.db"
    cors_origins: str = "http://localhost:3000"
    seed_on_startup: bool = True

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def is_sqlite(self) -> bool:
        return self.database_url.startswith("sqlite")


@lru_cache
def get_settings() -> Settings:
    return Settings()
