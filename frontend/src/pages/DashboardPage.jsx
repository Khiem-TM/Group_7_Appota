import { Search, Swords } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const statusTabs = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "in_progress", label: "In Progress" },
  { key: "complete", label: "Complete" }
];

const mockMyTournaments = [
  {
    id: "nebula-open",
    name: "Nebula Open",
    game: "Valorant",
    status: "in_progress",
    participants: 64,
    maxParticipants: 64,
    date: "May 20, 2026"
  },
  {
    id: "weekend-clash",
    name: "Weekend Clash",
    game: "CS2",
    status: "pending",
    participants: 18,
    maxParticipants: 32,
    date: "May 25, 2026"
  },
  {
    id: "spring-showdown",
    name: "Spring Showdown",
    game: "League of Legends",
    status: "complete",
    participants: 32,
    maxParticipants: 32,
    date: "Apr 30, 2026"
  }
];

const statusClassMap = {
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  in_progress: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  complete: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
};

const statusLabelMap = {
  pending: "Pending",
  in_progress: "In Progress",
  complete: "Complete"
};

function DashboardPage() {
  const [query, setQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");

  const filteredTournaments = useMemo(() => {
    return mockMyTournaments.filter((tournament) => {
      const matchesStatus = activeStatus === "all" ? true : tournament.status === activeStatus;
      const matchesQuery = `${tournament.name} ${tournament.game}`
        .toLowerCase()
        .includes(query.toLowerCase().trim());

      return matchesStatus && matchesQuery;
    });
  }, [activeStatus, query]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="font-display text-4xl font-semibold text-white">Your Tournaments</h1>
        <Link
          to="/app/tournaments/new"
          className="inline-flex items-center justify-center rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-400"
        >
          Create a Tournament
        </Link>
      </div>

      <div className="max-w-lg rounded-xl border border-slate-800 bg-slate-900 px-3 py-2">
        <div className="flex items-center gap-2">
          <Search size={16} className="text-slate-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search your tournaments"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="border-b border-slate-800">
        <div className="flex flex-wrap gap-2 pb-2">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveStatus(tab.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                activeStatus === tab.key
                  ? "bg-orange-500/20 text-orange-300"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filteredTournaments.length === 0 ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/70">
          <div className="text-center">
            <div className="mx-auto mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-400">
              <Swords size={18} />
            </div>
            <h2 className="text-3xl font-semibold text-white">No Tournaments Found</h2>
            <p className="mt-2 text-sm text-slate-400">You don&apos;t have any tournaments matching this criteria.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredTournaments.map((tournament) => (
            <article key={tournament.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-semibold text-white">{tournament.name}</h2>
                  <p className="mt-1 text-sm text-slate-400">{tournament.game} • {tournament.date}</p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClassMap[tournament.status]}`}
                >
                  {statusLabelMap[tournament.status]}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
                <span>Players: {tournament.participants}/{tournament.maxParticipants}</span>
                <Link to={`/app/tournaments/${tournament.id}`} className="text-cyan-400 hover:text-cyan-300">
                  View Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
