import json
from typing import List, Optional

import redis.asyncio as aioredis
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.participant import Participant
from app.models.tournament import Tournament


async def search_tournaments(
    db: AsyncSession,
    q: Optional[str] = None,
    game: Optional[str] = None,
    format: Optional[str] = None,
    status: Optional[str] = None,
    page: int = 1,
    size: int = 20,
) -> List[Tournament]:
    query = (
        select(Tournament)
        .options(selectinload(Tournament.game_ref))
        .where(Tournament.visibility == "PUBLIC")
    )

    if q:
        query = query.where(
            Tournament.name.ilike(f"%{q}%")
            | Tournament.game.ilike(f"%{q}%")
            | Tournament.format.ilike(f"%{q}%")
        )
    if game:
        query = query.where(Tournament.game.ilike(f"%{game}%"))
    if format:
        query = query.where(Tournament.format == format.upper())
    if status:
        query = query.where(Tournament.status == status.upper())

    query = query.offset((page - 1) * size).limit(size).order_by(Tournament.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


async def get_live_tournaments(
    db: AsyncSession, redis: aioredis.Redis
) -> List[Tournament]:
    cached = await redis.get("live:tournaments")
    if cached:
        ids = json.loads(cached)
        result = await db.execute(
            select(Tournament)
            .options(selectinload(Tournament.game_ref))
            .where(Tournament.id.in_(ids))
        )
        return result.scalars().all()

    result = await db.execute(
        select(Tournament)
        .options(selectinload(Tournament.game_ref))
        .where(Tournament.status == "ONGOING", Tournament.visibility == "PUBLIC")
        .limit(20)
    )
    tournaments = result.scalars().all()

    await redis.setex(
        "live:tournaments", 30, json.dumps([t.id for t in tournaments])
    )
    return tournaments


async def get_trending_tournaments(
    db: AsyncSession, redis: aioredis.Redis
) -> List[Tournament]:
    cached = await redis.get("trending:tournaments")
    if cached:
        ids = json.loads(cached)
        result = await db.execute(
            select(Tournament)
            .options(selectinload(Tournament.game_ref))
            .where(Tournament.id.in_(ids))
        )
        return result.scalars().all()

    # Trending = most participants
    result = await db.execute(
        select(Tournament, func.count(Participant.id).label("participant_count"))
        .options(selectinload(Tournament.game_ref))
        .join(Participant, Tournament.id == Participant.tournament_id, isouter=True)
        .where(Tournament.visibility == "PUBLIC")
        .group_by(Tournament.id)
        .order_by(func.count(Participant.id).desc())
        .limit(10)
    )
    tournaments = [row.Tournament for row in result.all()]
    await redis.setex(
        "trending:tournaments", 300, json.dumps([t.id for t in tournaments])
    )
    return tournaments


async def get_upcoming_tournaments(db: AsyncSession) -> List[Tournament]:
    result = await db.execute(
        select(Tournament)
        .options(selectinload(Tournament.game_ref))
        .where(
            Tournament.status == "REGISTRATION_OPEN",
            Tournament.visibility == "PUBLIC",
        )
        .order_by(Tournament.created_at.desc())
        .limit(20)
    )
    return result.scalars().all()
