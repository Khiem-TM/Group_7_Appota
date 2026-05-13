import client from "./client";

export async function searchTournaments(q = "", game = "", format = "", status = "", page = 1, size = 20) {
  const params = { page, size };
  if (q) params.q = q;
  if (game) params.game = game;
  if (format) params.format = format;
  if (status) params.status = status;
  const { data } = await client.get("/search/tournaments", { params });
  return data;
}

export async function getTrending() {
  const { data } = await client.get("/explore/trending");
  return data;
}

export async function getLive() {
  const { data } = await client.get("/explore/live");
  return data;
}

export async function getUpcoming() {
  const { data } = await client.get("/explore/upcoming");
  return data;
}
