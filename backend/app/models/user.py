from sqlalchemy import String, Text, BigInteger
from sqlalchemy.orm import mapped_column, Mapped, relationship
from typing import Optional, List
from app.database import Base
from app.models.base import TimestampMixin


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
