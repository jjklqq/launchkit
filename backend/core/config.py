from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="../.env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # App
    APP_ENV: str = "development"
    SECRET_KEY: str = "change-me"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/launchkit"

    # CORS — space-separated origins in .env, e.g. "http://localhost:3000 https://yourdomain.com"
    CORS_ORIGINS_STR: str = "http://localhost:3000"

    @property
    def CORS_ORIGINS(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS_STR.split()]

    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_JWT_SECRET: str = ""

    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""

    # App URL (used for Stripe redirect URLs)
    APP_URL: str = "http://localhost:3000"

    # Resend
    RESEND_API_KEY: str = ""
    RESEND_FROM_EMAIL: str = "noreply@example.com"


settings = Settings()
