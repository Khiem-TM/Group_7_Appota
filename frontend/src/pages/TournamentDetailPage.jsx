import { ChevronLeft, Maximize2, Share2, Swords, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { listAnnouncements } from "../api/announcements";
import { getTournament, getTournamentMatches, getTournamentStandings, matchesToBracketRounds, toDisplayFormat } from "../api/tournaments";
import BracketView from "../components/tournaments/BracketView";

const tabs = [
  { key: "bracket", label: "Bracket" },
  { key: "standings", label: "Standings" },
  { key: "announcements", label: "Announcements" },
  { key: "participants", label: "Participants" }
];

function formatDateTime(value) {
  if (!value) return "TBD";
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

const WS_BASE = (import.meta.env.VITE_WS_BASE_URL || "ws://localhost:8000");

function TournamentDetailPage() {
  const { id, tab } = useParams();
  const navigate = useNavigate();
  const [isBracketFullscreen, setIsBracketFullscreen] = useState(false);
  const activeTab = tabs.some((item) => item.key === tab) ? tab : "bracket";

  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const wsRef = useRef(null);

  useEffect(() => {
    if (!tab || !tabs.some((item) => item.key === tab)) {
      navigate(`/app/tournaments/${id}/bracket`, { replace: true });
    }
  }, [id, navigate, tab]);

  useEffect(() => {
    if (!id) return;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [t, m] = await Promise.all([
          getTournament(id),
          getTournamentMatches(id)
        ]);
        setTournament(t);
        setMatches(m);
      } catch {
        setError("Tournament not found.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  useEffect(() => {
    if (!id || activeTab !== "standings") return;
    getTournamentStandings(id).then(setStandings).catch(() => {});
  }, [id, activeTab]);

  useEffect(() => {
    if (!id || activeTab !== "announcements") return;
    listAnnouncements(id).then(setAnnouncements).catch(() => {});
  }, [id, activeTab]);

  // WebSocket for real-time updates
  useEffect(() => {
    if (!id) return;
    const ws = new WebSocket(`${WS_BASE}/ws/tournament/${id}`);
    let closeWhenOpen = false;
    wsRef.current = ws;

    ws.onopen = () => {
      if (closeWhenOpen) ws.close();
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "MATCH_UPDATE") {
          getTournamentMatches(id).then(setMatches).catch(() => {});
        } else if (msg.type === "STANDINGS_UPDATE") {
          getTournamentStandings(id).then(setStandings).catch(() => {});
        } else if (msg.type === "ANNOUNCEMENT") {
          setAnnouncements((prev) => [
            { id: Date.now(), title: msg.title, content: msg.content, created_at: new Date().toISOString() },
            ...prev
          ]);
        }
      } catch {}
    };

    const ping = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.send("ping");
    }, 30000);

    return () => {
      clearInterval(ping);
      if (ws.readyState === WebSocket.CONNECTING) {
        closeWhenOpen = true;
      } else {
        ws.close();
      }
    };
  }, [id]);

  useEffect(() => {
    if (!isBracketFullscreen) return;
    const onKeyDown = (e) => { if (e.key === "Escape") setIsBracketFullscreen(false); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isBracketFullscreen]);

  const rounds = useMemo(() => matchesToBracketRounds(matches), [matches]);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-on-surface-variant">
        Loading tournament…
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-400">
        {error || "Tournament not found."}
      </div>
    );
  }

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
                {item.key === "announcements" ? `Announcements (${announcements.length})` : item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="px-6 py-8 lg:px-12 lg:py-10">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="font-display text-3xl font-bold italic tracking-tight text-white md:text-4xl">
              {tournament.name}
            </h1>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
              className="inline-flex items-center justify-center rounded-full border border-outline-variant bg-surface-container-highest px-6 py-3 text-on-surface hover:bg-surface-bright"
            >
              <Share2 size={18} />
            </button>
          </div>

          <div className="mt-5 h-1 w-28 bg-tertiary-container" />

          <div className="mt-8 rounded-2xl border border-outline-variant bg-surface-container-low/90 p-8 lg:flex lg:items-start lg:justify-between lg:gap-8">
            <dl className="grid grid-cols-[105px_1fr] gap-x-6 gap-y-3 text-base leading-tight md:grid-cols-[120px_1fr] md:text-xl">
              <dt className="text-on-surface-variant">Players</dt>
              <dd className="text-white">{tournament.participant_count}/{tournament.max_players}</dd>
              <dt className="text-on-surface-variant">Format</dt>
              <dd className="text-white">{toDisplayFormat(tournament.format)}</dd>
              <dt className="text-on-surface-variant">Game</dt>
              <dd className="text-white">{tournament.game || "—"}</dd>
              <dt className="text-on-surface-variant">Start</dt>
              <dd className="text-white">{formatDateTime(tournament.start_date)}</dd>
              <dt className="text-on-surface-variant">Status</dt>
              <dd className="text-white capitalize">{tournament.status?.replace(/_/g, " ")}</dd>
            </dl>

            <div className="mt-6 flex flex-col gap-2 lg:mt-0">
              <Link
                to={`/app/tournaments/${id}/manage`}
                className="inline-flex items-center justify-center rounded-full bg-tertiary-container px-6 py-2.5 text-sm font-semibold text-white hover:bg-tertiary"
              >
                Manage
              </Link>
            </div>
          </div>

          <div className="mt-10 space-y-8">
            {activeTab === "bracket" ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h2 className="font-display text-3xl font-bold italic tracking-tight text-white md:text-4xl">
                    Bracket
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setIsBracketFullscreen(true)}
                      className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-bright px-5 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-container-highest"
                    >
                      <Maximize2 size={16} /> Fullscreen
                    </button>
                  </div>
                </div>
                {rounds.length > 0 ? (
                  <BracketView rounds={rounds} />
                ) : (
                  <div className="rounded-2xl border border-outline-variant bg-surface-container-low/85 p-8">
                    <p className="inline-flex items-center gap-2 text-base text-on-surface md:text-lg">
                      <Swords size={16} className="text-primary-fixed-dim" />
                      No bracket generated yet. Generate it from the Manage page.
                    </p>
                  </div>
                )}
              </>
            ) : activeTab === "standings" ? (
              <>
                <h2 className="font-display text-3xl font-bold italic tracking-tight text-white">Standings</h2>
                {standings.length === 0 ? (
                  <div className="rounded-2xl border border-outline-variant bg-surface-container-low/85 p-8">
                    <p className="text-on-surface">No standings yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-outline-variant">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-outline-variant bg-surface-container-highest text-on-surface-variant">
                          <th className="px-4 py-3 text-left">Rank</th>
                          <th className="px-4 py-3 text-left">Player</th>
                          <th className="px-4 py-3 text-right">W</th>
                          <th className="px-4 py-3 text-right">L</th>
                          <th className="px-4 py-3 text-right">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {standings.map((s) => (
                          <tr key={s.id} className="border-b border-outline-variant/40 bg-surface-container-low/70">
                            <td className="px-4 py-3 font-semibold text-white">#{s.rank}</td>
                            <td className="px-4 py-3 text-white">{s.username || `Player #${s.participant_id}`}</td>
                            <td className="px-4 py-3 text-right text-emerald-400">{s.wins}</td>
                            <td className="px-4 py-3 text-right text-red-400">{s.losses}</td>
                            <td className="px-4 py-3 text-right font-semibold text-white">{s.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : activeTab === "announcements" ? (
              <>
                <h2 className="font-display text-3xl font-bold italic tracking-tight text-white">Announcements</h2>
                {announcements.length === 0 ? (
                  <div className="rounded-2xl border border-outline-variant bg-surface-container-low/85 p-8">
                    <p className="text-on-surface">No announcements yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {announcements.map((a) => (
                      <article key={a.id} className="rounded-2xl border border-outline-variant bg-surface-container-low/85 p-6">
                        <h3 className="text-lg font-semibold text-white">{a.title}</h3>
                        <p className="mt-2 text-sm text-on-surface-variant">{a.content}</p>
                        <p className="mt-3 text-xs text-on-surface-variant/60">
                          {a.author_username ? `By ${a.author_username} • ` : ""}
                          {new Date(a.created_at).toLocaleString()}
                        </p>
                      </article>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-outline-variant bg-surface-container-low/85 p-8">
                <p className="text-on-surface">
                  Use the Manage page to add participants and generate the bracket.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {isBracketFullscreen && activeTab === "bracket" ? (
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
                  <p className="text-base text-on-surface md:text-lg">No bracket generated yet.</p>
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
