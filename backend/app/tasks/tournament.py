from app.celery_app import celery_app


@celery_app.task(name="tasks.auto_start_tournament")
def auto_start_tournament(tournament_id: int):
    """Auto-start tournament when start_date is reached."""
    import asyncio

    from app.database import AsyncSessionLocal
    from app.services import tournament as ts

    async def _run():
        async with AsyncSessionLocal() as db:
            try:
                t = await ts.get_tournament(db, tournament_id)
                if t.status == "SEEDING":
                    await ts.update_status(db, tournament_id, t.host_id, "ONGOING")
            except Exception:
                pass

    asyncio.run(_run())


@celery_app.task(name="tasks.rebuild_standings_cache")
def rebuild_standings_cache(tournament_id: int):
    """Rebuild Redis standings cache for a tournament."""
    import asyncio

    from app.core.redis import init_redis, redis_client
    from app.database import AsyncSessionLocal
    from app.services.standing import cache_standings, get_standings

    async def _run():
        await init_redis()
        async with AsyncSessionLocal() as db:
            rows = await get_standings(db, tournament_id)
            data = [
                {
                    "participant_id": s.participant_id,
                    "rank": s.rank,
                    "points": s.points,
                }
                for s, _ in rows
            ]
            await cache_standings(redis_client, tournament_id, data)

    asyncio.run(_run())
