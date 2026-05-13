import client from "./client";

const FORMAT_MAP = {
  "Single Elimination": "SINGLE_ELIMINATION",
  "Double Elimination": "DOUBLE_ELIMINATION",
  "Round Robin": "ROUND_ROBIN",
  "Swiss": "SWISS"
};

const FORMAT_DISPLAY = {
  SINGLE_ELIMINATION: "Single Elimination",
  DOUBLE_ELIMINATION: "Double Elimination",
  ROUND_ROBIN: "Round Robin",
  SWISS: "Swiss"
};

const STATUS_DISPLAY = {
  DRAFT: "pending",
  REGISTRATION_OPEN: "pending",
  SEEDING: "pending",
  ONGOING: "in_progress",
  FINISHED: "complete",
  ARCHIVED: "complete"
};

export function toBackendFormat(displayFormat) {
  return FORMAT_MAP[displayFormat] || displayFormat.toUpperCase().replace(/ /g, "_");
}

export function toDisplayFormat(backendFormat) {
  return FORMAT_DISPLAY[backendFormat] || backendFormat;
}

export function toDisplayStatus(backendStatus) {
  return STATUS_DISPLAY[backendStatus] || "pending";
}

export async function listTournaments(page = 1, size = 20, status = null) {
  const params = { page, size };
  if (status) params.status = status;
  const { data } = await client.get("/tournaments", { params });
  return data;
}

export async function getTournament(id) {
  const { data } = await client.get(`/tournaments/${id}`);
  return data;
}

export async function createTournament(payload) {
  const body = {
    name: payload.name,
    description: payload.description || "",
    format: toBackendFormat(payload.format),
    game: payload.game || "",
    max_players: payload.maxPlayers || 16,
    visibility: "PUBLIC",
    start_date: payload.startDate || null,
    prize_pool: payload.prizePool || null,
    rules: payload.rules || null
  };
  const { data } = await client.post("/tournaments", body);
  return data;
}

export async function updateTournament(id, payload) {
  const { data } = await client.patch(`/tournaments/${id}`, payload);
  return data;
}

export async function deleteTournament(id) {
  const { data } = await client.delete(`/tournaments/${id}`);
  return data;
}

export async function publishTournament(id) {
  const { data } = await client.post(`/tournaments/${id}/publish`);
  return data;
}

export async function startTournament(id) {
  const { data } = await client.post(`/tournaments/${id}/start`);
  return data;
}

export async function generateBracket(id) {
  const { data } = await client.post(`/tournaments/${id}/generate-bracket`);
  return data;
}

export async function addParticipant(id, playerName) {
  const { data } = await client.post(`/tournaments/${id}/participants`, {
    player_name: playerName
  });
  return data;
}

export async function joinTournament(id) {
  const { data } = await client.post(`/tournaments/${id}/join`);
  return data;
}

export async function leaveTournament(id) {
  const { data } = await client.post(`/tournaments/${id}/leave`);
  return data;
}

export async function getTournamentMatches(id) {
  const { data } = await client.get(`/tournaments/${id}/matches`);
  return data;
}

export async function getTournamentStandings(id) {
  const { data } = await client.get(`/tournaments/${id}/standings`);
  return data;
}

export async function getTournamentParticipants(id) {
  const { data } = await client.get(`/tournaments/${id}/participants`);
  return data;
}

export function matchesToBracketRounds(matches) {
  if (!matches || matches.length === 0) return [];

  const roundMap = new Map();
  for (const m of matches) {
    const round = m.round ?? 1;
    if (!roundMap.has(round)) roundMap.set(round, []);
    roundMap.get(round).push(m);
  }

  const sortedRounds = [...roundMap.entries()].sort(([a], [b]) => a - b);
  const totalRounds = sortedRounds.length;

  return sortedRounds.map(([roundNum, roundMatches], idx) => {
    const remaining = totalRounds - idx;
    let name;
    if (remaining === 1) name = "Final";
    else if (remaining === 2) name = "Semifinals";
    else if (remaining === 3) name = "Quarterfinals";
    else name = `Round ${roundNum}`;

    return {
      name,
      matches: roundMatches
        .sort((a, b) => (a.match_number ?? 0) - (b.match_number ?? 0))
        .map((m) => ({
          id: m.id,
          teamA: m.player1_name ?? (m.player1_id ? `Player #${m.player1_id}` : "TBD"),
          teamB: m.player2_name ?? (m.player2_id ? `Player #${m.player2_id}` : "TBD"),
          scoreA: m.score_player1 ?? 0,
          scoreB: m.score_player2 ?? 0,
          status: m.status === "COMPLETED" || m.status === "VERIFIED" ? "finished" : "upcoming"
        }))
    };
  });
}
