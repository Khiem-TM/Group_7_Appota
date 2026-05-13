import { ChevronLeft, ClipboardList, Maximize2, Plus, Share2, Shuffle, Swords, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import BracketView from "../components/tournaments/BracketView";
import { tournaments } from "../data/mockData";

const tabs = [
  { key: "bracket", label: "Bracket" },
  { key: "standings", label: "Standings" },
  { key: "announcements", label: "Announcements (0)" },
  { key: "log", label: "Log (1)" },
  { key: "stations", label: "Stations" },
  { key: "participants", label: "Participants" },
  { key: "settings", label: "Settings" },
  { key: "issues", label: "Issues (0)" }
];

function formatDateTime(value) {
  if (!value) return "May 12, 2026, 7:01 PM +07";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return (
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }).format(date) + " +07"
  );
}

function getRoundName(size, roundIndex) {
  const remainingRounds = Math.log2(size) - roundIndex;
  if (remainingRounds === 1) return "Final";
  if (remainingRounds === 2) return "Semifinals";
  if (remainingRounds === 3) return "Quarterfinals";
  return `Round ${roundIndex + 1}`;
}

function buildSeedOrder(size) {
  if (size === 2) return [1, 2];
  const prev = buildSeedOrder(size / 2);
  const result = [];
  prev.forEach((seed) => {
    result.push(seed);
    result.push(size + 1 - seed);
  });
  return result;
}

function generateSeededBracket(participants) {
  if (participants.length < 2) return [];

  let bracketSize = 1;
  while (bracketSize < participants.length) bracketSize *= 2;

  const seedOrder = buildSeedOrder(bracketSize);
  const seedMap = new Map(
    participants.map((name, index) => [
      index + 1,
      {
        seed: index + 1,
        name,
        isBye: false
      }
    ])
  );

  const seeded = seedOrder.map((seed) => {
    const participant = seedMap.get(seed);
    if (participant) return participant;
    return { seed, name: "BYE", isBye: true };
  });

  const rounds = [];
  let currentRoundEntries = seeded;
  let roundIndex = 0;

  while (currentRoundEntries.length > 1) {
    const matches = [];
    const nextRoundEntries = [];

    for (let i = 0; i < currentRoundEntries.length; i += 2) {
      const a = currentRoundEntries[i];
      const b = currentRoundEntries[i + 1];
      const aLabel = a.name === "TBD" ? "TBD" : `#${a.seed} ${a.name}`;
      const bLabel = b.name === "TBD" ? "TBD" : `#${b.seed} ${b.name}`;

      const byeAutoAdvance = (a.isBye && !b.isBye) || (!a.isBye && b.isBye);
      const winner = a.isBye ? b : b.isBye ? a : null;

      matches.push({
        id: `r${roundIndex + 1}-m${i / 2 + 1}`,
        teamA: aLabel,
        teamB: bLabel,
        scoreA: byeAutoAdvance && !a.isBye ? 1 : 0,
        scoreB: byeAutoAdvance && !b.isBye ? 1 : 0,
        status: byeAutoAdvance ? "finished" : "upcoming"
      });

      nextRoundEntries.push(
        winner || {
          seed: Math.min(a.seed, b.seed),
          name: "TBD",
          isBye: false
        }
      );
    }

    rounds.push({
      name: getRoundName(bracketSize, roundIndex),
      matches
    });

    currentRoundEntries = nextRoundEntries;
    roundIndex += 1;
  }

  return rounds;
}

