function MatchCard({ match }) {
  const isFinished = match.status === "finished";

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
        <span>{match.id.toUpperCase()}</span>
        <span>{isFinished ? "Final" : "Upcoming"}</span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between rounded-lg bg-slate-800/70 px-2 py-1.5 text-slate-200">
          <span>{match.teamA}</span>
          <strong>{match.scoreA}</strong>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-slate-800/70 px-2 py-1.5 text-slate-200">
          <span>{match.teamB}</span>
          <strong>{match.scoreB}</strong>
        </div>
      </div>
    </div>
  );
}

export default MatchCard;
