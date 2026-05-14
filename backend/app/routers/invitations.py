from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_current_user, require_host
from app.database import get_db
from app.models.user import User
from app.schemas.invitation import InvitationOut, InviteParticipantRequest, NotificationOut
from app.schemas.tournament import ParticipantOut
from app.services import invitation as invitation_service

router = APIRouter(tags=["invitations"])


@router.post(
    "/tournaments/{tournament_id}/invite",
    response_model=InvitationOut,
    status_code=201,
)
async def invite_participant(
    tournament_id: int,
    data: InviteParticipantRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_host),
):
    return await invitation_service.send_invitation(
        db,
        tournament_id=tournament_id,
        host_id=current_user.id,
        player_name=data.player_name,
        invited_user_id=data.invited_user_id,
    )


@router.post("/invitations/{invitation_id}/accept", response_model=ParticipantOut)
async def accept_invitation(
    invitation_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await invitation_service.accept_invitation(db, invitation_id, current_user.id)


@router.post("/invitations/{invitation_id}/decline", status_code=204)
async def decline_invitation(
    invitation_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await invitation_service.decline_invitation(db, invitation_id, current_user.id)


@router.get("/users/me/notifications", response_model=list[NotificationOut])
async def get_my_notifications(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await invitation_service.list_notifications(db, current_user.id)


@router.patch("/notifications/{notification_id}/read", response_model=NotificationOut)
async def mark_notification_read(
    notification_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await invitation_service.mark_notification_read(
        db, notification_id, current_user.id
    )
