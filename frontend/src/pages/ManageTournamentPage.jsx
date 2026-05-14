import { ArrowLeft, CheckCircle2, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createAnnouncement, listAnnouncements } from "../api/announcements";
import { reportMatch } from "../api/matches";
import {
  addParticipant,
  generateBracket,
  getTournament,
  getTournamentMatches,
  getTournamentStandings,
  matchesToBracketViews,
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
    if (Number(score1) === Number(score2)) {
      setError("Scores must produce one winner.");
      return;
    }
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

  const player1Name = match.player1_name ?? (match.player1_id ? `Player #${match.player1_id}` : "TBD");
  const player2Name = match.player2_name ?? (match.player2_id ? `Player #${match.player2_id}` : "TBD");
  const winnerName = score1 !== "" && score2 !== "" && Number(score1) !== Number(score2)
    ? Number(score1) > Number(score2) ? player1Name : player2Name
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-2xl border border-outline-variant bg-surface-container-low p-6">
        <h3 className="text-lg font-semibold text-white">Report Match #{match.id}</h3>
        <p className="mt-1 text-sm text-on-surface-variant">
          {player1Name} vs {player2Name}
        </p>
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
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setScore1("1"); setScore2("0"); }}
              className="rounded-lg border border-outline-variant px-3 py-2 text-xs font-semibold text-on-surface hover:border-emerald-400 hover:text-emerald-300"
            >
              {player1Name} Win
            </button>
            <button
              type="button"
              onClick={() => { setScore1("0"); setScore2("1"); }}
              className="rounded-lg border border-outline-variant px-3 py-2 text-xs font-semibold text-on-surface hover:border-emerald-400 hover:text-emerald-300"
            >
              {player2Name} Win
            </button>
          </div>
          {winnerName ? (
            <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300">
              Winner: {winnerName}
            </p>
          ) : null}
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
  const navigate = useNavigate();

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

  const playableMatches = matches.filter((m) => m.player1_id && m.player2_id);
  const bracketViews = matchesToBracketViews(matches, tournament.format);
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(`/app/tournaments/${id}`);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <button
            type="button"
            onClick={handleBack}
            className="mb-3 inline-flex items-center gap-2 rounded-lg border border-outline-variant px-3 py-1.5 text-sm text-on-surface-variant hover:text-white"
          >
            <ArrowLeft size={15} />
            Back
          </button>
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
          {["DRAFT", "REGISTRATION_OPEN", "SEEDING"].includes(tournament.status) ? (
            <button
              type="button"
              onClick={() => setConfirmAction("start")}
              disabled={!tournament.bracket_generated}
              className="rounded-xl bg-primary-container px-4 py-3 font-semibold text-on-primary hover:bg-primary"
            >
              {tournament.bracket_generated ? "Start Tournament" : "Generate Bracket First"}
            </button>
          ) : null}
          {["DRAFT", "REGISTRATION_OPEN", "SEEDING"].includes(tournament.status) ? (
            <button
              type="button"
              disabled={tournament.bracket_generated}
              onClick={() => setConfirmAction("bracket")}
              className="rounded-xl border border-outline-variant px-4 py-3 text-on-surface hover:border-primary-container disabled:cursor-not-allowed disabled:border-emerald-500/30 disabled:bg-emerald-500/10 disabled:text-emerald-300"
            >
              {tournament.bracket_generated ? "Bracket Generated" : "Generate Bracket"}
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
            <div className="space-y-6">
              {bracketViews.map((view) => (
                <div key={view.key} className="space-y-3">
                  {view.title !== "Bracket" ? (
                    <h4 className="text-base font-semibold text-white">{view.title}</h4>
                  ) : null}
                  <BracketView rounds={view.rounds} />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {matches.length > 0 ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-xl text-white">Match Results</h3>
              {tournament.status !== "ONGOING" ? (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  Start tournament to report scores
                </span>
              ) : null}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {playableMatches.map((m) => {
                const player1 = m.player1_name ?? (m.player1_id ? `Player #${m.player1_id}` : "TBD");
                const player2 = m.player2_name ?? (m.player2_id ? `Player #${m.player2_id}` : "TBD");
                const isFinished = m.status === "COMPLETED" || m.status === "VERIFIED";
                const player1Won = isFinished && m.winner_id === m.player1_id;
                const player2Won = isFinished && m.winner_id === m.player2_id;
                const canReport = tournament.status === "ONGOING" && m.status === "READY";
                return (
                <div key={m.id} className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-on-surface-variant">
                      Round {m.round} · Match #{m.match_number}
                    </p>
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      isFinished ? "bg-emerald-500/10 text-emerald-300" :
                      m.status === "READY" ? "bg-primary-container/30 text-primary-fixed-dim" :
                      "bg-surface-bright text-on-surface-variant"
                    }`}>
                      {isFinished ? "Completed" : m.status}
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                      player1Won ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" : "border-outline-variant text-white"
                    }`}>
                      <span>{player1}</span>
                      <span className="font-mono">{m.score_player1 ?? "-"}</span>
                      {player1Won ? <CheckCircle2 size={16} /> : null}
                    </div>
                    <div className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                      player2Won ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" : "border-outline-variant text-white"
                    }`}>
                      <span>{player2}</span>
                      <span className="font-mono">{m.score_player2 ?? "-"}</span>
                      {player2Won ? <CheckCircle2 size={16} /> : null}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={!canReport}
                    onClick={() => setReportingMatch(m)}
                    className="mt-3 rounded-lg bg-surface-bright px-4 py-1.5 text-xs font-semibold text-on-surface hover:bg-surface-container-highest disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isFinished ? "Score Submitted" : "Report Score"}
                  </button>
                </div>
                );
              })}
            </div>
            {playableMatches.length === 0 ? (
              <p className="rounded-xl border border-outline-variant bg-surface-container-low p-4 text-sm text-on-surface-variant">
                No playable matches yet.
              </p>
            ) : null}
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
