from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import BigInteger, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin

if TYPE_CHECKING:
    from app.models.tournament import Tournament


class Game(Base, TimestampMixin):
    __tablename__ = "games"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    developer: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    genre: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    tournaments: Mapped[List["Tournament"]] = relationship(
        "Tournament", back_populates="game_ref"
    )
