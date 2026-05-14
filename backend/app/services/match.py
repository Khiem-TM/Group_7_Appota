from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequest, Forbidden, NotFound
from app.models.match import Match
from app.schemas.match import ReportMatchRequest
from app.services.bracket import propagate_match_result
from app.services.realtime import publish_event
from app.services.standing import update_standing_after_match


async def get_match(db: AsyncSession, match_id: int) -> Match:
    result = await db.execute(select(Match).where(Match.id == match_id))
    m = result.scalar_one_or_none()
    if not m:
        raise NotFound("Match not found")
    return m


async def report_match(
    db: AsyncSession, match_id: int, host_id: int, data: ReportMatchRequest
) -> Match:
    from app.services.tournament import get_tournament

    match = await get_match(db, match_id)
    tournament = await get_tournament(db, match.tournament_id)

    if tournament.host_id != host_id:
        raise Forbidden("Only host can report match scores")
    if tournament.status != "ONGOING":
        raise BadRequest("Tournament is not ongoing")
    if match.status in ("COMPLETED", "VERIFIED"):
        raise BadRequest("Match already completed")
    if match.status == "PENDING":
        raise BadRequest("Match is not ready yet")
    if not match.player1_id or not match.player2_id:
        raise BadRequest("Match does not have two players")

    match.score_player1 = data.score_player1
    match.score_player2 = data.score_player2

    if data.score_player1 > data.score_player2:
        match.winner_id = match.player1_id
        match.loser_id = match.player2_id
    elif data.score_player2 > data.score_player1:
        match.winner_id = match.player2_id
        match.loser_id = match.player1_id
    else:
        raise BadRequest("Draws are not allowed; one player must win")

    match.status = "COMPLETED"
    if data.started_at:
        match.started_at = data.started_at
    from datetime import datetime, timezone
    match.finished_at = data.finished_at or datetime.now(timezone.utc).isoformat()
    await db.commit()

    # Update standings
    await update_standing_after_match(db, match)

    # Propagate bracket advancement
    await propagate_match_result(db, match, tournament)

    # Broadcast realtime event
    from app.core.redis import redis_client

    if redis_client:
        await publish_event(
            redis_client,
            match.tournament_id,
            {
                "type": "MATCH_COMPLETED",
                "match_id": match.id,
                "winner_id": match.winner_id,
                "score": f"{match.score_player1}-{match.score_player2}",
            },
        )

    # Auto-complete tournament if no playable matches remain
    await db.refresh(tournament)
    await _check_tournament_complete(db, tournament, redis_client if redis_client else None)

    return match


async def _check_tournament_complete(db, tournament, redis_client) -> None:
    from sqlalchemy import or_

    result = await db.execute(
        select(Match).where(
            Match.tournament_id == tournament.id,
            Match.status.in_(["READY", "SCHEDULED", "PENDING"]),
            or_(Match.player1_id.isnot(None), Match.player2_id.isnot(None)),
        )
    )
    actionable = result.scalars().all()

    # Double elimination: an unfilled GRAND_FINAL_RESET means WB champion won clean — skip it
    if tournament.format == "DOUBLE_ELIMINATION":
        actionable = [
            m for m in actionable
            if not (
                m.bracket == "GRAND_FINAL_RESET"
                and m.player1_id is None
                and m.player2_id is None
            )
        ]

    if actionable:
        return

    tournament.status = "FINISHED"
    await db.commit()

    if redis_client:
        await publish_event(
            redis_client,
            tournament.id,
            {"type": "TOURNAMENT_FINISHED", "tournament_id": tournament.id},
        )


async def list_tournament_matches(db: AsyncSession, tournament_id: int):
    result = await db.execute(
        select(Match)
        .where(Match.tournament_id == tournament_id)
        .order_by(Match.round, Match.match_number)
    )
    return result.scalars().all()
