from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.database import engine, Base
import models  # noqa: F401 — registers all ORM models with Base.metadata
from routers import auth, billing


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables (use Alembic migrations in production)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown
    await engine.dispose()


app = FastAPI(
    title="LaunchKit API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(billing.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
