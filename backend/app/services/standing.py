import json

import redis.asyncio as aioredis
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.match import Match
from app.models.participant import Participant
from app.models.standing import Standing


async def get_standings(db: AsyncSession, tournament_id: int):
    result = await db.execute(
        select(Standing, Participant)
        .join(Participant, Standing.participant_id == Participant.id)
        .where(Standing.tournament_id == tournament_id)
        .order_by(Standing.rank, Standing.points.desc(), Standing.score_diff.desc())
    )
    return result.all()


async def update_standing_after_match(db: AsyncSession, match: Match):
    if not match.winner_id or not match.loser_id:
        return

    score_diff = abs((match.score_player1 or 0) - (match.score_player2 or 0))

    winner_standing_result = await db.execute(
        select(Standing).where(Standing.participant_id == match.winner_id)
    )
    ws = winner_standing_result.scalar_one_or_none()
    if ws:
        ws.wins += 1
        ws.points += 3
        ws.score_diff += score_diff

    loser_standing_result = await db.execute(
        select(Standing).where(Standing.participant_id == match.loser_id)
    )
    ls = loser_standing_result.scalar_one_or_none()
    if ls:
        ls.losses += 1
        ls.score_diff -= score_diff

    await db.commit()
    await recalculate_ranks(db, match.tournament_id)


async def recalculate_ranks(db: AsyncSession, tournament_id: int):
    result = await db.execute(
        select(Standing)
        .where(Standing.tournament_id == tournament_id)
        .order_by(
            Standing.points.desc(),
            Standing.score_diff.desc(),
            Standing.wins.desc(),
        )
    )
    standings = result.scalars().all()
    for i, s in enumerate(standings, 1):
        s.rank = i
    await db.commit()


async def cache_standings(redis: aioredis.Redis, tournament_id: int, standings_data: list):
    key = f"standing:tournament:{tournament_id}"
    await redis.setex(key, 60, json.dumps(standings_data))


async def get_cached_standings(redis: aioredis.Redis, tournament_id: int):
    key = f"standing:tournament:{tournament_id}"
    data = await redis.get(key)
    return json.loads(data) if data else None
