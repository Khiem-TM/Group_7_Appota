from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin

if TYPE_CHECKING:
    from app.models.tournament import Tournament
    from app.models.user import User


class Announcement(Base, TimestampMixin):
    __tablename__ = "announcements"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    tournament_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("tournaments.id"), nullable=False
    )
    author_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    # GENERAL, MATCH, DELAY, RESULT
    announcement_type: Mapped[str] = mapped_column(String(50), default="GENERAL")

    tournament: Mapped["Tournament"] = relationship("Tournament", back_populates="announcements")
    author: Mapped["User"] = relationship("User", back_populates="announcements")
