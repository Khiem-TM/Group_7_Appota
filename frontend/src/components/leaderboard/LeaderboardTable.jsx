function LeaderboardTable({ rows }) {
  return (
    <div className="soft-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-surface-container-low/90 text-on-surface-variant">
            <tr>
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Team</th>
              <th className="px-4 py-3 text-left">Points</th>
              <th className="px-4 py-3 text-left">W</th>
              <th className="px-4 py-3 text-left">L</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.rank} className="border-t border-outline-variant text-on-surface">
                <td className="px-4 py-3 font-display text-base">{row.rank}</td>
                <td className="px-4 py-3">{row.team}</td>
                <td className="px-4 py-3 font-semibold text-primary-fixed">{row.points}</td>
                <td className="px-4 py-3">{row.wins}</td>
                <td className="px-4 py-3">{row.losses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaderboardTable;

