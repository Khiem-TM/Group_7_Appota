import { Search, Swords } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listTournaments, toDisplayStatus } from "../api/tournaments";
import { useAuth } from "../contexts/AuthContext";

const statusTabs = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "in_progress", label: "In Progress" },
  { key: "complete", label: "Complete" }
];

const statusClassMap = {
  pending: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  in_progress: "bg-primary-container/15 text-primary-fixed border-primary-container/30",
  complete: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
};

const statusLabelMap = {
  pending: "Pending",
  in_progress: "In Progress",
  complete: "Complete"
};

function DashboardPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await listTournaments(1, 100);
        const myTournaments = user
          ? data.filter((t) => t.host_id === user.id)
          : data;
        setTournaments(myTournaments);
      } catch {
        setError("Failed to load tournaments.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const filteredTournaments = useMemo(() => {
    return tournaments.filter((t) => {
      const displayStatus = toDisplayStatus(t.status);
      const matchesStatus = activeStatus === "all" || displayStatus === activeStatus;
      const matchesQuery = `${t.name} ${t.game || ""}`
        .toLowerCase()
        .includes(query.toLowerCase().trim());
      return matchesStatus && matchesQuery;
    });
  }, [tournaments, activeStatus, query]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="font-display text-4xl font-semibold text-white">Your Tournaments</h1>
        <Link
          to="/app/tournaments/new"
          className="inline-flex items-center justify-center rounded-xl bg-tertiary-container px-5 py-2.5 text-sm font-semibold text-white hover:bg-tertiary"
        >
          Create a Tournament
        </Link>
      </div>

      <div className="max-w-lg rounded-xl border border-outline-variant bg-surface-container-low px-3 py-2">
        <div className="flex items-center gap-2">
          <Search size={16} className="text-on-surface-variant/80" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search your tournaments"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-on-surface-variant/80"
          />
        </div>
      </div>

      <div className="border-b border-outline-variant">
        <div className="flex flex-wrap gap-2 pb-2">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveStatus(tab.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                activeStatus === tab.key
                  ? "bg-tertiary-container/20 text-tertiary"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center text-on-surface-variant">
          Loading tournaments…
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>
      ) : filteredTournaments.length === 0 ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-outline-variant bg-surface-container-low/70">
          <div className="text-center">
            <div className="mx-auto mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-highest text-on-surface-variant">
              <Swords size={18} />
            </div>
            <h2 className="text-3xl font-semibold text-white">No Tournaments Found</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              {tournaments.length === 0
                ? "You haven't created any tournaments yet."
                : "No tournaments match this criteria."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredTournaments.map((t) => {
            const displayStatus = toDisplayStatus(t.status);
            return (
              <article key={t.id} className="rounded-2xl border border-outline-variant bg-surface-container-low p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{t.name}</h2>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      {t.game || "No game"} • {t.start_date || "TBD"}
                    </p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClassMap[displayStatus]}`}>
                    {statusLabelMap[displayStatus]}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-on-surface-variant">
                  <span>
                    Players: {t.participant_count}/{t.max_players}
                  </span>
                  <div className="flex gap-3">
                    <Link
                      to={`/app/tournaments/${t.id}/manage`}
                      className="text-amber-400 hover:text-amber-300"
                    >
                      Manage
                    </Link>
                    <Link
                      to={`/app/tournaments/${t.id}`}
                      className="text-primary-fixed-dim hover:text-primary-fixed"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
