from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import BigInteger, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.base import TimestampMixin

if TYPE_CHECKING:
    from app.models.announcement import Announcement
    from app.models.participant import Participant
    from app.models.tournament import Tournament


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    role: Mapped[str] = mapped_column(String(20), nullable=False, default="PLAYER")
    avatar_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    country: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True)

    tournaments_hosted: Mapped[List["Tournament"]] = relationship(
        "Tournament", back_populates="host", foreign_keys="Tournament.host_id"
    )
    participations: Mapped[List["Participant"]] = relationship(
        "Participant", back_populates="user"
    )
    announcements: Mapped[List["Announcement"]] = relationship(
        "Announcement", back_populates="author"
    )
