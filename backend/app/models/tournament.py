from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import BigInteger, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin

if TYPE_CHECKING:
    from app.models.announcement import Announcement
    from app.models.match import Match
    from app.models.participant import Participant
    from app.models.standing import Standing
    from app.models.user import User


class Tournament(Base, TimestampMixin):
    __tablename__ = "tournaments"
    __table_args__ = (
        Index("idx_tournament_name", "name"),
        Index("idx_tournament_status", "status"),
        Index("idx_tournament_slug", "slug"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    host_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[Optional[str]] = mapped_column(String(255), unique=True, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="DRAFT")
    format: Mapped[str] = mapped_column(String(50), nullable=False)
    visibility: Mapped[str] = mapped_column(String(20), nullable=False, default="PUBLIC")
    max_players: Mapped[int] = mapped_column(Integer, nullable=False, default=16)
    game: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    prize_pool: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    rules: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    start_date: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    bracket_generated: Mapped[bool] = mapped_column(default=False)
    
    host: Mapped["User"] = relationship(
        "User", back_populates="tournaments_hosted", foreign_keys=[host_id]
    )
    participants: Mapped[List["Participant"]] = relationship(
        "Participant", back_populates="tournament", cascade="all, delete-orphan"
    )
    matches: Mapped[List["Match"]] = relationship(
        "Match", back_populates="tournament", cascade="all, delete-orphan"
    )
    standings: Mapped[List["Standing"]] = relationship(
        "Standing", back_populates="tournament", cascade="all, delete-orphan"
    )
    announcements: Mapped[List["Announcement"]] = relationship(
        "Announcement", back_populates="tournament", cascade="all, delete-orphan"
    )
