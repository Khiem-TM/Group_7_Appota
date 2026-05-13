function MatchCard({ match }) {
  const isFinished = match.status === "finished";

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-low/80 p-3">
      <div className="mb-2 flex items-center justify-between text-xs text-on-surface-variant">
        <span>{match.id.toUpperCase()}</span>
        <span>{isFinished ? "Final" : "Upcoming"}</span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between rounded-lg bg-surface-container-high/70 px-2 py-1.5 text-on-surface">
          <span>{match.teamA}</span>
          <strong>{match.scoreA}</strong>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-surface-container-high/70 px-2 py-1.5 text-on-surface">
          <span>{match.teamB}</span>
          <strong>{match.scoreB}</strong>
        </div>
      </div>
    </div>
  );
}

export default MatchCard;

