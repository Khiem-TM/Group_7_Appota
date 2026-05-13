import redis.asyncio as aioredis
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequest, Conflict, Unauthorized
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.player import Player
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest

REFRESH_TTL_SECONDS = 7 * 24 * 3600


async def register(db: AsyncSession, redis: aioredis.Redis, data: RegisterRequest):
    existing = await db.execute(
        select(User).where((User.email == data.email) | (User.username == data.username))
    )
    if existing.scalar_one_or_none():
        raise Conflict("Email or username already taken")

    user = User(
        email=data.email,
        username=data.username,
        password_hash=hash_password(data.password),
        role=data.role,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    player = Player(
        display_name=user.username,
        avatar_url=user.avatar_url,
        created_by=user.id,
    )
    db.add(player)
    await db.commit()
    await db.refresh(player)

    access_token = create_access_token(user.id, user.role)
    refresh_token = create_refresh_token(user.id)
    await redis.setex(f"session:user:{user.id}", REFRESH_TTL_SECONDS, refresh_token)

    return user, access_token, refresh_token


async def login(db: AsyncSession, redis: aioredis.Redis, data: LoginRequest):
    result = await db.execute(
        select(User).where(User.email == data.email, User.is_active)
    )
    user = result.scalar_one_or_none()
    if not user or not verify_password(data.password, user.password_hash):
        raise Unauthorized("Invalid credentials")

    access_token = create_access_token(user.id, user.role)
    refresh_token = create_refresh_token(user.id)
    await redis.setex(f"session:user:{user.id}", REFRESH_TTL_SECONDS, refresh_token)

    return user, access_token, refresh_token


async def refresh(db: AsyncSession, redis: aioredis.Redis, refresh_token: str):
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise BadRequest("Invalid refresh token")

    user_id = int(payload["sub"])
    stored = await redis.get(f"session:user:{user_id}")
    if stored != refresh_token:
        raise Unauthorized("Refresh token revoked or invalid")

    result = await db.execute(
        select(User).where(User.id == user_id, User.is_active)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise Unauthorized("User not found")

    new_access = create_access_token(user.id, user.role)
    new_refresh = create_refresh_token(user.id)
    await redis.setex(f"session:user:{user.id}", REFRESH_TTL_SECONDS, new_refresh)

    return new_access, new_refresh


async def logout(redis: aioredis.Redis, user_id: int):
    await redis.delete(f"session:user:{user_id}")
