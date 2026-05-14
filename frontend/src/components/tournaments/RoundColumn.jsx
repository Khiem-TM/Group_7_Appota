import MatchCard from "./MatchCard";

const MATCH_HEIGHT = 126;
const BASE_GAP = 16;

function RoundColumn({ round, roundIndex, totalRounds, fullscreen = false, connectorSpan = 20 }) {
  const hasNextRound = roundIndex < totalRounds - 1;
  const hasPrevRound = roundIndex > 0;

  const matchHeight = fullscreen ? 134 : MATCH_HEIGHT;
  const baseGap = fullscreen ? 22 : BASE_GAP;
  const rowPitch = matchHeight + baseGap;
  const step = rowPitch * Math.pow(2, roundIndex);
  const firstOffset = roundIndex === 0 ? 0 : (Math.pow(2, roundIndex) - 1) * (rowPitch / 2);
  const matchTops = round.matches.map((_, index) => firstOffset + index * step);
  const trackHeight =
    matchTops.length > 0 ? matchTops[matchTops.length - 1] + matchHeight : matchHeight;

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
            className="absolute left-0 right-0"
            style={{
              top: `${matchTops[index]}px`,
              height: `${matchHeight}px`
            }}
          >
            <MatchCard
              match={match}
              hasNextRound={hasNextRound}
              hasPrevRound={hasPrevRound}
              className="h-full"
              connectorSpan={connectorSpan}
            />
          </div>
        ))}

        {pairConnectors.map((connector) => (
          <span
            key={connector.id}
            className="pointer-events-none absolute hidden w-px bg-outline-variant/80 xl:block"
            style={{
              top: `${connector.top}px`,
              right: `-${connectorSpan}px`,
              height: `${connector.height}px`
            }}
          />
        ))}
      </div>
    </section>
  );
}

export default RoundColumn;
