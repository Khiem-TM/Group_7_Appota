from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserOut(BaseModel):
    id: int
    email: EmailStr
    username: str
    role: str
    avatar_url: Optional[str]
    cover_url: Optional[str] = None
    full_name: Optional[str] = None
    bio: Optional[str] = None
    country: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class UserProfileOut(UserOut):
    total_tournaments_joined: int = 0
    total_wins: int = 0
    total_matches_played: int = 0
    total_tournaments_hosted: int = 0
    total_hosted_participants: int = 0
    first_place_finishes: int = 0
    top_three_finishes: int = 0
    games_played: list[dict] = Field(default_factory=list)
    hosted_tournaments: list[dict] = Field(default_factory=list)
    participated_tournaments: list[dict] = Field(default_factory=list)
    achievements: list[dict] = Field(default_factory=list)


class UpdateProfileRequest(BaseModel):
    username: Optional[str] = None
    full_name: Optional[str] = None
    bio: Optional[str] = None
    country: Optional[str] = None
    avatar_url: Optional[str] = None
    cover_url: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class PlayerCreateRequest(BaseModel):
    display_name: str
    avatar_url: Optional[str] = None


class PlayerOut(BaseModel):
    id: int
    display_name: str
    avatar_url: Optional[str]
    created_by: Optional[int]
    created_at: datetime

    model_config = {"from_attributes": True}


class UserSearchOut(BaseModel):
    id: int
    username: str
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None

    model_config = {"from_attributes": True}
