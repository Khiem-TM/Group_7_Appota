import { CalendarDays, Users } from "lucide-react";
import { Link } from "react-router-dom";
import TournamentStatusBadge from "./TournamentStatusBadge";
import FormatBadge from "./FormatBadge";

function TournamentCard({ tournament }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-low/75 shadow-lg">
      <img src={tournament.banner} alt={tournament.name} className="h-36 w-full object-cover" />
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <TournamentStatusBadge status={tournament.status} />
          <FormatBadge format={tournament.format} />
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold text-white">{tournament.name}</h3>
          <p className="text-sm text-on-surface-variant">{tournament.game} • {tournament.region}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-on-surface-variant">
          <p className="flex items-center gap-1"><Users size={14} /> {tournament.participants}/{tournament.maxParticipants}</p>
          <p className="flex items-center gap-1"><CalendarDays size={14} /> {tournament.startDate}</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/app/tournaments/${tournament.id}`} className="flex-1 rounded-xl border border-outline-variant px-3 py-2 text-center text-sm text-on-surface hover:border-primary-container">
            View
          </Link>
          <Link to={`/app/tournaments/${tournament.id}/manage`} className="flex-1 rounded-xl bg-primary-container px-3 py-2 text-center text-sm font-semibold text-on-primary hover:bg-primary">
            Manage
          </Link>
        </div>
      </div>
    </article>
  );
}

export default TournamentCard;



