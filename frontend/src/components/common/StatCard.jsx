function StatCard({ icon: Icon, label, value, description, trend }) {
  const helperText = description || trend;

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
          <p className="mt-2 font-display text-3xl font-semibold text-white">{value}</p>
        </div>

        {Icon && (
          <div className="rounded-xl bg-blue-500/15 p-2 text-cyan-400">
            {typeof Icon === "function" ? <Icon size={18} /> : Icon}
          </div>
        )}
      </div>

      {helperText ? <p className="mt-3 text-sm text-slate-400">{helperText}</p> : null}
    </article>
  );
}

export default StatCard;
