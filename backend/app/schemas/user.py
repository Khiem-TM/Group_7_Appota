from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserOut(BaseModel):
    id: int
    email: EmailStr
    username: str
    role: str
    avatar_url: Optional[str]
    bio: Optional[str]
    country: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class UserProfileOut(UserOut):
    total_tournaments_joined: int = 0
    total_wins: int = 0


class UpdateProfileRequest(BaseModel):
    username: Optional[str] = None
    bio: Optional[str] = None
    country: Optional[str] = None
    avatar_url: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
