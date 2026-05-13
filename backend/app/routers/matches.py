from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import require_host
from app.models.user import User
from app.schemas.match import MatchOut, ReportMatchRequest
from app.services import match as match_service

router = APIRouter(prefix="/matches", tags=["matches"])


@router.get("/{match_id}", response_model=MatchOut)
async def get_match(match_id: int, db: AsyncSession = Depends(get_db)):
    m = await match_service.get_match(db, match_id)
    return MatchOut.model_validate(m)


@router.post("/{match_id}/report", response_model=MatchOut)
async def report_score(
    match_id: int,
    data: ReportMatchRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_host),
):
    m = await match_service.report_match(db, match_id, current_user.id, data)
    return MatchOut.model_validate(m)
