from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.config import settings
from core.database import get_db

bearer_scheme = HTTPBearer()


def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    """Decode and verify a Supabase-issued JWT. Returns the raw payload.
    Does not touch the database — safe to use before a user row exists."""
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
        return payload
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


async def get_current_user(
    payload: dict = Depends(verify_token),
    db: AsyncSession = Depends(get_db),
):
    """Resolve a verified JWT payload to a User row.
    Raises 404 if the user hasn't called /auth/register yet."""
    from models.user import User  # local import avoids circular dependency

    supabase_uid: str | None = payload.get("sub")
    if not supabase_uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload: missing sub",
        )

    result = await db.execute(
        select(User).where(User.supabase_uid == supabase_uid)
    )
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found — call POST /auth/register first",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive",
        )
    return user
