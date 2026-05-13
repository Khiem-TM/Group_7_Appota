import MatchCard from "./MatchCard";

const MATCH_HEIGHT = 86;
const BASE_GAP = 16;

function RoundColumn({ round, roundIndex, totalRounds, fullscreen = false }) {
  const hasNextRound = roundIndex < totalRounds - 1;
  const hasPrevRound = roundIndex > 0;

  const matchHeight = fullscreen ? 94 : MATCH_HEIGHT;
  const baseGap = fullscreen ? 22 : BASE_GAP;
  const step = (matchHeight + baseGap) * Math.pow(2, roundIndex);
  const firstOffset = roundIndex === 0 ? 0 : step / 2 - matchHeight / 2;
  const betweenGap = step - matchHeight;
  const trackHeight =
    round.matches.length > 0 ? firstOffset * 2 + (round.matches.length - 1) * step + matchHeight : matchHeight;

  const pairConnectors = hasNextRound
    ? Array.from({ length: Math.floor(round.matches.length / 2) }, (_, pairIndex) => {
        const topCenter = firstOffset + pairIndex * 2 * step + matchHeight / 2;
        const bottomCenter = topCenter + step;

        return {
          id: `${round.name}-pair-${pairIndex}`,
          top: topCenter,
          height: bottomCenter - topCenter
        };
      })
    : [];

  return (
    <section className={`relative shrink-0 ${fullscreen ? "w-[21rem]" : "w-[18rem]"}`}>
      <h3 className={`${fullscreen ? "mb-5 text-2xl" : "mb-4 text-xl"} font-semibold text-primary-fixed`}>{round.name}</h3>

      <div className="relative" style={{ height: `${trackHeight}px` }}>
        {round.matches.map((match, index) => (
          <div
            key={match.id}
            className="relative"
            style={{ marginTop: index === 0 ? `${firstOffset}px` : `${betweenGap}px` }}
          >
            <MatchCard match={match} hasNextRound={hasNextRound} hasPrevRound={hasPrevRound} />
          </div>
        ))}

        {pairConnectors.map((connector) => (
          <span
            key={connector.id}
            className="pointer-events-none absolute -right-5 hidden w-px bg-outline-variant/80 xl:block"
            style={{ top: `${connector.top}px`, height: `${connector.height}px` }}
          />
        ))}
      </div>
    </section>
  );
}

export default RoundColumn;
