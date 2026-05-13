from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.common import MessageResponse
from app.schemas.user import (
    ChangePasswordRequest,
    UpdateProfileRequest,
    UserOut,
    UserProfileOut,
)
from app.services import user as user_service

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/me", response_model=UserOut)
async def update_me(
    data: UpdateProfileRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await user_service.update_profile(db, current_user, data)


@router.post("/me/change-password", response_model=MessageResponse)
async def change_password(
    data: ChangePasswordRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await user_service.change_password(db, current_user, data)
    return MessageResponse(message="Password changed successfully")


@router.get("/{user_id}/profile", response_model=UserProfileOut)
async def get_profile(
    user_id: int,
    db: AsyncSession = Depends(get_db),
):
    user = await user_service.get_user_by_id(db, user_id)
    stats = await user_service.get_user_stats(db, user_id)
    return UserProfileOut(
        **{k: v for k, v in user.__dict__.items() if not k.startswith("_")},
        total_tournaments_joined=stats["total_tournaments_joined"],
        total_wins=stats["total_wins"],
    )
