import RoundColumn from "./RoundColumn";

function BracketView({ rounds, fullscreen = false }) {
  const totalRounds = rounds.length;
  const shellClasses = fullscreen
    ? "h-full overflow-auto px-4 py-5 md:px-8 md:py-8"
    : "soft-panel overflow-x-auto p-4 md:p-6";
  const laneGap = fullscreen ? 64 : 40;
  const connectorSpan = laneGap / 2;
  const lanesClasses = fullscreen ? "flex min-w-max pb-8 pr-8" : "flex min-w-max pb-2";
  const titleClasses = fullscreen ? "text-sm font-semibold uppercase tracking-[0.14em] text-on-surface-variant" : "text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-variant";

  return (
    <div className={shellClasses}>
      <div className={`flex items-center justify-between ${fullscreen ? "mb-6" : "mb-4"}`}>
        <h3 className={titleClasses}>Bracket</h3>
        <span className="text-xs text-on-surface-variant">Seeded by participant order</span>
      </div>

      <div className={lanesClasses} style={{ columnGap: `${laneGap}px` }}>
        {rounds.map((round, roundIndex) => (
          <RoundColumn
            key={round.name}
            round={round}
            roundIndex={roundIndex}
            totalRounds={totalRounds}
            fullscreen={fullscreen}
            connectorSpan={connectorSpan}
          />
        ))}
      </div>
    </div>
  );
}

export default BracketView;
