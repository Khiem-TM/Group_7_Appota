from typing import List

import redis.asyncio as aioredis
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.redis import get_redis
from app.database import get_db
from app.models.player import Player
from app.models.user import User
from app.schemas.standing import StandingOut
from app.services import standing as standing_service

router = APIRouter(prefix="/tournaments", tags=["standings"])


@router.get("/{tournament_id}/standings", response_model=List[StandingOut])
async def get_standings(
    tournament_id: int,
    db: AsyncSession = Depends(get_db),
    redis: aioredis.Redis = Depends(get_redis),
):
    rows = await standing_service.get_standings(db, tournament_id)
    result = []
    for standing, participant in rows:
        username = ""
        if participant.player_id:
            player_result = await db.execute(
                select(Player).where(Player.id == participant.player_id)
            )
            player = player_result.scalar_one_or_none()
            username = player.display_name if player else ""
        elif participant.user_id:
            user_result = await db.execute(select(User).where(User.id == participant.user_id))
            user = user_result.scalar_one_or_none()
            username = user.username if user else ""

        result.append(
            StandingOut(
                id=standing.id,
                tournament_id=standing.tournament_id,
                participant_id=standing.participant_id,
                wins=standing.won,
                losses=standing.lost,
                draws=standing.draw,
                score_diff=standing.score_for - standing.score_against,
                played=standing.played,
                score_for=standing.score_for,
                score_against=standing.score_against,
                points=standing.points,
                rank=standing.rank,
                username=username,
            )
        )
    return result