function TournamentDetailPage() {
  const { id, tab } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [newParticipant, setNewParticipant] = useState("");
  const [isBracketFullscreen, setIsBracketFullscreen] = useState(false);
  const activeTab = tabs.some((item) => item.key === tab) ? tab : "bracket";
  const showParticipantsTab = activeTab === "participants";
  const showBracketTab = activeTab === "bracket";

  useEffect(() => {
    if (!tab || !tabs.some((item) => item.key === tab)) {
      navigate(`/app/tournaments/${id}/bracket`, { replace: true, state: location.state });
    }
  }, [id, location.state, navigate, tab]);

  useEffect(() => {
    if (!showBracketTab) {
      setIsBracketFullscreen(false);
    }
  }, [showBracketTab]);

  useEffect(() => {
    if (!isBracketFullscreen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsBracketFullscreen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isBracketFullscreen]);

  const tournament = useMemo(() => {
    const fromRoute = tournaments.find((item) => item.id === id);
    if (fromRoute) {
      return {
        id: fromRoute.id,
        name: fromRoute.name,
        organizer: fromRoute.organizer,
        format: fromRoute.format,
        game: fromRoute.game,
        startTime: fromRoute.startDate
      };
    }

    const fromState = location.state?.tournament;
    if (fromState) {
      return {
        id: fromState.id,
        name: fromState.name,
        organizer: fromState.host || "ductinbk",
        format: fromState.format,
        game: fromState.game,
        startTime: fromState.startTime
      };
    }

    return {
      id,
      name: "123",
      organizer: "ductinbk",
      format: "Single Elimination",
      game: "League of Legends",
      startTime: "2026-05-12T19:01"
    };
  }, [id, location.state]);

  const [participants, setParticipants] = useState(() => location.state?.participantsList || []);

  const rounds = useMemo(() => generateSeededBracket(participants), [participants]);

  const handleAddParticipant = (event) => {
    event.preventDefault();
    const value = newParticipant.trim();
    if (!value) return;

    setParticipants((prev) => [...prev, value]);
    setNewParticipant("");
    navigate(`/app/tournaments/${id}/bracket`);
  };

  const handleShuffleSeeds = () => {
    setParticipants((prev) => {
      const clone = [...prev];
      for (let i = clone.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [clone[i], clone[j]] = [clone[j], clone[i]];
      }
      return clone;
    });
  };

  const handleBulkAdd = () => {
    const text = window.prompt("Paste participant names, one per line:");
    if (!text) return;

    const names = text
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);

    if (names.length === 0) return;

    setParticipants((prev) => [...prev, ...names]);
    navigate(`/app/tournaments/${id}/bracket`);
  };

  return (
    <div className="-mx-4 -my-6 min-h-[calc(100vh-3.5rem)] bg-surface sm:-mx-6 lg:-mx-8">
      <div className="mx-auto min-h-[calc(100vh-3.5rem)] max-w-[1440px] bg-tournament-shell lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-r border-outline-variant bg-surface-container-low/70">
          <div className="px-6 py-6">
            <Link
              to="/app/dashboard"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface text-on-surface-variant hover:text-white"
            >
              <ChevronLeft size={22} />
            </Link>
          </div>

          <nav className="space-y-1 px-5 pb-8">
            {tabs.map((item) => (
              <Link
                key={item.key}
                to={`/app/tournaments/${id}/${item.key}`}
                className={`block w-full whitespace-nowrap rounded-md px-4 py-2.5 text-left text-lg leading-tight tracking-tight transition ${
                  activeTab === item.key
                    ? "bg-surface-container-highest text-white"
                    : "text-on-surface-variant hover:bg-surface-container-highest/60 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="px-6 py-8 lg:px-12 lg:py-10">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="font-display text-3xl font-bold italic tracking-tight text-white md:text-4xl">{tournament.name}</h1>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-outline-variant bg-surface-container-highest px-6 py-3 text-on-surface hover:bg-surface-bright"
            >
              <Share2 size={18} />
            </button>
          </div>

          <div className="mt-5 h-1 w-28 bg-tertiary-container" />

          <div className="mt-8 rounded-2xl border border-outline-variant bg-surface-container-low/90 p-8 lg:flex lg:items-start lg:justify-between lg:gap-8">
            <dl className="grid grid-cols-[105px_1fr] gap-x-6 gap-y-3 text-base leading-tight md:grid-cols-[120px_1fr] md:text-xl">
              <dt className="text-on-surface-variant">Players</dt>
              <dd className="text-white">{participants.length}</dd>
              <dt className="text-on-surface-variant">Format</dt>
              <dd className="text-white">{tournament.format}</dd>
              <dt className="text-on-surface-variant">Game</dt>
              <dd className="text-white">{tournament.game}</dd>
              <dt className="text-on-surface-variant">Start Time</dt>
              <dd className="text-white">{formatDateTime(tournament.startTime)}</dd>
            </dl>

            <div className="mt-6 rounded-full bg-surface-bright px-7 py-4 text-lg leading-tight lg:mt-0">
              <p className="text-on-surface">Organized by</p>
              <p className="mt-1 text-tertiary">{tournament.organizer}</p>
            </div>
          </div>

          <div className="mt-10 space-y-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <h2 className="font-display text-3xl font-bold italic tracking-tight text-white md:text-4xl">
                {showBracketTab ? "Bracket Preview" : "Manage Participants"}
              </h2>
              <div className="flex flex-wrap gap-3">
                {showBracketTab ? (
                  <button
                    type="button"
                    onClick={() => setIsBracketFullscreen(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-bright px-5 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-container-highest"
                  >
                    <Maximize2 size={16} /> Fullscreen
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={handleShuffleSeeds}
                  className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-bright px-5 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-container-highest"
                >
                  <Shuffle size={16} /> Shuffle Seeds
                </button>
                <button
                  type="button"
                  onClick={handleBulkAdd}
                  className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-bright px-5 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-container-highest"
                >
                  <ClipboardList size={16} /> Bulk Add
                </button>
              </div>
            </div>

            {showBracketTab ? (
              rounds.length > 0 ? (
                <BracketView rounds={rounds} />
              ) : (
                <div className="rounded-2xl border border-outline-variant bg-surface-container-low/85 p-8">
                  <p className="text-base text-on-surface md:text-lg">Add at least 2 participants to generate bracket.</p>
                </div>
              )
            ) : showParticipantsTab ? (
              <>
                <div className="rounded-2xl border border-outline-variant bg-surface-container-low/85 p-8">
                  {participants.length === 0 ? (
                    <p className="text-base text-on-surface md:text-lg">
                      No participants yet. Add participants to start generating brackets.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {participants.map((name, index) => (
                        <div
                          key={`${name}-${index}`}
                          className="flex items-center justify-between rounded-lg border border-outline-variant bg-surface-container-high/40 px-4 py-2"
                        >
                          <span className="text-on-surface">#{index + 1} Seed</span>
                          <strong className="text-on-surface">{name}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <form onSubmit={handleAddParticipant} className="rounded-2xl border border-outline-variant bg-surface-container-low/90 p-5">
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-on-surface-variant">
                    Add Participant (auto-seed by order)
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      value={newParticipant}
                      onChange={(event) => setNewParticipant(event.target.value)}
                      placeholder="Enter participant name"
                      className="flex-1 rounded-lg border border-outline-variant bg-surface px-4 py-2.5 text-sm text-on-surface outline-none placeholder:text-on-surface-variant/70 focus:border-primary-container"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-tertiary-container px-7 py-3 text-base font-bold italic text-white hover:bg-tertiary"
                    >
                      <Plus size={18} /> Add Participant
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="rounded-2xl border border-outline-variant bg-surface-container-low/85 p-8">
                <p className="text-base text-on-surface md:text-lg">
                  This section is mock for now. Use Participants tab to add seeded players and Bracket tab to preview generated bracket.
                </p>
              </div>
            )}

            <div className="rounded-xl border border-outline-variant bg-surface/75 p-5 text-sm text-on-surface-variant">
              <p className="inline-flex items-center gap-2">
                <Swords size={16} className="text-primary-fixed-dim" />
                Seed is assigned by participant add order and bracket is generated automatically from that seed order.
              </p>
            </div>
          </div>
        </section>
      </div>

      {isBracketFullscreen && showBracketTab ? (
        <div className="fixed inset-0 z-50 bg-surface">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low px-4 py-3 md:px-6">
              <div>
                <p className="text-lg font-semibold text-white">Bracket Fullscreen</p>
                <p className="text-xs text-on-surface-variant">Press Esc to close</p>
              </div>
              <button
                type="button"
                onClick={() => setIsBracketFullscreen(false)}
                className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-high/60 px-3 py-2 text-sm font-medium text-on-surface hover:bg-surface-bright"
              >
                <X size={16} /> Close
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-auto bg-tournament-shell">
              {rounds.length > 0 ? (
                <BracketView rounds={rounds} fullscreen />
              ) : (
                <div className="mx-4 mt-6 rounded-2xl border border-outline-variant bg-surface-container-low/85 p-8 md:mx-6">
                  <p className="text-base text-on-surface md:text-lg">Add at least 2 participants to generate bracket.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default TournamentDetailPage;
