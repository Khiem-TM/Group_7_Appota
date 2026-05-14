import {
  CircleHelp,
  Link2,
  List,
  ListOrdered,
  Trophy
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listGames } from "../api/games";
import { createTournament } from "../api/tournaments";

const sectionTitle = "mb-6 text-xs font-bold uppercase tracking-[0.16em] text-on-surface-variant";
const labelClass = "text-sm font-medium text-on-surface-variant md:pr-4 md:pt-2 md:text-right";
const fieldClass = "w-full rounded-md border border-outline-variant bg-surface-container-highest px-3 py-2.5 text-sm text-white placeholder:text-on-surface-variant/80 focus:border-tertiary-container focus:outline-none";

function CreateTournamentPage() {
  const navigate = useNavigate();
  const [tournamentName, setTournamentName] = useState("");
  const [description, setDescription] = useState("");
  const [games, setGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [customGame, setCustomGame] = useState("");
  const [format, setFormat] = useState("Single Elimination");
  const [maxPlayers, setMaxPlayers] = useState(16);
  const [startTime, setStartTime] = useState("");
  const [prizePool, setPrizePool] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    listGames().then(setGames).catch(() => {});
  }, []);

  const selectedGame = games.find((g) => g.id === selectedGameId) ?? null;

  const handleSaveAndContinue = async () => {
    if (!tournamentName.trim()) {
      setError("Tournament name is required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const gameName = selectedGame ? selectedGame.name : customGame || null;
      const tournament = await createTournament({
        name: tournamentName.trim(),
        description,
        format,
        game: gameName,
        game_id: selectedGameId || null,
        maxPlayers: Number(maxPlayers),
        startDate: startTime ? new Date(startTime).toISOString().slice(0, 10) : null,
        prizePool: prizePool || null
      });
      navigate(`/app/tournaments/${tournament.id}`);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Failed to create tournament.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-surface">
      <header className="sticky top-14 z-10 border-b border-outline-variant bg-surface/95 px-4 py-4 backdrop-blur md:px-8 lg:px-12">
        <h1 className="mx-auto w-full max-w-4xl font-display text-3xl font-semibold italic tracking-tight text-white">
          New Tournament
        </h1>
      </header>

      <div className="px-4 pb-32 pt-6 md:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl space-y-8">
          {error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          ) : null}

          <section className="rounded-xl border border-outline-variant bg-surface-container-low">
            <div className="p-6 md:p-8">
              <h2 className={sectionTitle}>Basic Info</h2>

              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <label className={`${labelClass} text-white`}>
                    Tournament name <span className="text-error">*</span>
                  </label>
                  <div className="md:col-span-3">
                    <input
                      className={`${fieldClass} border-tertiary-container/70 shadow-[0_0_0_1px_rgba(249,115,22,0.25)]`}
                      type="text"
                      value={tournamentName}
                      onChange={(event) => setTournamentName(event.target.value)}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <label className={labelClass}>Description</label>
                  <div className="space-y-2 md:col-span-3">
                    <div className="flex flex-wrap items-center gap-1 rounded-t-md border border-b-0 border-outline-variant bg-surface-bright px-2 py-2 text-on-surface-variant">
                      <button type="button" className="rounded px-2 py-1 text-xs hover:bg-surface-bright/80">Paragraph</button>
                      <button type="button" className="rounded px-2 py-1 text-xs font-bold hover:bg-surface-bright/80">B</button>
                      <button type="button" className="rounded px-2 py-1 text-xs italic hover:bg-surface-bright/80">I</button>
                      <button type="button" className="rounded px-2 py-1 text-xs line-through hover:bg-surface-bright/80">S</button>
                      <button type="button" className="rounded px-2 py-1 text-xs hover:bg-surface-bright/80"><List size={14} /></button>
                      <button type="button" className="rounded px-2 py-1 text-xs hover:bg-surface-bright/80"><ListOrdered size={14} /></button>
                      <button type="button" className="rounded px-2 py-1 text-xs hover:bg-surface-bright/80"><Link2 size={14} /></button>
                    </div>
                    <textarea
                      rows={6}
                      className={`${fieldClass} rounded-t-none`}
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-outline-variant bg-surface-container-low">
            <div className="p-6 md:p-8">
              <h2 className={sectionTitle}>Game Info</h2>

              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <label className={`${labelClass} text-white`}>
                    Game
                  </label>
                  <div className="space-y-4 md:col-span-3">
                    <p className="text-sm text-on-surface-variant">
                      Chọn game để giải đấu dễ được tìm kiếm hơn.
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {games.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setSelectedGameId(selectedGameId === g.id ? null : g.id)}
                          className={`relative overflow-hidden rounded-xl border transition-all ${
                            selectedGameId === g.id
                              ? "border-tertiary-container ring-2 ring-tertiary-container/50"
                              : "border-outline-variant hover:border-outline"
                          }`}
                        >
                          <img
                            src={g.thumbnail_url}
                            alt={g.name}
                            className="h-24 w-full object-cover"
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                          <div className="bg-surface-container-highest px-2 py-1.5">
                            <p className="truncate text-xs font-semibold text-white">{g.name}</p>
                            <p className="truncate text-[10px] text-on-surface-variant">{g.genre}</p>
                          </div>
                          {selectedGameId === g.id ? (
                            <span className="absolute right-1.5 top-1.5 rounded-full bg-tertiary-container px-1.5 py-0.5 text-[10px] font-bold text-white">
                              ✓
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                    {!selectedGameId ? (
                      <input
                        className={fieldClass}
                        placeholder="Hoặc nhập tên game tùy chỉnh..."
                        value={customGame}
                        onChange={(e) => setCustomGame(e.target.value)}
                        type="text"
                      />
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <label className={`${labelClass} text-white`}>
                    Format <span className="text-error">*</span>
                  </label>
                  <div className="space-y-3 md:col-span-3">
                    <select
                      className={fieldClass}
                      value={format}
                      onChange={(event) => setFormat(event.target.value)}
                    >
                      <option>Single Elimination</option>
                      <option>Double Elimination</option>
                      <option>Round Robin</option>
                      <option>Swiss</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <label className={labelClass}>Max Players</label>
                  <div className="md:col-span-3">
                    <select
                      className={fieldClass}
                      value={maxPlayers}
                      onChange={(e) => setMaxPlayers(e.target.value)}
                    >
                      {[4, 8, 16, 32, 64, 128].map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-outline-variant bg-surface-container-low">
            <div className="p-6 md:p-8">
              <h2 className={sectionTitle}>Details</h2>

              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <label className={`${labelClass} text-white`}>
                    Start Time <span className="text-error">*</span>
                  </label>
                  <div className="space-y-3 md:col-span-3">
                    <input
                      className={`${fieldClass} max-w-sm`}
                      type="datetime-local"
                      value={startTime}
                      onChange={(event) => setStartTime(event.target.value)}
                    />
                    <p className="text-sm text-on-surface-variant">
                      (GMT+07:00) Asia/Bangkok
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <label className={labelClass}>Prize Pool</label>
                  <div className="md:col-span-3">
                    <div className="flex items-center gap-2">
                      <input
                        className={`${fieldClass} max-w-xs`}
                        placeholder="e.g. $1,000"
                        value={prizePool}
                        onChange={(e) => setPrizePool(e.target.value)}
                      />
                      <p className="inline-flex items-center gap-1 text-xs text-on-surface-variant">
                        <CircleHelp size={12} /> Optional
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 border-t border-outline-variant bg-surface-container-low/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl justify-end">
          <button
            type="button"
            onClick={handleSaveAndContinue}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-tertiary-container px-8 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[0_8px_20px_rgba(249,115,22,0.35)] hover:bg-tertiary disabled:opacity-60"
          >
            <Trophy size={16} />
            {submitting ? "Creating…" : "Save and Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateTournamentPage;
