from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import redis.asyncio as aioredis
from app.database import get_db
from app.core.redis import get_redis
from app.dependencies import require_host
from app.schemas.announcement import AnnouncementCreate, AnnouncementOut
from app.services.announcement import create_announcement, list_announcements
from app.services.realtime import publish_event
from app.models.user import User

router = APIRouter(prefix="/tournaments", tags=["announcements"])


@router.get("/{tournament_id}/announcements", response_model=List[AnnouncementOut])
async def get_announcements(tournament_id: int, db: AsyncSession = Depends(get_db)):
    anns = await list_announcements(db, tournament_id)
    result = []
    for a in anns:
        result.append(
            AnnouncementOut(
                **{k: v for k, v in a.__dict__.items() if not k.startswith("_")},
                author_username="",
            )
        )
    return result


@router.post("/{tournament_id}/announcements", response_model=AnnouncementOut, status_code=201)
async def post_announcement(
    tournament_id: int,
    data: AnnouncementCreate,
    db: AsyncSession = Depends(get_db),
    redis: aioredis.Redis = Depends(get_redis),
    current_user: User = Depends(require_host),
):
    ann = await create_announcement(db, tournament_id, current_user, data)
    await publish_event(
        redis,
        tournament_id,
        {
            "type": "ANNOUNCEMENT",
            "title": ann.title,
            "content": ann.content,
        },
    )
    return AnnouncementOut(
        **{k: v for k, v in ann.__dict__.items() if not k.startswith("_")},
        author_username=current_user.username,
    )
