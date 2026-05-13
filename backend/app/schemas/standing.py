from pydantic import BaseModel


class StandingOut(BaseModel):
    id: int
    tournament_id: int
    participant_id: int
    wins: int
    losses: int
    draws: int
    score_diff: int
    played: int = 0
    score_for: int = 0
    score_against: int = 0
    points: int
    rank: int | None = None
    username: str = ""

    model_config = {"from_attributes": True}
