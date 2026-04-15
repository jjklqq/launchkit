import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class RegisterRequest(BaseModel):
    """Sent to POST /auth/register after the client completes Supabase signup.
    User identity (supabase_uid, email) is read from the JWT, not this body.
    Add extra profile fields here as the app grows (e.g. display_name)."""

    pass


class LoginRequest(BaseModel):
    """Schema for documentation purposes.
    Actual authentication is handled client-side via the Supabase SDK."""

    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: uuid.UUID
    email: str
    supabase_uid: str
    created_at: datetime
    is_active: bool

    model_config = {"from_attributes": True}
