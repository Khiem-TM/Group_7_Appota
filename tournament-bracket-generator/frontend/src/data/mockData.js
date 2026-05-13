export const currentUser = {
  id: 1,
  username: "ace_admin",
  displayName: "Ace Nova",
  email: "ace@bracket.gg",
  role: "Organizer",
  avatar: "AN",
  bio: "Running weekly community cups and mid-size esports ladders.",
  joinedAt: "2025-08-10"
};

export const dashboardStats = [
  { label: "Active Tournaments", value: 8, trend: "+2 this week" },
  { label: "Total Participants", value: 1240, trend: "+14% growth" },
  { label: "Matches Completed", value: 362, trend: "93 today" },
  { label: "Pending Announcements", value: 5, trend: "2 urgent" }
];

export const tournaments = [
  {
    id: "nebula-open",
    name: "Nebula Open 2026",
    game: "Valorant",
    format: "Single Elimination",
    status: "registration_open",
    participants: 128,
    maxParticipants: 128,
    prizePool: "$2,500",
    startDate: "2026-05-20",
    organizer: "Bracket Lab",
    region: "SEA",
    banner: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
    description: "Fast-paced open cup for rising teams."
  },
  {
    id: "city-clash",
    name: "City Clash Invitational",
    game: "League of Legends",
    format: "Double Elimination",
    status: "in_progress",
    participants: 16,
    maxParticipants: 16,
    prizePool: "$5,000",
    startDate: "2026-05-10",
    organizer: "Metro Esports",
    region: "VN",
    banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    description: "Top city teams battle for season points."
  },
  {
    id: "phoenix-finals",
    name: "Phoenix Finals",
    game: "CS2",
    format: "Round Robin + Playoff",
    status: "completed",
    participants: 24,
    maxParticipants: 24,
    prizePool: "$10,000",
    startDate: "2026-04-02",
    organizer: "Firebyte Arena",
    region: "APAC",
    banner: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=1200&q=80",
    description: "Season-ending championship with playoff stage."
  }
];

export const leaderboard = [
  { rank: 1, team: "Stormbreak", points: 42, wins: 14, losses: 2 },
  { rank: 2, team: "Arc Fusion", points: 36, wins: 12, losses: 4 },
  { rank: 3, team: "Nightwire", points: 31, wins: 10, losses: 6 },
  { rank: 4, team: "Mirage Unit", points: 28, wins: 9, losses: 7 },
  { rank: 5, team: "Crimson Loop", points: 24, wins: 8, losses: 8 }
];

export const announcements = [
  {
    id: 1,
    title: "Check-in starts 30 minutes before round 1",
    body: "All team captains must complete Discord check-in to avoid auto disqualification.",
    author: "Admin",
    createdAt: "2026-05-13 11:30"
  },
  {
    id: 2,
    title: "Map pool updated",
    body: "The map Haven has been replaced by Ascent for this event.",
    author: "Ops Team",
    createdAt: "2026-05-13 09:10"
  },
  {
    id: 3,
    title: "Stream delay policy",
    body: "Broadcast channels will run with a 3-minute delay for competitive integrity.",
    author: "Broadcast",
    createdAt: "2026-05-12 19:45"
  }
];

export const bracketRounds = [
  {
    name: "Quarterfinals",
    matches: [
      { id: "qf-1", teamA: "Stormbreak", teamB: "Pulse 9", scoreA: 2, scoreB: 0, status: "finished" },
      { id: "qf-2", teamA: "Nightwire", teamB: "Arc Fusion", scoreA: 1, scoreB: 2, status: "finished" },
      { id: "qf-3", teamA: "Crimson Loop", teamB: "Mirage Unit", scoreA: 0, scoreB: 2, status: "finished" },
      { id: "qf-4", teamA: "Waveform", teamB: "Hex Unit", scoreA: 2, scoreB: 1, status: "finished" }
    ]
  },
  {
    name: "Semifinals",
    matches: [
      { id: "sf-1", teamA: "Stormbreak", teamB: "Arc Fusion", scoreA: 0, scoreB: 0, status: "upcoming" },
      { id: "sf-2", teamA: "Mirage Unit", teamB: "Waveform", scoreA: 0, scoreB: 0, status: "upcoming" }
    ]
  },
  {
    name: "Grand Final",
    matches: [{ id: "gf-1", teamA: "TBD", teamB: "TBD", scoreA: 0, scoreB: 0, status: "upcoming" }]
  }
];

export const upcomingMatches = [
  { id: "m1", teamA: "Stormbreak", teamB: "Arc Fusion", time: "18:30", stage: "Semifinal" },
  { id: "m2", teamA: "Mirage Unit", teamB: "Waveform", time: "20:00", stage: "Semifinal" }
];
