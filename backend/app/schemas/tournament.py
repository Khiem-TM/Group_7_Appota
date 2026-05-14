from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class TournamentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    # SINGLE_ELIMINATION, DOUBLE_ELIMINATION, ROUND_ROBIN, SWISS
    format: str
    visibility: str = "PUBLIC"
    max_players: int = 16
    game: Optional[str] = None
    game_id: Optional[int] = None
    prize_pool: Optional[str] = None
    rules: Optional[str] = None
    start_date: Optional[str] = None


class TournamentUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    visibility: Optional[str] = None
    max_players: Optional[int] = None
    game: Optional[str] = None
    prize_pool: Optional[str] = None
    rules: Optional[str] = None
    start_date: Optional[str] = None


class TournamentOut(BaseModel):
    id: int
    host_id: int
    name: str
    slug: Optional[str]
    description: Optional[str]
    status: str
    format: str
    visibility: str
    max_players: int
    game: Optional[str]
    game_id: Optional[int] = None
    game_thumbnail_url: Optional[str] = None
    prize_pool: Optional[str]
    start_date: Optional[str]
    bracket_generated: bool
    created_at: datetime
    participant_count: int = 0

    model_config = {"from_attributes": True}


class TournamentJoinByPlayer(BaseModel):
    player_id: int


class TournamentAddUserParticipant(BaseModel):
    user_id: int


class ParticipantOut(BaseModel):
    id: int
    tournament_id: int
    user_id: Optional[int] = None
    player_id: Optional[int] = None
    seed: Optional[int] = None
    eliminated: bool = False
    placement: Optional[int] = None
    created_at: datetime

    model_config = {"from_attributes": True}
