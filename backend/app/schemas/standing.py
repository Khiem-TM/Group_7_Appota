from pydantic import BaseModel


class StandingOut(BaseModel):
    id: int
    tournament_id: int
    participant_id: int
    wins: int
    losses: int
    draws: int
    score_diff: int
    points: int
    rank: int
    username: str = ""

    model_config = {"from_attributes": True}
