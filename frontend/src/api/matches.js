import client from "./client";

export async function getMatch(matchId) {
  const { data } = await client.get(`/matches/${matchId}`);
  return data;
}

export async function reportMatch(matchId, scorePLayer1, scorePlayer2) {
  const { data } = await client.post(`/matches/${matchId}/report`, {
    score_player1: scorePLayer1,
    score_player2: scorePlayer2
  });
  return data;
}
