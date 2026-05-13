import math
from itertools import combinations
from typing import List, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequest
from app.models.match import Match
from app.models.participant import Participant
from app.models.tournament import Tournament


async def get_participants(db: AsyncSession, tournament_id: int) -> List[Participant]:
    result = await db.execute(
        select(Participant)
        .where(Participant.tournament_id == tournament_id)
        .order_by(Participant.seed.nullslast(), Participant.id)
    )
    return list(result.scalars().all())


async def generate_bracket(db: AsyncSession, tournament: Tournament) -> List[Match]:
    if tournament.bracket_generated:
        raise BadRequest("Bracket already generated")

    participants = await get_participants(db, tournament.id)
    if len(participants) < 2:
        raise BadRequest("Need at least 2 participants to generate bracket")

    fmt = tournament.format
    if fmt == "SINGLE_ELIMINATION":
        matches = _generate_single_elimination(tournament.id, participants)
    elif fmt == "DOUBLE_ELIMINATION":
        matches = _generate_double_elimination(tournament.id, participants)
    elif fmt == "ROUND_ROBIN":
        matches = _generate_round_robin(tournament.id, participants)
    elif fmt == "SWISS":
        matches = _generate_swiss_round1(tournament.id, participants)
    else:
        raise BadRequest(f"Unknown format: {fmt}")

    for m in matches:
        db.add(m)

    tournament.bracket_generated = True
    await db.commit()

    # Refresh to populate IDs
    for m in matches:
        await db.refresh(m)

    return matches


def _pad_to_power_of_2(participants: List[Participant]) -> List[Optional[Participant]]:
    n = len(participants)
    size = 2 ** math.ceil(math.log2(max(n, 2)))
    padded: List[Optional[Participant]] = list(participants) + [None] * (size - n)
    return padded


def _generate_single_elimination(
    tournament_id: int, participants: List[Participant]
) -> List[Match]:
    padded = _pad_to_power_of_2(participants)
    size = len(padded)
    total_rounds = int(math.log2(size))

    all_matches: List[Match] = []
    round_matches: List[Match] = []

    # Round 1
    for i in range(0, size, 2):
        p1 = padded[i]
        p2 = padded[i + 1]
        m = Match(
            tournament_id=tournament_id,
            round=1,
            match_number=i // 2,
            bracket_type="WINNER",
            player1_id=p1.id if p1 else None,
            player2_id=p2.id if p2 else None,
            status="PENDING",
        )
        # Auto-advance byes
        if p1 and not p2:
            m.winner_id = p1.id
            m.status = "COMPLETED"
        elif p2 and not p1:
            m.winner_id = p2.id
            m.status = "COMPLETED"
        elif p1 and p2:
            m.status = "READY"
        round_matches.append(m)
        all_matches.append(m)

    # Subsequent rounds (placeholder matches)
    prev_round = round_matches
    for r in range(2, total_rounds + 1):
        cur_round = []
        for i in range(0, len(prev_round), 2):
            m = Match(
                tournament_id=tournament_id,
                round=r,
                match_number=i // 2,
                bracket_type="WINNER",
                status="PENDING",
            )
            cur_round.append(m)
            all_matches.append(m)
        prev_round = cur_round

    return all_matches


