import MatchCard from "./MatchCard";

function RoundColumn({ round }) {
  return (
    <section className="min-w-64 space-y-3">
      <h3 className="font-display text-lg font-semibold text-cyan-200">{round.name}</h3>
      {round.matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </section>
  );
}

export default RoundColumn;
