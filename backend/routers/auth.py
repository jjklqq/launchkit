import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.config import settings
from core.database import get_db
from core.email import send_password_reset_email, send_welcome_email
from core.security import get_current_user, verify_token
from models.user import User
from schemas.auth import ForgotPasswordRequest, RegisterRequest, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a local user record after Supabase signup",
)
async def register(
    _body: RegisterRequest,
    payload: dict = Depends(verify_token),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Call this once after `supabase.auth.signUp()` succeeds on the frontend.
    The JWT is used to extract `supabase_uid` and `email` — no passwords are
    handled or stored by this API. Calling this endpoint a second time is safe
    (idempotent: returns the existing row)."""
    supabase_uid: str = payload["sub"]
    email: str = payload.get("email", "")

    result = await db.execute(
        select(User).where(User.supabase_uid == supabase_uid)
    )
    existing = result.scalar_one_or_none()
    if existing:
        return existing

    user = User(email=email, supabase_uid=supabase_uid)
    db.add(user)
    await db.commit()
    await db.refresh(user)

    # Fire-and-forget — email failure must not break registration
    await send_welcome_email(email)

    return user


@router.post(
    "/me",
    response_model=UserResponse,
    summary="Return the currently authenticated user",
)
async def me(current_user: User = Depends(get_current_user)) -> User:
    """Requires a valid Supabase JWT in the Authorization header."""
    return current_user


@router.post(
    "/forgot-password",
    status_code=status.HTTP_200_OK,
    summary="Send a password-reset email via Resend",
)
async def forgot_password(body: ForgotPasswordRequest) -> dict:
    """Generates a Supabase recovery link via the Admin API and emails it
    through Resend.  Always returns 200 to prevent email-enumeration attacks."""
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(
                f"{settings.SUPABASE_URL}/auth/v1/admin/generate_link",
                headers={
                    "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
                    "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
                },
                json={
                    "type": "recovery",
                    "email": body.email,
                    "options": {
                        "redirectTo": f"{settings.APP_URL}/reset-password",
                    },
                },
            )

        if resp.status_code == 200:
            reset_url: str = resp.json().get("action_link", "")
            if reset_url:
                await send_password_reset_email(body.email, reset_url)

    except Exception:
        # Silently swallow errors — never reveal whether the email exists
        pass

    return {"message": "If that email is registered, a reset link is on its way."}
