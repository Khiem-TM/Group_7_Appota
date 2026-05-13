import re
import uuid
from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.exceptions import BadRequest, Conflict, Forbidden, NotFound
from app.models.participant import Participant
from app.models.standing import Standing
from app.models.tournament import Tournament
from app.models.user import User
from app.schemas.tournament import TournamentCreate, TournamentUpdate

VALID_STATUSES = ["DRAFT", "REGISTRATION_OPEN", "SEEDING", "ONGOING", "FINISHED", "ARCHIVED"]
VALID_FORMATS = ["SINGLE_ELIMINATION", "DOUBLE_ELIMINATION", "ROUND_ROBIN", "SWISS"]


def slugify(name: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9\s-]", "", name.lower())
    slug = re.sub(r"\s+", "-", slug.strip())
    return f"{slug}-{uuid.uuid4().hex[:6]}"


async def create_tournament(db: AsyncSession, host: User, data: TournamentCreate) -> Tournament:
    if data.format.upper() not in VALID_FORMATS:
        raise BadRequest(f"Format must be one of {VALID_FORMATS}")

    tournament = Tournament(
        host_id=host.id,
        name=data.name,
        slug=slugify(data.name),
        description=data.description,
        format=data.format.upper(),
        visibility=data.visibility.upper(),
        max_players=data.max_players,
        game=data.game,
        prize_pool=data.prize_pool,
        rules=data.rules,
        start_date=data.start_date,
        status="DRAFT",
    )
    db.add(tournament)
    await db.commit()
    await db.refresh(tournament)
    return tournament


async def get_tournament(db: AsyncSession, tournament_id: int) -> Tournament:
    result = await db.execute(
        select(Tournament)
        .options(selectinload(Tournament.host))
        .where(Tournament.id == tournament_id)
    )
    t = result.scalar_one_or_none()
    if not t:
        raise NotFound("Tournament not found")
    return t


async def list_tournaments(
    db: AsyncSession,
    page: int = 1,
    size: int = 20,
    status: Optional[str] = None,
    visibility: str = "PUBLIC",
):
    query = select(Tournament).where(Tournament.visibility == visibility)
    if status:
        query = query.where(Tournament.status == status.upper())
    query = query.offset((page - 1) * size).limit(size).order_by(Tournament.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()


async def update_tournament(
    db: AsyncSession, tournament_id: int, host_id: int, data: TournamentUpdate
) -> Tournament:
    t = await get_tournament(db, tournament_id)
    if t.host_id != host_id:
        raise Forbidden("Only host can edit tournament")
    if t.status not in ("DRAFT", "REGISTRATION_OPEN"):
        raise BadRequest("Can only edit tournament in DRAFT or REGISTRATION_OPEN state")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(t, field, value)

    await db.commit()
    await db.refresh(t)
    return t


async def delete_tournament(db: AsyncSession, tournament_id: int, host_id: int):
    t = await get_tournament(db, tournament_id)
    if t.host_id != host_id:
        raise Forbidden("Only host can delete tournament")
    if t.status not in ("DRAFT",):
        raise BadRequest("Can only delete DRAFT tournaments")
    await db.delete(t)
    await db.commit()


async def update_status(
    db: AsyncSession, tournament_id: int, host_id: int, new_status: str
) -> Tournament:
    t = await get_tournament(db, tournament_id)
    if t.host_id != host_id:
        raise Forbidden("Only host can change tournament status")

    transitions = {
        "DRAFT": ["REGISTRATION_OPEN"],
        "REGISTRATION_OPEN": ["SEEDING", "DRAFT"],
        "SEEDING": ["ONGOING"],
        "ONGOING": ["FINISHED"],
        "FINISHED": ["ARCHIVED"],
    }

    allowed = transitions.get(t.status, [])
    if new_status not in allowed:
        raise BadRequest(
            f"Cannot transition from {t.status} to {new_status}. Allowed: {allowed}"
        )

    t.status = new_status
    await db.commit()
    await db.refresh(t)
    return t


async def join_tournament(db: AsyncSession, tournament_id: int, user: User) -> Participant:
    """User joins tournament - creates a Player profile and adds as Participant"""
    from app.models.player import Player
    
    t = await get_tournament(db, tournament_id)
    if t.status != "REGISTRATION_OPEN":
        raise BadRequest("Tournament is not open for registration")

    # Create or get player profile for this user
    player = Player(
        display_name=user.username,
        avatar_url=user.avatar_url,
        created_by=user.id,
    )
    db.add(player)
    await db.flush()  # get player.id

    # Check if already joined
    existing = await db.execute(
        select(Participant).where(
            Participant.tournament_id == tournament_id,
            Participant.player_id == player.id,
        )
    )
    if existing.scalar_one_or_none():
        raise Conflict("Already joined this tournament")

    count_result = await db.execute(
        select(func.count()).select_from(Participant).where(
            Participant.tournament_id == tournament_id
        )
    )
    count = count_result.scalar()
    if count >= t.max_players:
        raise BadRequest("Tournament is full")

    participant = Participant(tournament_id=tournament_id, player_id=player.id)
    db.add(participant)
    await db.flush()  # get participant.id

    standing = Standing(
        tournament_id=tournament_id,
        participant_id=participant.id,
    )
    db.add(standing)

    await db.commit()
    await db.refresh(participant)
    return participant


async def leave_tournament(db: AsyncSession, tournament_id: int, user_id: int):
    """User leaves tournament - remove their participant record by finding player created by user"""
    from app.models.player import Player
    
    t = await get_tournament(db, tournament_id)
    if t.status != "REGISTRATION_OPEN":
        raise BadRequest("Can only leave during registration")

    # Find player created by this user
    player_result = await db.execute(
        select(Player).where(Player.created_by == user_id)
    )
    player = player_result.scalars().first()
    if not player:
        raise NotFound("No player profile found for this user")

    result = await db.execute(
        select(Participant).where(
            Participant.tournament_id == tournament_id,
            Participant.player_id == player.id,
        )
    )
    p = result.scalar_one_or_none()
    if not p:
        raise NotFound("Not a participant in this tournament")

    await db.delete(p)
    await db.commit()


async def get_participant_count(db: AsyncSession, tournament_id: int) -> int:
    result = await db.execute(
        select(func.count()).select_from(Participant).where(
            Participant.tournament_id == tournament_id
        )
    )
    return result.scalar() or 0


async def add_participant(
    db: AsyncSession, tournament_id: int, host_id: int, player_name: str
) -> Participant:
    """Host adds a participant (player) to tournament"""
    from app.models.player import Player
    
    t = await get_tournament(db, tournament_id)
    if t.host_id != host_id:
        raise Forbidden("Only host can add participants")
    
    if t.status not in ("DRAFT", "REGISTRATION_OPEN", "SEEDING"):
        raise BadRequest("Cannot add participants in current tournament state")

    # Create player profile
    player = Player(display_name=player_name, created_by=host_id)
    db.add(player)
    await db.flush()  # get player.id

    # Check tournament is not full
    count_result = await db.execute(
        select(func.count()).select_from(Participant).where(
            Participant.tournament_id == tournament_id
        )
    )
    count = count_result.scalar()
    if count >= t.max_players:
        raise BadRequest("Tournament is full")

    # Create participant
    participant = Participant(tournament_id=tournament_id, player_id=player.id)
    db.add(participant)
    await db.flush()

    # Create standing
    standing = Standing(
        tournament_id=tournament_id,
        participant_id=participant.id,
    )
    db.add(standing)

    await db.commit()
    await db.refresh(participant)
    return participant
