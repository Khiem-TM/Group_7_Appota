from sqlalchemy import BigInteger, Integer, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import mapped_column, Mapped, relationship
from typing import Optional
from app.database import Base
from app.models.base import TimestampMixin


class Participant(Base, TimestampMixin):
    __tablename__ = "participants"
    __table_args__ = (
        UniqueConstraint("tournament_id", "user_id", name="uq_participant"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    tournament_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("tournaments.id"), nullable=False
    )
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id"), nullable=False)
    seed: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    eliminated: Mapped[bool] = mapped_column(Boolean, default=False)
    placement: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    tournament: Mapped["Tournament"] = relationship("Tournament", back_populates="participants")
    user: Mapped["User"] = relationship("User", back_populates="participations")
    standing: Mapped[Optional["Standing"]] = relationship(
        "Standing", back_populates="participant", uselist=False
    )