def _generate_double_elimination(
    tournament_id: int, participants: List[Participant]
) -> List[Match]:
    padded = _pad_to_power_of_2(participants)
    size = len(padded)
    total_rounds = int(math.log2(size))

    all_matches: List[Match] = []

    # Winner bracket round 1
    winner_r1 = []
    for i in range(0, size, 2):
        p1 = padded[i]
        p2 = padded[i + 1]
        m = Match(
            tournament_id=tournament_id,
            round=1,
            match_number=i // 2,
            bracket_type="WINNER",
            player1_id=p1.id if p1 else None,
            player2_id=p2.id if p2 else None,
            status="PENDING",
        )
        if p1 and not p2:
            m.winner_id = p1.id
            m.status = "COMPLETED"
        elif p2 and not p1:
            m.winner_id = p2.id
            m.status = "COMPLETED"
        elif p1 and p2:
            m.status = "READY"
        winner_r1.append(m)
        all_matches.append(m)

    # Winner bracket subsequent rounds
    prev_winner = winner_r1
    for r in range(2, total_rounds + 1):
        cur_round = []
        for i in range(0, len(prev_winner), 2):
            m = Match(
                tournament_id=tournament_id,
                round=r,
                match_number=i // 2,
                bracket_type="WINNER",
                status="PENDING",
            )
            cur_round.append(m)
            all_matches.append(m)
        prev_winner = cur_round

    # Loser bracket rounds
    for r in range(1, total_rounds * 2):
        lr_count = max(1, size // (2 ** (r // 2 + 1)))
        for i in range(lr_count):
            m = Match(
                tournament_id=tournament_id,
                round=r,
                match_number=i,
                bracket_type="LOSER",
                status="PENDING",
            )
            all_matches.append(m)

    # Grand Final
    gf = Match(
        tournament_id=tournament_id,
        round=total_rounds * 2 + 1,
        match_number=0,
        bracket_type="GRAND_FINAL",
        status="PENDING",
    )
    all_matches.append(gf)

    return all_matches


def _generate_round_robin(
    tournament_id: int, participants: List[Participant]
) -> List[Match]:
    pairs = list(combinations(participants, 2))
    matches = []
    for i, (p1, p2) in enumerate(pairs):
        m = Match(
            tournament_id=tournament_id,
            round=1,
            match_number=i,
            bracket_type="ROUND_ROBIN",
            player1_id=p1.id,
            player2_id=p2.id,
            status="READY",
        )
        matches.append(m)
    return matches


def _generate_swiss_round1(
    tournament_id: int, participants: List[Participant]
) -> List[Match]:
    matches = []
    paired: List[Optional[Participant]] = list(participants)
    if len(paired) % 2 == 1:
        paired.append(None)  # bye

    for i in range(0, len(paired), 2):
        p1 = paired[i]
        p2 = paired[i + 1]
        m = Match(
            tournament_id=tournament_id,
            round=1,
            match_number=i // 2,
            bracket_type="SWISS",
            player1_id=p1.id if p1 else None,
            player2_id=p2.id if p2 else None,
            status="PENDING",
        )
        if p1 and not p2:
            m.winner_id = p1.id
            m.status = "COMPLETED"
        elif p1 and p2:
            m.status = "READY"
        matches.append(m)
    return matches


async def generate_swiss_next_round(
    db: AsyncSession, tournament_id: int, round_num: int
) -> List[Match]:
    from app.models.standing import Standing

    # Get standings ordered by points
    result = await db.execute(
        select(Standing, Participant)
        .join(Participant, Standing.participant_id == Participant.id)
        .where(Standing.tournament_id == tournament_id)
                .order_by(
                    Standing.points.desc(),
                    (Standing.score_for - Standing.score_against).desc(),
                )
    )
    rows = result.all()
    participants = [r.Participant for r in rows]

    if len(participants) % 2 == 1:
        participants.append(None)

    matches = []
    used: set = set()
    match_num = 0
    for p in participants:
        if p is None or p.id in used:
            continue
        for p2 in participants:
            if p2 is None or p2.id in used or p2.id == p.id:
                continue
            # Check no repeat matchup
            existing = await db.execute(
                select(Match).where(
                    Match.tournament_id == tournament_id,
                    (
                        (Match.player1_id == p.id) & (Match.player2_id == p2.id)
                        | (Match.player1_id == p2.id) & (Match.player2_id == p.id)
                    ),
                )
            )
            if existing.scalar_one_or_none():
                continue
            m = Match(
                tournament_id=tournament_id,
                round=round_num,
                match_number=match_num,
                bracket_type="SWISS",
                player1_id=p.id,
                player2_id=p2.id,
                status="READY",
            )
            db.add(m)
            matches.append(m)
            used.add(p.id)
            used.add(p2.id)
            match_num += 1
            break

    await db.commit()
    return matches


async def propagate_match_result(
    db: AsyncSession, match: Match, tournament: Tournament
):
    if not match.winner_id or not match.loser_id:
        return

    if tournament.format in ("SINGLE_ELIMINATION", "DOUBLE_ELIMINATION"):
        loser_result = await db.execute(
            select(Participant).where(Participant.id == match.loser_id)
        )
        loser_participant = loser_result.scalar_one_or_none()
        if loser_participant:
            loser_participant.eliminated = True

        # Advance winner to next round match
        next_round = match.round + 1
        # Winners from match_number 0&1 feed into next match_number 0,
        # from 2&3 into 1, etc.
        next_match_number = match.match_number // 2
        next_match_result = await db.execute(
            select(Match).where(
                Match.tournament_id == tournament.id,
                Match.round == next_round,
                Match.match_number == next_match_number,
                Match.bracket == match.bracket,
            )
        )
        next_match = next_match_result.scalar_one_or_none()
        if next_match:
            # Even match_number fills player1 slot, odd fills player2 slot
            if match.match_number % 2 == 0:
                next_match.player1_id = match.winner_id
            else:
                next_match.player2_id = match.winner_id
            # If both slots filled, mark as READY
            if next_match.player1_id and next_match.player2_id:
                next_match.status = "READY"

    await db.commit()
