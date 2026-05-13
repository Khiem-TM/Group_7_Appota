function parseTeam(label) {
  if (!label) return { seed: "-", name: "TBD" };
  const matched = label.match(/^#(\d+)\s+(.+)$/);
  if (!matched) return { seed: "-", name: label };
  return { seed: matched[1], name: matched[2] };
}

function TeamRow({ team, score }) {
  return (
    <div className="grid grid-cols-[2.75rem_1fr_2rem] items-center rounded-md border border-outline-variant/70 bg-surface-container-high/55">
      <div className="flex h-9 items-center justify-center border-r border-outline-variant/70 bg-surface-container-highest/80 font-mono text-xs text-on-surface-variant">
        {team.seed}
      </div>
      <div className="truncate px-3 text-sm font-medium text-on-surface">{team.name}</div>
      <div className="pr-3 text-right font-mono text-sm font-semibold text-on-surface">{score}</div>
    </div>
  );
}

function MatchCard({ match, hasNextRound, hasPrevRound }) {
  const isFinished = match.status === "finished";
  const teamA = parseTeam(match.teamA);
  const teamB = parseTeam(match.teamB);

  return (
    <article className="relative rounded-xl border border-outline-variant bg-surface-container-low/95 p-3">
      {hasPrevRound ? (
        <span className="pointer-events-none absolute -left-5 top-1/2 hidden h-px w-5 -translate-y-1/2 bg-outline-variant/80 xl:block" />
      ) : null}
      {hasNextRound ? (
        <span className="pointer-events-none absolute -right-5 top-1/2 hidden h-px w-5 -translate-y-1/2 bg-outline-variant/80 xl:block" />
      ) : null}

      <header className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-on-surface-variant">{match.id}</span>
        <span className={`text-xs ${isFinished ? "text-tertiary-fixed-dim" : "text-on-surface-variant"}`}>
          {isFinished ? "Final" : "Upcoming"}
        </span>
      </header>

      <div className="space-y-1.5">
        <TeamRow team={teamA} score={match.scoreA} />
        <TeamRow team={teamB} score={match.scoreB} />
      </div>
    </article>
  );
}

export default MatchCard;
