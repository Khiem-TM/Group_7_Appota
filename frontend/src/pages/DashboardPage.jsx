import AnnouncementPanel from "../components/announcements/AnnouncementPanel";
import StatCard from "../components/common/StatCard";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";
import { announcements, dashboardStats, leaderboard, upcomingMatches } from "../data/mockData";

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title">Dashboard</h2>
        <p className="page-subtitle">Monitor your tournaments, standings, and match flow.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="soft-panel p-4">
            <h3 className="font-display text-xl text-white">Upcoming Matches</h3>
            <div className="mt-3 space-y-2">
              {upcomingMatches.map((match) => (
                <div key={match.id} className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/70 p-3">
                  <div>
                    <p className="font-medium text-slate-100">{match.teamA} vs {match.teamB}</p>
                    <p className="text-xs text-slate-400">{match.stage}</p>
                  </div>
                  <p className="font-display text-xl text-cyan-300">{match.time}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 font-display text-xl text-white">Top Teams</h3>
            <LeaderboardTable rows={leaderboard} />
          </div>
        </div>
        <AnnouncementPanel items={announcements} />
      </section>
    </div>
  );
}

export default DashboardPage;
