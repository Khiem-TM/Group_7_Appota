from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from app.database import get_db
from app.dependencies import get_current_user, require_host
from app.schemas.tournament import TournamentCreate, TournamentUpdate, TournamentOut
from app.schemas.common import MessageResponse
from app.schemas.match import MatchOut
from app.services import tournament as tournament_service
from app.services import bracket as bracket_service
from app.services import match as match_service
from app.models.user import User

router = APIRouter(prefix="/tournaments", tags=["tournaments"])


@router.post("", response_model=TournamentOut, status_code=201)
async def create(
    data: TournamentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_host),
):
    t = await tournament_service.create_tournament(db, current_user, data)
    count = await tournament_service.get_participant_count(db, t.id)
    return TournamentOut(**{k: v for k, v in t.__dict__.items() if not k.startswith("_")}, participant_count=count)


@router.get("", response_model=List[TournamentOut])
async def list_all(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
):
    tournaments = await tournament_service.list_tournaments(db, page, size, status)
    results = []
    for t in tournaments:
        count = await tournament_service.get_participant_count(db, t.id)
        results.append(
            TournamentOut(**{k: v for k, v in t.__dict__.items() if not k.startswith("_")}, participant_count=count)
        )
    return results


@router.get("/{tournament_id}", response_model=TournamentOut)
async def get_one(tournament_id: int, db: AsyncSession = Depends(get_db)):
    t = await tournament_service.get_tournament(db, tournament_id)
    count = await tournament_service.get_participant_count(db, t.id)
    return TournamentOut(**{k: v for k, v in t.__dict__.items() if not k.startswith("_")}, participant_count=count)


@router.patch("/{tournament_id}", response_model=TournamentOut)
async def update(
    tournament_id: int,
    data: TournamentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_host),
):
    t = await tournament_service.update_tournament(db, tournament_id, current_user.id, data)
    count = await tournament_service.get_participant_count(db, t.id)
    return TournamentOut(**{k: v for k, v in t.__dict__.items() if not k.startswith("_")}, participant_count=count)


@router.delete("/{tournament_id}", response_model=MessageResponse)
async def delete(
    tournament_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_host),
):
    await tournament_service.delete_tournament(db, tournament_id, current_user.id)
    return MessageResponse(message="Tournament deleted")


@router.post("/{tournament_id}/publish", response_model=TournamentOut)
async def publish(
    tournament_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_host),
):
    t = await tournament_service.update_status(db, tournament_id, current_user.id, "REGISTRATION_OPEN")
    count = await tournament_service.get_participant_count(db, t.id)
    return TournamentOut(**{k: v for k, v in t.__dict__.items() if not k.startswith("_")}, participant_count=count)


@router.post("/{tournament_id}/start", response_model=TournamentOut)
async def start(
    tournament_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_host),
):
    t = await tournament_service.update_status(db, tournament_id, current_user.id, "ONGOING")
    count = await tournament_service.get_participant_count(db, t.id)
    return TournamentOut(**{k: v for k, v in t.__dict__.items() if not k.startswith("_")}, participant_count=count)


@router.post("/{tournament_id}/generate-bracket", response_model=List[MatchOut])
async def generate_bracket(
    tournament_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_host),
):
    from app.core.exceptions import Forbidden

    t = await tournament_service.get_tournament(db, tournament_id)
    if t.host_id != current_user.id:
        raise Forbidden("Only host can generate bracket")
    matches = await bracket_service.generate_bracket(db, t)
    return [MatchOut(**{k: v for k, v in m.__dict__.items() if not k.startswith("_")}) for m in matches]


@router.post("/{tournament_id}/join", response_model=MessageResponse)
async def join(
    tournament_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await tournament_service.join_tournament(db, tournament_id, current_user)
    return MessageResponse(message="Joined tournament successfully")


@router.post("/{tournament_id}/leave", response_model=MessageResponse)
async def leave(
    tournament_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await tournament_service.leave_tournament(db, tournament_id, current_user.id)
    return MessageResponse(message="Left tournament successfully")


@router.get("/{tournament_id}/matches", response_model=List[MatchOut])
async def get_matches(tournament_id: int, db: AsyncSession = Depends(get_db)):
    matches = await match_service.list_tournament_matches(db, tournament_id)
    return [MatchOut(**{k: v for k, v in m.__dict__.items() if not k.startswith("_")}) for m in matches]
