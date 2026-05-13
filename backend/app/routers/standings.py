from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import redis.asyncio as aioredis
from app.database import get_db
from app.core.redis import get_redis
from app.schemas.standing import StandingOut
from app.services import standing as standing_service
from app.models.user import User

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
        user_result = await db.execute(select(User).where(User.id == participant.user_id))
        user = user_result.scalar_one_or_none()
        result.append(
            StandingOut(
                **{k: v for k, v in standing.__dict__.items() if not k.startswith("_")},
                username=user.username if user else "",
            )
        )
    return result
