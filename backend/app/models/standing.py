from sqlalchemy import BigInteger, Integer, ForeignKey
from sqlalchemy.orm import mapped_column, Mapped, relationship
from app.database import Base
from app.models.base import TimestampMixin


class Standing(Base, TimestampMixin):
    __tablename__ = "standings"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    tournament_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("tournaments.id"), nullable=False
    )
    participant_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("participants.id"), nullable=False
    )
    wins: Mapped[int] = mapped_column(Integer, default=0)
    losses: Mapped[int] = mapped_column(Integer, default=0)
    draws: Mapped[int] = mapped_column(Integer, default=0)
    score_diff: Mapped[int] = mapped_column(Integer, default=0)
    points: Mapped[int] = mapped_column(Integer, default=0)
    rank: Mapped[int] = mapped_column(Integer, default=0)

    tournament: Mapped["Tournament"] = relationship("Tournament", back_populates="standings")
    participant: Mapped["Participant"] = relationship("Participant", back_populates="standing")
