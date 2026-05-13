import { useMemo, useState } from "react";
import EmptyState from "../components/common/EmptyState";
import TournamentCard from "../components/tournaments/TournamentCard";
import { tournaments } from "../data/mockData";

function ExploreTournamentsPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return tournaments.filter((tournament) => {
      const text = `${tournament.name} ${tournament.game} ${tournament.region}`.toLowerCase();
      return text.includes(query.toLowerCase());
    });
  }, [query]);

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
          placeholder="Search by name, game, or region"
          className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm outline-none focus:border-cyan-400"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No tournaments found" description="Try a different keyword." />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((tournament) => (
            <TournamentCard key={tournament.id} tournament={tournament} />
          ))}
        </section>
      )}
    </div>
  );
}

export default ExploreTournamentsPage;
