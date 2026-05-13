from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import BigInteger, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin

if TYPE_CHECKING:
    from app.models.participant import Participant


class Player(Base, TimestampMixin):
    """Player profile - can be created per tournament (not tied to login account)"""
    __tablename__ = "players"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    display_name: Mapped[str] = mapped_column(String(255), nullable=False)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_by: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)

    participations: Mapped[List["Participant"]] = relationship(
        "Participant", back_populates="player"
    )
