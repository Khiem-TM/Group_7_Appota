import { Link, useParams } from "react-router-dom";
import AnnouncementPanel from "../components/announcements/AnnouncementPanel";
import EmptyState from "../components/common/EmptyState";
import LeaderboardTable from "../components/leaderboard/LeaderboardTable";
import BracketView from "../components/tournaments/BracketView";
import FormatBadge from "../components/tournaments/FormatBadge";
import TournamentStatusBadge from "../components/tournaments/TournamentStatusBadge";
import { announcements, bracketRounds, leaderboard, tournaments } from "../data/mockData";

function TournamentDetailPage() {
  const { id } = useParams();
  const tournament = tournaments.find((item) => item.id === id);

  if (!tournament) {
    return <EmptyState title="Tournament not found" description="The requested tournament does not exist in mock data." />;
  }

  return (
    <div className="space-y-6">
      <section className="soft-panel overflow-hidden">
        <img src={tournament.banner} alt={tournament.name} className="h-56 w-full object-cover" />
        <div className="space-y-3 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <TournamentStatusBadge status={tournament.status} />
            <FormatBadge format={tournament.format} />
          </div>
          <h2 className="font-display text-3xl font-bold text-white">{tournament.name}</h2>
          <p className="text-slate-300">{tournament.description}</p>
          <p className="text-sm text-slate-400">Organizer: {tournament.organizer} • Prize: {tournament.prizePool}</p>
          <Link to={`/app/tournaments/${tournament.id}/manage`} className="inline-block rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950">
            Manage Tournament
          </Link>
        </div>
      </section>

      <div className="space-y-3">
        <h3 className="font-display text-2xl text-white">Bracket</h3>
        <BracketView rounds={bracketRounds} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          <h3 className="font-display text-2xl text-white">Leaderboard</h3>
          <LeaderboardTable rows={leaderboard} />
        </div>
        <AnnouncementPanel items={announcements} />
      </div>
    </div>
  );
}

export default TournamentDetailPage;
