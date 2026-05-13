from datetime import datetime

from pydantic import BaseModel


class AnnouncementCreate(BaseModel):
    title: str
    content: str
    announcement_type: str = "GENERAL"


class AnnouncementOut(BaseModel):
    id: int
    tournament_id: int
    author_id: int
    title: str
    content: str
    announcement_type: str = "GENERAL"
    is_pinned: bool = False
    created_at: datetime
    author_username: str = ""

    model_config = {"from_attributes": True}
