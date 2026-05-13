from typing import List, Optional

import redis.asyncio as aioredis
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.redis import get_redis
from app.database import get_db
from app.schemas.tournament import TournamentOut
from app.services import explore as explore_service
from app.services import tournament as tournament_service

router = APIRouter(prefix="/explore", tags=["explore"])


def _tournament_out(t, count: int) -> TournamentOut:
    return TournamentOut(
        **{k: v for k, v in t.__dict__.items() if not k.startswith("_")},
        participant_count=count,
    )


@router.get("/trending", response_model=List[TournamentOut])
async def trending(
    db: AsyncSession = Depends(get_db),
    redis: aioredis.Redis = Depends(get_redis),
):
    tournaments = await explore_service.get_trending_tournaments(db, redis)
    results = []
    for t in tournaments:
        count = await tournament_service.get_participant_count(db, t.id)
        results.append(_tournament_out(t, count))
    return results


@router.get("/live", response_model=List[TournamentOut])
async def live(
    db: AsyncSession = Depends(get_db),
    redis: aioredis.Redis = Depends(get_redis),
):
    tournaments = await explore_service.get_live_tournaments(db, redis)
    results = []
    for t in tournaments:
        count = await tournament_service.get_participant_count(db, t.id)
        results.append(_tournament_out(t, count))
    return results


@router.get("/upcoming", response_model=List[TournamentOut])
async def upcoming(db: AsyncSession = Depends(get_db)):
    tournaments = await explore_service.get_upcoming_tournaments(db)
    results = []
    for t in tournaments:
        count = await tournament_service.get_participant_count(db, t.id)
        results.append(_tournament_out(t, count))
    return results


# Second router for search
router2 = APIRouter(prefix="/search", tags=["search"])


@router2.get("/tournaments", response_model=List[TournamentOut])
async def search(
    q: Optional[str] = None,
    game: Optional[str] = None,
    format: Optional[str] = None,
    status: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db),
):
    tournaments = await explore_service.search_tournaments(db, q, game, format, status, page, size)
    results = []
    for t in tournaments:
        count = await tournament_service.get_participant_count(db, t.id)
        results.append(_tournament_out(t, count))
    return results
