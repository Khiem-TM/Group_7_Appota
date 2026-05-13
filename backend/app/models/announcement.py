from sqlalchemy import BigInteger, String, Text, ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship
from app.database import Base
from app.models.base import TimestampMixin


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
