from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.game import Game
from app.schemas.game import GameOut

router = APIRouter(prefix="/games", tags=["games"])


@router.get("", response_model=list[GameOut])
async def list_games(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Game).order_by(Game.name))
    return result.scalars().all()
