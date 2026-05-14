from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequest, Conflict, NotFound
from app.core.security import hash_password, verify_password
from app.models.match import Match
from app.models.participant import Participant
from app.models.player import Player
from app.models.standing import Standing
from app.models.tournament import Tournament
from app.models.user import User
from app.schemas.user import (
    ChangePasswordRequest,
    PlayerCreateRequest,
    UpdateProfileRequest,
)


async def search_users_by_username(db: AsyncSession, q: str, limit: int = 10) -> list[User]:
    if not q.strip():
        return []
    result = await db.execute(
        select(User)
        .where(User.username.ilike(f"%{q.strip()}%"), User.is_active == True)
        .order_by(User.username)
        .limit(limit)
    )
    return result.scalars().all()


async def get_user_by_id(db: AsyncSession, user_id: int) -> User:
    result = await db.execute(select(User).where(User.id == user_id, User.is_active))
    user = result.scalar_one_or_none()
    if not user:
        raise NotFound("User not found")
    return user


async def update_profile(db: AsyncSession, user: User, data: UpdateProfileRequest) -> User:
    if data.username and data.username != user.username:
        existing = await db.execute(select(User).where(User.username == data.username))
        if existing.scalar_one_or_none():
            raise Conflict("Username already taken")
        user.username = data.username

    if data.full_name is not None:
        user.full_name = data.full_name
    if data.avatar_url is not None:
        user.avatar_url = data.avatar_url
    if data.cover_url is not None:
        user.cover_url = data.cover_url

    await db.commit()
    await db.refresh(user)
    return user


async def change_password(db: AsyncSession, user: User, data: ChangePasswordRequest):
    if not verify_password(data.current_password, user.password_hash):
        raise BadRequest("Current password is incorrect")
    user.password_hash = hash_password(data.new_password)
    await db.commit()


async def get_user_stats(db: AsyncSession, user_id: int) -> dict:
    participant_filter = (Participant.user_id == user_id) | (Player.created_by == user_id)

    participant_rows = await db.execute(
        select(Participant, Player, Standing)
        .join(Player, Participant.player_id == Player.id, isouter=True)
        .join(Standing, Standing.participant_id == Participant.id, isouter=True)
        .where(participant_filter)
    )
    rows = participant_rows.all()
    participant_ids = [row.Participant.id for row in rows]
    tournament_ids = sorted({row.Participant.tournament_id for row in rows})

    total_matches_played = 0
    if participant_ids:
        matches_played = await db.execute(
            select(func.count())
            .select_from(Match)
            .where(
                (Match.player1_id.in_(participant_ids) | Match.player2_id.in_(participant_ids)),
                Match.status.in_(("COMPLETED", "VERIFIED")),
            )
        )
        total_matches_played = matches_played.scalar() or 0

    total_wins = sum((row.Standing.won if row.Standing else 0) for row in rows)
    first_place = sum(1 for row in rows if row.Standing and row.Standing.rank == 1)
    top_three = sum(
        1 for row in rows if row.Standing and row.Standing.rank is not None and row.Standing.rank <= 3
    )

    participated_tournaments = []
    games: dict[str, dict] = {}
    if tournament_ids:
        tournament_result = await db.execute(
            select(Tournament).where(Tournament.id.in_(tournament_ids)).order_by(Tournament.created_at.desc())
        )
        for tournament in tournament_result.scalars().all():
            participated_tournaments.append(
                {
                    "id": tournament.id,
                    "name": tournament.name,
                    "game": tournament.game,
                    "format": tournament.format,
                    "status": tournament.status,
                    "start_date": tournament.start_date,
                }
            )
            game_name = tournament.game or "Unknown"
            games.setdefault(game_name, {"game": game_name, "tournaments": 0})
            games[game_name]["tournaments"] += 1

    hosted_result = await db.execute(
        select(Tournament).where(Tournament.host_id == user_id).order_by(Tournament.created_at.desc())
    )
    hosted_tournaments = [
        {
            "id": tournament.id,
            "name": tournament.name,
            "game": tournament.game,
            "format": tournament.format,
            "status": tournament.status,
            "start_date": tournament.start_date,
        }
        for tournament in hosted_result.scalars().all()
    ]
    hosted_ids = [tournament["id"] for tournament in hosted_tournaments]
    hosted_participants = 0
    if hosted_ids:
        hosted_count = await db.execute(
            select(func.count()).select_from(Participant).where(Participant.tournament_id.in_(hosted_ids))
        )
        hosted_participants = hosted_count.scalar() or 0

    achievements = [
        {"label": "First place finishes", "value": first_place},
        {"label": "Top 3 finishes", "value": top_three},
        {"label": "Match wins", "value": total_wins},
        {"label": "Hosted participants", "value": hosted_participants},
    ]

    return {
        "total_tournaments_joined": len(tournament_ids),
        "total_wins": total_wins,
        "total_matches_played": total_matches_played,
        "total_tournaments_hosted": len(hosted_tournaments),
        "total_hosted_participants": hosted_participants,
        "first_place_finishes": first_place,
        "top_three_finishes": top_three,
        "games_played": list(games.values()),
        "hosted_tournaments": hosted_tournaments,
        "participated_tournaments": participated_tournaments,
        "achievements": achievements,
    }


async def create_player(
    db: AsyncSession,
    creator: User,
    data: PlayerCreateRequest,
) -> Player:
    player = Player(
        display_name=data.display_name,
        avatar_url=data.avatar_url,
        created_by=creator.id,
    )
    db.add(player)
    try:
        await db.commit()
    except Exception:
        await db.rollback()
        raise
    await db.refresh(player)
    return player


async def list_players(db: AsyncSession, page: int = 1, size: int = 20):
    result = await db.execute(
        select(Player)
        .order_by(Player.created_at.desc())
        .offset((page - 1) * size)
        .limit(size)
    )
    return result.scalars().all()
