function StatCard({ icon: Icon, label, value, description, trend }) {
  const helperText = description || trend;

  return (
    <article className="rounded-2xl border border-outline-variant bg-surface-container-low p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-on-surface-variant">{label}</p>
          <p className="mt-2 font-display text-3xl font-semibold text-white">{value}</p>
        </div>

        {Icon && (
          <div className="rounded-xl bg-primary-container/15 p-2 text-primary-fixed-dim">
            {typeof Icon === "function" ? <Icon size={18} /> : Icon}
          </div>
        )}
      </div>

      {helperText ? <p className="mt-3 text-sm text-on-surface-variant">{helperText}</p> : null}
    </article>
  );
}

export default StatCard;


