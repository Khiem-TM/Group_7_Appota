from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.announcement import Announcement
from app.models.user import User
from app.schemas.announcement import AnnouncementCreate


async def create_announcement(
    db: AsyncSession,
    tournament_id: int,
    author: User,
    data: AnnouncementCreate,
) -> Announcement:
    ann = Announcement(
        tournament_id=tournament_id,
        author_id=author.id,
        title=data.title,
        content=data.content,
        announcement_type=data.announcement_type.upper(),
    )
    db.add(ann)
    await db.commit()
    await db.refresh(ann)
    return ann


async def list_announcements(db: AsyncSession, tournament_id: int) -> List[Announcement]:
    result = await db.execute(
        select(Announcement)
        .where(Announcement.tournament_id == tournament_id)
        .order_by(Announcement.created_at.desc())
    )
    return result.scalars().all()
