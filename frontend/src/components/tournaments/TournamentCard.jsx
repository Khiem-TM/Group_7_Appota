import { CalendarDays, Users } from "lucide-react";
import { Link } from "react-router-dom";
import TournamentStatusBadge from "./TournamentStatusBadge";
import FormatBadge from "./FormatBadge";

function TournamentCard({ tournament }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-low/75 shadow-lg">
      <div className="relative h-44 w-full overflow-hidden bg-surface-container-highest">
        {tournament.banner ? (
          <img src={tournament.banner} alt={tournament.game || tournament.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-on-surface-variant/40 select-none">
            {tournament.game ? tournament.game.slice(0, 2).toUpperCase() : "—"}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/35 to-transparent" />
        <div className="absolute left-4 right-4 top-4 flex flex-wrap items-center gap-2">
          <TournamentStatusBadge status={tournament.status} />
          <FormatBadge format={tournament.format} />
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-on-surface-variant">{tournament.game}</p>
          <h3 className="mt-1 truncate font-display text-xl font-semibold text-white">{tournament.name}</h3>
        </div>
      </div>
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-2 text-xs text-on-surface-variant">
          <p className="flex items-center gap-1"><Users size={14} /> {tournament.participants}/{tournament.maxParticipants}</p>
          <p className="flex items-center gap-1"><CalendarDays size={14} /> {tournament.startDate}</p>
        </div>
        <Link to={`/app/tournaments/${tournament.id}`} className="block rounded-xl border border-outline-variant px-3 py-2 text-center text-sm font-semibold text-on-surface hover:border-primary-container">
          View
        </Link>
      </div>
    </article>
  );
}

export default TournamentCard;


