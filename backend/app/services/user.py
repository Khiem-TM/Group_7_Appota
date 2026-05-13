from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequest, Conflict, NotFound
from app.core.security import hash_password, verify_password
from app.models.participant import Participant
from app.models.standing import Standing
from app.models.user import User
from app.schemas.user import ChangePasswordRequest, UpdateProfileRequest


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

    if data.bio is not None:
        user.bio = data.bio
    if data.country is not None:
        user.country = data.country
    if data.avatar_url is not None:
        user.avatar_url = data.avatar_url

    await db.commit()
    await db.refresh(user)
    return user


async def change_password(db: AsyncSession, user: User, data: ChangePasswordRequest):
    if not verify_password(data.current_password, user.password_hash):
        raise BadRequest("Current password is incorrect")
    user.password_hash = hash_password(data.new_password)
    await db.commit()


async def get_user_stats(db: AsyncSession, user_id: int) -> dict:
    total_joined = await db.execute(
        select(func.count()).select_from(Participant).where(Participant.user_id == user_id)
    )
    total_wins = await db.execute(
        select(func.sum(Standing.wins))
        .join(Participant, Standing.participant_id == Participant.id)
        .where(Participant.user_id == user_id)
    )
    return {
        "total_tournaments_joined": total_joined.scalar() or 0,
        "total_wins": total_wins.scalar() or 0,
    }
