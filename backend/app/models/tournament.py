from sqlalchemy import String, Text, BigInteger, Integer, ForeignKey, Index
from sqlalchemy.orm import mapped_column, Mapped, relationship
from typing import Optional, List
from app.database import Base
from app.models.base import TimestampMixin


class Tournament(Base, TimestampMixin):
    __tablename__ = "tournaments"
    __table_args__ = (
        Index("idx_tournament_name", "name"),
        Index("idx_tournament_status", "status"),
        Index("idx_tournament_slug", "slug"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    host_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[Optional[str]] = mapped_column(String(255), unique=True, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="DRAFT")
    # SINGLE_ELIMINATION, DOUBLE_ELIMINATION, ROUND_ROBIN, SWISS
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
