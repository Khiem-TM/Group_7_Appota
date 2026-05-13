import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { createAnnouncement, listAnnouncements } from "../api/announcements";
import { reportMatch } from "../api/matches";
import {
  addParticipant,
  generateBracket,
  getTournament,
  getTournamentMatches,
  getTournamentStandings,
  publishTournament,
  startTournament,
  toDisplayFormat
} from "../api/tournaments";
import ConfirmModal from "../components/common/ConfirmModal";
import EmptyState from "../components/common/EmptyState";
import BracketView from "../components/tournaments/BracketView";

function ReportMatchModal({ match, onClose, onReported }) {
  const [score1, setScore1] = useState("");
  const [score2, setScore2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await reportMatch(match.id, Number(score1), Number(score2));
      onReported();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to report match.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-outline-variant bg-surface-container-low p-6">
        <h3 className="text-lg font-semibold text-white">Report Match #{match.id}</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-on-surface-variant">Player 1 Score</label>
              <input
                type="number"
                min="0"
                required
                value={score1}
                onChange={(e) => setScore1(e.target.value)}
                className="mt-1 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-on-surface-variant">Player 2 Score</label>
              <input
                type="number"
                min="0"
                required
                value={score2}
                onChange={(e) => setScore2(e.target.value)}
                className="mt-1 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-white outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-outline-variant py-2.5 text-sm text-on-surface-variant hover:text-white">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 rounded-xl bg-tertiary-container py-2.5 text-sm font-semibold text-white disabled:opacity-60">
              {loading ? "Saving…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ManageTournamentPage() {
  const { id } = useParams();

  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [standings, setStandings] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [reportingMatch, setReportingMatch] = useState(null);

  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annLoading, setAnnLoading] = useState(false);
  const [participantName, setParticipantName] = useState("");
  const [participantLoading, setParticipantLoading] = useState(false);

  async function reload() {
    try {
      const [t, m, s, a] = await Promise.all([
        getTournament(id),
        getTournamentMatches(id),
        getTournamentStandings(id),
        listAnnouncements(id)
      ]);
      setTournament(t);
      setMatches(m);
      setStandings(s);
      setAnnouncements(a);
    } catch {}
  }

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");
    async function load() {
      try {
        const [t, m, s, a] = await Promise.all([
          getTournament(id),
          getTournamentMatches(id),
          getTournamentStandings(id),
          listAnnouncements(id)
        ]);
        setTournament(t);
        setMatches(m);
        setStandings(s);
        setAnnouncements(a);
      } catch {
        setError("Tournament not found.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleAction = async (action) => {
    setActionError("");
    try {
      if (action === "publish") {
        await publishTournament(id);
      } else if (action === "start") {
        await startTournament(id);
      } else if (action === "bracket") {
        await generateBracket(id);
      }
      await reload();
    } catch (err) {
      setActionError(err.response?.data?.detail || `Failed to ${action}.`);
    }
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    setAnnLoading(true);
    try {
      const ann = await createAnnouncement(id, annTitle, annContent);
      setAnnouncements((prev) => [ann, ...prev]);
      setAnnTitle("");
      setAnnContent("");
    } catch (err) {
      setActionError(err.response?.data?.detail || "Failed to post announcement.");
    } finally {
      setAnnLoading(false);
    }
  };

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    const trimmedName = participantName.trim();
    if (!trimmedName) return;
    setActionError("");
    setParticipantLoading(true);
    try {
      await addParticipant(id, trimmedName);
      setParticipantName("");
      await reload();
    } catch (err) {
      setActionError(err.response?.data?.detail || "Failed to add participant.");
    } finally {
      setParticipantLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-on-surface-variant">
        Loading…
      </div>
    );
  }

  if (error || !tournament) {
    return <EmptyState title="Tournament not found" description="Try selecting another event." />;
  }

  const scheduledMatches = matches.filter((m) => m.status === "SCHEDULED" || m.status === "ONGOING");

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="page-title">Manage: {tournament.name}</h2>
          <p className="page-subtitle">
            {toDisplayFormat(tournament.format)} • Status: {tournament.status?.replace(/_/g, " ")}
          </p>
        </div>

        {actionError ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {actionError}
          </div>
        ) : null}

        <section className="grid gap-4 md:grid-cols-3">
          {tournament.status === "DRAFT" ? (
            <button
              type="button"
              onClick={() => setConfirmAction("publish")}
              className="rounded-xl bg-primary-container px-4 py-3 font-semibold text-on-primary hover:bg-primary"
            >
              Open Registration
            </button>
          ) : null}
          {tournament.status === "REGISTRATION_OPEN" ? (
            <button
              type="button"
              onClick={() => setConfirmAction("start")}
              className="rounded-xl bg-primary-container px-4 py-3 font-semibold text-on-primary hover:bg-primary"
            >
              Start Tournament
            </button>
          ) : null}
          {(tournament.status === "REGISTRATION_OPEN" || tournament.status === "SEEDING") && !tournament.bracket_generated ? (
            <button
              type="button"
              onClick={() => setConfirmAction("bracket")}
              className="rounded-xl border border-outline-variant px-4 py-3 text-on-surface hover:border-primary-container"
            >
              Generate Bracket
            </button>
          ) : null}
        </section>

        {["DRAFT", "REGISTRATION_OPEN", "SEEDING"].includes(tournament.status) ? (
          <section className="rounded-xl border border-outline-variant bg-surface-container-low p-5">
            <h3 className="font-display text-xl text-white">Add Participant</h3>
            <form onSubmit={handleAddParticipant} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="Participant name"
                className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-white outline-none focus:border-primary-container"
              />
              <button
                type="submit"
                disabled={participantLoading || !participantName.trim()}
                className="rounded-xl bg-primary-container px-4 py-2.5 text-sm font-semibold text-on-primary hover:bg-primary disabled:opacity-60"
              >
                {participantLoading ? "Adding..." : "Add"}
              </button>
            </form>
          </section>
        ) : null}

        {matches.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-display text-xl text-white">Bracket</h3>
            <BracketView
              rounds={(() => {
                const roundMap = new Map();
                for (const m of matches) {
                  const r = m.round ?? 1;
                  if (!roundMap.has(r)) roundMap.set(r, []);
                  roundMap.get(r).push({
                    id: m.id,
                    teamA: m.player1_id ? `P#${m.player1_id}` : "TBD",
                    teamB: m.player2_id ? `P#${m.player2_id}` : "TBD",
                    scoreA: m.score_player1 ?? 0,
                    scoreB: m.score_player2 ?? 0,
                    status: m.status === "COMPLETED" || m.status === "VERIFIED" ? "finished" : "upcoming"
                  });
                }
                const sorted = [...roundMap.entries()].sort(([a], [b]) => a - b);
                const total = sorted.length;
                return sorted.map(([roundNum, rMatches], idx) => {
                  const rem = total - idx;
                  const name = rem === 1 ? "Final" : rem === 2 ? "Semifinals" : rem === 3 ? "Quarterfinals" : `Round ${roundNum}`;
                  return { name, matches: rMatches };
                });
              })()}
            />
          </div>
        ) : null}

        {tournament.status === "ONGOING" && scheduledMatches.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-display text-xl text-white">Report Match Results</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {scheduledMatches.map((m) => (
                <div key={m.id} className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
                  <p className="text-sm text-on-surface-variant">
                    Round {m.round} · Match #{m.match_number}
                  </p>
                  <p className="mt-1 text-white">
                    Player #{m.player1_id || "TBD"} vs Player #{m.player2_id || "TBD"}
                  </p>
                  <button
                    type="button"
                    onClick={() => setReportingMatch(m)}
                    className="mt-3 rounded-lg bg-surface-bright px-4 py-1.5 text-xs font-semibold text-on-surface hover:bg-surface-container-highest"
                  >
                    Report Score
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="space-y-4">
          <h3 className="font-display text-xl text-white">Post Announcement</h3>
          <form onSubmit={handlePostAnnouncement} className="rounded-xl border border-outline-variant bg-surface-container-low p-5 space-y-3">
            <input
              value={annTitle}
              onChange={(e) => setAnnTitle(e.target.value)}
              placeholder="Title"
              className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-white outline-none focus:border-primary-container"
            />
            <textarea
              rows={3}
              value={annContent}
              onChange={(e) => setAnnContent(e.target.value)}
              placeholder="Announcement content…"
              className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-white outline-none focus:border-primary-container"
            />
            <button
              type="submit"
              disabled={annLoading}
              className="inline-flex items-center gap-2 rounded-full bg-tertiary-container px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              <Send size={14} />
              {annLoading ? "Posting…" : "Post"}
            </button>
          </form>

          {announcements.length > 0 ? (
            <div className="space-y-3">
              {announcements.map((a) => (
                <article key={a.id} className="rounded-xl border border-outline-variant bg-surface-container-low/70 p-4">
                  <p className="font-semibold text-white">{a.title}</p>
                  <p className="mt-1 text-sm text-on-surface-variant">{a.content}</p>
                  <p className="mt-2 text-xs text-on-surface-variant/60">
                    {new Date(a.created_at).toLocaleString()}
                  </p>
                </article>
              ))}
            </div>
          ) : null}
        </div>

        {standings.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-display text-xl text-white">Standings</h3>
            <div className="overflow-x-auto rounded-xl border border-outline-variant">
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
                    <tr key={s.id} className="border-b border-outline-variant/40">
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
          </div>
        ) : null}
      </div>

      <ConfirmModal
        open={!!confirmAction}
        title={
          confirmAction === "publish" ? "Open registration?" :
          confirmAction === "start" ? "Start tournament?" :
          "Generate bracket?"
        }
        description={
          confirmAction === "publish" ? "This will allow players to join the tournament." :
          confirmAction === "start" ? "This will mark the tournament as ONGOING. Make sure the bracket is generated first." :
          "This will generate the bracket from current participants."
        }
        onCancel={() => setConfirmAction(null)}
        onConfirm={() => {
          const action = confirmAction;
          setConfirmAction(null);
          handleAction(action);
        }}
      />

      {reportingMatch ? (
        <ReportMatchModal
          match={reportingMatch}
          onClose={() => setReportingMatch(null)}
          onReported={reload}
        />
      ) : null}
    </>
  );
}

export default ManageTournamentPage;
