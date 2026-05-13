from typing import TYPE_CHECKING, Optional

from sqlalchemy import BigInteger, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin

if TYPE_CHECKING:
    from app.models.participant import Participant
    from app.models.tournament import Tournament


class Match(Base, TimestampMixin):
    __tablename__ = "matches"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    tournament_id: Mapped[int] = mapped_column(BigInteger, nullable=False)
    round: Mapped[int] = mapped_column(Integer, nullable=False)
    match_number: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    bracket: Mapped[str] = mapped_column(String(20), nullable=False, default="MAIN")
    player1_id: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    player2_id: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    winner_id: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    loser_id: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    score1: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    score2: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False, default="SCHEDULED")
    scheduled_at: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    finished_at: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    tournament: Mapped["Tournament"] = relationship("Tournament", back_populates="matches")
    player1: Mapped[Optional["Participant"]] = relationship(
        "Participant", foreign_keys=[player1_id]
    )
    player2: Mapped[Optional["Participant"]] = relationship(
        "Participant", foreign_keys=[player2_id]
    )
    winner: Mapped[Optional["Participant"]] = relationship(
        "Participant", foreign_keys=[winner_id]
    )
    loser: Mapped[Optional["Participant"]] = relationship(
        "Participant", foreign_keys=[loser_id]
    )
