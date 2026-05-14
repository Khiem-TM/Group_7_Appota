import client from "./client";

export async function getMyNotifications() {
  const { data } = await client.get("/users/me/notifications");
  return data;
}

export async function markNotificationRead(notificationId) {
  const { data } = await client.patch(`/notifications/${notificationId}/read`);
  return data;
}

export async function acceptInvitation(invitationId) {
  const { data } = await client.post(`/invitations/${invitationId}/accept`);
  return data;
}

export async function declineInvitation(invitationId) {
  await client.post(`/invitations/${invitationId}/decline`);
}

export async function searchUsers(q) {
  if (!q || !q.trim()) return [];
  const { data } = await client.get(`/users/search?q=${encodeURIComponent(q.trim())}&limit=10`);
  return data;
}

export async function inviteParticipant(tournamentId, playerName, invitedUserId) {
  const { data } = await client.post(`/tournaments/${tournamentId}/invite`, {
    player_name: playerName,
    invited_user_id: invitedUserId,
  });
  return data;
}
