import client from "./client";

export async function listAnnouncements(tournamentId) {
  const { data } = await client.get(`/tournaments/${tournamentId}/announcements`);
  return data;
}

export async function createAnnouncement(tournamentId, title, content, type = "GENERAL") {
  const { data } = await client.post(`/tournaments/${tournamentId}/announcements`, {
    title,
    content,
    announcement_type: type
  });
  return data;
}
