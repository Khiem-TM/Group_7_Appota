import redis.asyncio as aioredis
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import Forbidden, Unauthorized
from app.core.redis import get_redis
from app.core.security import decode_token
from app.database import get_db
from app.models.user import User

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),  # noqa: B008
    db: AsyncSession = Depends(get_db),  # noqa: B008
    redis: aioredis.Redis = Depends(get_redis),  # noqa: B008
) -> User:
    token = credentials.credentials
    payload = decode_token(token)
    if not payload or payload.get("type") == "refresh":
        raise Unauthorized("Invalid or expired token")

    user_id = int(payload["sub"])
    result = await db.execute(
        select(User).where(User.id == user_id, User.is_active)
    )
    user = result.scalar_one_or_none()
    if not user:
        raise Unauthorized("User not found")
    return user


def require_role(*roles: str):
    async def checker(current_user: User = Depends(get_current_user)) -> User:  # noqa: B008
        if current_user.role not in roles:
            raise Forbidden(f"Requires role: {', '.join(roles)}")
        return current_user

    return checker


require_host = require_role("HOST", "ADMIN")
require_admin = require_role("ADMIN")
