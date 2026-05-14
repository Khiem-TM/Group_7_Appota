from typing import Optional

from sqlalchemy import BigInteger, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base
from app.models.base import TimestampMixin


class Invitation(Base, TimestampMixin):
    __tablename__ = "invitations"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    tournament_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("tournaments.id"), nullable=False
    )
    invited_by: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("accounts.id"), nullable=False
    )
    invited_user_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("accounts.id"), nullable=False
    )
    player_name: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    participant_id: Mapped[Optional[int]] = mapped_column(
        BigInteger, ForeignKey("participants.id"), nullable=True
    )
