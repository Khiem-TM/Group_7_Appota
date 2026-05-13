import RoundColumn from "./RoundColumn";

function BracketView({ rounds }) {
  return (
    <div className="soft-panel overflow-x-auto p-4">
      <div className="flex min-w-max gap-6">
        {rounds.map((round) => (
          <RoundColumn key={round.name} round={round} />
        ))}
      </div>
    </div>
  );
}

export default BracketView;
