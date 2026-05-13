from typing import TYPE_CHECKING, Optional

from sqlalchemy import BigInteger, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin

if TYPE_CHECKING:
    from app.models.participant import Participant
    from app.models.tournament import Tournament


class Match(Base, TimestampMixin):
    __tablename__ = "matches"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    tournament_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("tournaments.id"), nullable=False
    )
    round: Mapped[int] = mapped_column(Integer, nullable=False)
    match_number: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    bracket: Mapped[str] = mapped_column(String(20), nullable=False, default="MAIN")
    player1_id: Mapped[Optional[int]] = mapped_column(
        BigInteger, ForeignKey("participants.id"), nullable=True
    )
    player2_id: Mapped[Optional[int]] = mapped_column(
        BigInteger, ForeignKey("participants.id"), nullable=True
    )
    winner_id: Mapped[Optional[int]] = mapped_column(
        BigInteger, ForeignKey("participants.id"), nullable=True
    )
    loser_id: Mapped[Optional[int]] = mapped_column(
        BigInteger, ForeignKey("participants.id"), nullable=True
    )
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

    @property
    def bracket_type(self) -> str:
        return self.bracket

    @bracket_type.setter
    def bracket_type(self, value: str) -> None:
        self.bracket = value

    @property
    def score_player1(self) -> Optional[int]:
        return self.score1

    @score_player1.setter
    def score_player1(self, value: Optional[int]) -> None:
        self.score1 = value

    @property
    def score_player2(self) -> Optional[int]:
        return self.score2

    @score_player2.setter
    def score_player2(self, value: Optional[int]) -> None:
        self.score2 = value

    @property
    def next_match_id(self) -> None:
        return None

    @property
    def loser_next_match_id(self) -> None:
        return None
