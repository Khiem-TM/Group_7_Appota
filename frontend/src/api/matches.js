import client from "./client";

export async function getMatch(matchId) {
  const { data } = await client.get(`/matches/${matchId}`);
  return data;
}

export async function reportMatch(matchId, scorePlayer1, scorePlayer2, startedAt = null, finishedAt = null) {
  const body = { score_player1: scorePlayer1, score_player2: scorePlayer2 };
  if (startedAt) body.started_at = startedAt;
  if (finishedAt) body.finished_at = finishedAt;
  const { data } = await client.post(`/matches/${matchId}/report`, body);
  return data;
}
