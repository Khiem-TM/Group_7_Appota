function LeaderboardTable({ rows }) {
  return (
    <div className="soft-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900/90 text-slate-300">
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
              <tr key={row.rank} className="border-t border-slate-800 text-slate-200">
                <td className="px-4 py-3 font-display text-base">{row.rank}</td>
                <td className="px-4 py-3">{row.team}</td>
                <td className="px-4 py-3 font-semibold text-cyan-300">{row.points}</td>
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
