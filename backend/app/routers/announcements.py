import logging
from typing import List

import redis.asyncio as aioredis
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.redis import get_redis
from app.database import get_db
from app.dependencies import require_host
from app.models.user import User
from app.schemas.announcement import AnnouncementCreate, AnnouncementOut
from app.services.announcement import create_announcement, list_announcements
from app.services.realtime import publish_event

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/tournaments", tags=["announcements"])


@router.get("/{tournament_id}/announcements", response_model=List[AnnouncementOut])
async def get_announcements(tournament_id: int, db: AsyncSession = Depends(get_db)):
    anns = await list_announcements(db, tournament_id)

    # Batch-fetch all authors in one query
    author_ids = list({a.author_id for a in anns if a.author_id})
    authors: dict[int, str] = {}
    if author_ids:
        rows = await db.execute(select(User.id, User.username).where(User.id.in_(author_ids)))
        authors = {row.id: row.username for row in rows}

    result = []
    for a in anns:
        result.append(
            AnnouncementOut(
                **{k: v for k, v in a.__dict__.items() if not k.startswith("_")},
                author_username=authors.get(a.author_id, ""),
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
    try:
        await publish_event(
            redis,
            tournament_id,
            {
                "type": "ANNOUNCEMENT",
                "title": ann.title,
                "content": ann.content,
            },
        )
    except Exception:
        logger.warning("Announcement created, but realtime publish failed", exc_info=True)
    return AnnouncementOut(
        **{k: v for k, v in ann.__dict__.items() if not k.startswith("_")},
        author_username=current_user.username,
    )
