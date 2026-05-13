from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MatchOut(BaseModel):
    id: int
    tournament_id: int
    round: int
    match_number: int
    bracket_type: str
    player1_id: Optional[int]
    player2_id: Optional[int]
    winner_id: Optional[int]
    loser_id: Optional[int]
    score_player1: Optional[int]
    score_player2: Optional[int]
    status: str
    next_match_id: Optional[int]
    loser_next_match_id: Optional[int]
    created_at: datetime

    model_config = {"from_attributes": True}


class ReportMatchRequest(BaseModel):
    score_player1: int
    score_player2: int
