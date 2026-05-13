function StatCard({ label, value, trend }) {
  return (
    <article className="soft-panel p-4">
      <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-cyan-300">{trend}</p>
    </article>
  );
}

export default StatCard;
