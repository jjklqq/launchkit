import uuid
from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel


class CheckoutRequest(BaseModel):
    plan: Literal["starter", "pro", "team"]


class CheckoutResponse(BaseModel):
    url: str


class WebhookEvent(BaseModel):
    type: str
    data: dict[str, Any]


class PurchaseResponse(BaseModel):
    id: uuid.UUID
    plan: str
    amount: int
    stripe_session_id: str
    created_at: datetime

    model_config = {"from_attributes": True}
