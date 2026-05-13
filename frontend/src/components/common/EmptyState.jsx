function EmptyState({ title, description }) {
  return (
    <div className="soft-panel p-8 text-center">
      <h3 className="font-display text-xl font-semibold text-slate-100">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}

export default EmptyState;
