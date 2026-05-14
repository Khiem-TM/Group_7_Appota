from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import BadRequest, Conflict, Forbidden, NotFound
from app.models.invitation import Invitation
from app.models.notification import Notification
from app.models.participant import Participant
from app.models.player import Player
from app.models.standing import Standing
from app.models.tournament import Tournament
from app.models.user import User


async def send_invitation(
    db: AsyncSession,
    tournament_id: int,
    host_id: int,
    player_name: str,
    invited_user_id: int,
) -> Invitation:
    tournament = await db.get(Tournament, tournament_id)
    if not tournament:
        raise NotFound("Tournament not found")
    if tournament.host_id != host_id:
        raise Forbidden("Only the host can invite participants")
    if tournament.status not in ("DRAFT", "REGISTRATION_OPEN", "SEEDING"):
        raise BadRequest("Cannot invite to a tournament that has already started")

    invited_user = await db.get(User, invited_user_id)
    if not invited_user:
        raise NotFound(f"User {invited_user_id} not found")

    existing = await db.execute(
        select(Invitation).where(
            Invitation.tournament_id == tournament_id,
            Invitation.invited_user_id == invited_user_id,
            Invitation.status == "pending",
        )
    )
    if existing.scalar_one_or_none():
        raise Conflict("A pending invitation already exists for this user")

    invitation = Invitation(
        tournament_id=tournament_id,
        invited_by=host_id,
        invited_user_id=invited_user_id,
        player_name=player_name,
        status="pending",
    )
    db.add(invitation)
    await db.flush()

    notification = Notification(
        user_id=invited_user_id,
        type="INVITE",
        title=f"Bạn được mời tham gia giải đấu: {tournament.name}",
        body=f"Tên người chơi: {player_name}. Chấp nhận hoặc từ chối lời mời.",
        related_id=invitation.id,
        is_read=False,
    )
    db.add(notification)
    await db.commit()
    await db.refresh(invitation)
    return invitation


async def accept_invitation(
    db: AsyncSession, invitation_id: int, user_id: int
) -> Participant:
    invitation = await db.get(Invitation, invitation_id)
    if not invitation:
        raise NotFound("Invitation not found")
    if invitation.invited_user_id != user_id:
        raise Forbidden("This invitation is not for you")
    if invitation.status != "pending":
        raise BadRequest("Invitation has already been actioned")

    tournament = await db.get(Tournament, invitation.tournament_id)
    if not tournament:
        raise NotFound("Tournament not found")

    count_result = await db.execute(
        select(Participant).where(Participant.tournament_id == invitation.tournament_id)
    )
    current_count = len(count_result.scalars().all())
    if current_count >= tournament.max_players:
        raise BadRequest("Tournament is already full")

    player = Player(display_name=invitation.player_name, created_by=user_id)
    db.add(player)
    await db.flush()

    participant = Participant(
        tournament_id=invitation.tournament_id,
        player_id=player.id,
        user_id=user_id,
    )
    db.add(participant)
    await db.flush()

    standing = Standing(
        tournament_id=invitation.tournament_id,
        participant_id=participant.id,
    )
    db.add(standing)

    invitation.participant_id = participant.id
    invitation.status = "accepted"

    await db.execute(
        update(Notification)
        .where(
            Notification.related_id == invitation_id,
            Notification.user_id == user_id,
        )
        .values(is_read=True)
    )

    await db.commit()
    await db.refresh(participant)
    return participant


async def decline_invitation(
    db: AsyncSession, invitation_id: int, user_id: int
) -> None:
    invitation = await db.get(Invitation, invitation_id)
    if not invitation:
        raise NotFound("Invitation not found")
    if invitation.invited_user_id != user_id:
        raise Forbidden("This invitation is not for you")
    if invitation.status != "pending":
        raise BadRequest("Invitation has already been actioned")

    invitation.status = "declined"

    await db.execute(
        update(Notification)
        .where(
            Notification.related_id == invitation_id,
            Notification.user_id == user_id,
        )
        .values(is_read=True)
    )

    await db.commit()


async def list_notifications(db: AsyncSession, user_id: int) -> list[Notification]:
    result = await db.execute(
        select(Notification)
        .where(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .limit(50)
    )
    return result.scalars().all()


async def mark_notification_read(
    db: AsyncSession, notification_id: int, user_id: int
) -> Notification:
    notification = await db.get(Notification, notification_id)
    if not notification:
        raise NotFound("Notification not found")
    if notification.user_id != user_id:
        raise Forbidden("This notification is not yours")
    notification.is_read = True
    await db.commit()
    await db.refresh(notification)
    return notification
