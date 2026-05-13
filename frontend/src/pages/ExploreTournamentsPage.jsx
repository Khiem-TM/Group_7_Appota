import { useEffect, useMemo, useState } from "react";
import { searchTournaments } from "../api/explore";
import { toDisplayFormat, toDisplayStatus } from "../api/tournaments";
import EmptyState from "../components/common/EmptyState";
import TournamentCard from "../components/tournaments/TournamentCard";

function ExploreTournamentsPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await searchTournaments(debouncedQuery);
        setTournaments(data);
      } catch {
        setError("Failed to load tournaments.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [debouncedQuery]);

  const mapped = useMemo(
    () =>
      tournaments.map((t) => ({
        id: t.id,
        name: t.name,
        game: t.game || "Unknown",
        format: toDisplayFormat(t.format),
        status: toDisplayStatus(t.status),
        participants: t.participant_count,
        maxParticipants: t.max_players,
        prizePool: t.prize_pool || null,
        startDate: t.start_date || "TBD",
        organizer: `Host #${t.host_id}`,
        region: "",
        description: t.description || ""
      })),
    [tournaments]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title">Explore Tournaments</h2>
        <p className="page-subtitle">Discover active and upcoming brackets.</p>
      </div>

      <div className="soft-panel p-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, game, or format"
          className="w-full rounded-xl border border-outline-variant bg-surface-container-low/70 px-3 py-2 text-sm outline-none focus:border-primary-container"
        />
      </div>

      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center text-on-surface-variant">
          Loading…
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>
      ) : mapped.length === 0 ? (
        <EmptyState title="No tournaments found" description="Try a different keyword." />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mapped.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </section>
      )}
    </div>
  );
}

export default ExploreTournamentsPage;
