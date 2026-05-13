from typing import TYPE_CHECKING, Optional

from sqlalchemy import BigInteger, Boolean, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin

if TYPE_CHECKING:
    from app.models.player import Player
    from app.models.standing import Standing
    from app.models.tournament import Tournament


class Participant(Base, TimestampMixin):
    __tablename__ = "participants"
    __table_args__ = (
        UniqueConstraint("tournament_id", "user_id", name="uq_participant"),
        UniqueConstraint("tournament_id", "player_id", name="uq_participant_player"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    tournament_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("tournaments.id"), nullable=False
    )
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id"), nullable=False)
    player_id: Mapped[Optional[int]] = mapped_column(
        BigInteger, ForeignKey("players.id"), nullable=True
    )
    seed: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    eliminated: Mapped[bool] = mapped_column(Boolean, default=False)
    placement: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    tournament: Mapped["Tournament"] = relationship("Tournament", back_populates="participants")
    player: Mapped["Player"] = relationship("Player", back_populates="participations")
    standing: Mapped[Optional["Standing"]] = relationship(
        "Standing", back_populates="participant", uselist=False
    )
