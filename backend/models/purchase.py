import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from core.database import Base


class Purchase(Base):
    __tablename__ = "purchases"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    stripe_session_id: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
    )
    plan: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    amount: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        comment="Amount in cents",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    def __repr__(self) -> str:
        return f"<Purchase id={self.id} plan={self.plan!r} user_id={self.user_id}>"
