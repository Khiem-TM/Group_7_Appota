from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Request, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user, require_admin, require_host
from app.models.user import User
from app.schemas.common import MessageResponse
from app.schemas.user import (
    ChangePasswordRequest,
    PlayerCreateRequest,
    PlayerOut,
    UpdateProfileRequest,
    UserOut,
    UserProfileOut,
    UserSearchOut,
)
from app.services import user as user_service

router = APIRouter(prefix="/users", tags=["users"])
PROFILE_UPLOAD_DIR = Path("uploads/profile")
PROFILE_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
ALLOWED_PROFILE_MEDIA = {"avatar": "avatar_url", "cover": "cover_url"}
MAX_PROFILE_MEDIA_SIZE = 5 * 1024 * 1024


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/me/profile", response_model=UserProfileOut)
async def get_my_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stats = await user_service.get_user_stats(db, current_user.id)
    return UserProfileOut(
        **{k: v for k, v in current_user.__dict__.items() if not k.startswith("_")},
        **stats,
    )


@router.patch("/me", response_model=UserOut)
async def update_me(
    data: UpdateProfileRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await user_service.update_profile(db, current_user, data)


@router.post("/me/media")
async def upload_profile_media(
    request: Request,
    kind: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    if kind not in ALLOWED_PROFILE_MEDIA:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid media kind")
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only image files are allowed")

    content = await file.read()
    if len(content) > MAX_PROFILE_MEDIA_SIZE:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Image must be 5MB or smaller")

    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
        suffix = ".jpg"

    filename = f"user_{current_user.id}_{kind}_{uuid4().hex}{suffix}"
    destination = PROFILE_UPLOAD_DIR / filename
    destination.write_bytes(content)

    base_url = str(request.base_url).rstrip("/")
    return {"url": f"{base_url}/uploads/profile/{filename}"}


@router.post("/me/change-password", response_model=MessageResponse)
async def change_password(
    data: ChangePasswordRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await user_service.change_password(db, current_user, data)
    return MessageResponse(message="Password changed successfully")


@router.post("/players", response_model=PlayerOut)
async def create_player(
    data: PlayerCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_host),
):
    player = await user_service.create_player(db, current_user, data)
    return PlayerOut.model_validate(player)


@router.get("/players", response_model=list[PlayerOut])
async def list_players(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_admin),
    page: int = 1,
    size: int = 20,
):
    players = await user_service.list_players(db, page, size)
    return [PlayerOut.model_validate(player) for player in players]


@router.get("/search", response_model=list[UserSearchOut])
async def search_users(
    q: str = Query("", min_length=0),
    limit: int = Query(10, ge=1, le=20),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await user_service.search_users_by_username(db, q, limit)


@router.get("/{user_id}/profile", response_model=UserProfileOut)
async def get_profile(
    user_id: int,
    db: AsyncSession = Depends(get_db),
):
    user = await user_service.get_user_by_id(db, user_id)
    stats = await user_service.get_user_stats(db, user_id)
    return UserProfileOut(
        **{k: v for k, v in user.__dict__.items() if not k.startswith("_")},
        **stats,
    )
