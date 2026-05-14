from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class InviteParticipantRequest(BaseModel):
    player_name: str
    invited_user_id: int


class InvitationOut(BaseModel):
    id: int
    tournament_id: int
    invited_by: int
    invited_user_id: int
    player_name: str
    status: str
    participant_id: Optional[int] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class NotificationOut(BaseModel):
    id: int
    user_id: int
    type: str
    title: str
    body: Optional[str] = None
    related_id: Optional[int] = None
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}
