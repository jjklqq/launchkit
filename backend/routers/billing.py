import stripe
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.config import settings
from core.database import get_db
from core.security import get_current_user
from models.purchase import Purchase
from models.user import User
from schemas.billing import CheckoutRequest, CheckoutResponse, PurchaseResponse

router = APIRouter(prefix="/billing", tags=["billing"])

PLANS: dict[str, dict] = {
    "starter": {"amount": 5900, "name": "Starter"},
    "pro":     {"amount": 9900, "name": "Pro"},
    "team":    {"amount": 14900, "name": "Team"},
}


@router.post("/checkout", response_model=CheckoutResponse)
async def create_checkout(
    body: CheckoutRequest,
    current_user: User = Depends(get_current_user),
):
    plan = PLANS[body.plan]
    stripe.api_key = settings.STRIPE_SECRET_KEY

    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        mode="payment",
        line_items=[
            {
                "price_data": {
                    "currency": "usd",
                    "unit_amount": plan["amount"],
                    "product_data": {"name": f"LaunchKit {plan['name']}"},
                },
                "quantity": 1,
            }
        ],
        metadata={"user_id": str(current_user.id), "plan": body.plan},
        customer_email=current_user.email,
        success_url=f"{settings.APP_URL}/billing/success",
        cancel_url=f"{settings.APP_URL}/billing/cancel",
    )
    return CheckoutResponse(url=session.url)


@router.post("/webhook", status_code=status.HTTP_200_OK)
async def stripe_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid Stripe signature")
    except Exception:
        raise HTTPException(status_code=400, detail="Malformed webhook payload")

    if event["type"] == "checkout.session.completed":
        session_obj = event["data"]["object"]
        metadata = session_obj.get("metadata") or {}
        user_id = metadata.get("user_id")
        plan = metadata.get("plan")
        amount = session_obj.get("amount_total", 0)
        session_id = session_obj["id"]

        if user_id and plan:
            # Idempotency: skip if already recorded
            existing = await db.execute(
                select(Purchase).where(Purchase.stripe_session_id == session_id)
            )
            if existing.scalar_one_or_none() is None:
                purchase = Purchase(
                    user_id=user_id,
                    stripe_session_id=session_id,
                    plan=plan,
                    amount=amount,
                )
                db.add(purchase)
                await db.commit()

    return {"received": True}


@router.get("/purchases", response_model=list[PurchaseResponse])
async def get_purchases(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Purchase)
        .where(Purchase.user_id == current_user.id)
        .order_by(Purchase.created_at.desc())
    )
    return result.scalars().all()
