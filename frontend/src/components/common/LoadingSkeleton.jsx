function LoadingSkeleton({ variant = "card", count = 3, className = "" }) {
  if (variant === "list") {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="h-4 w-1/3 animate-pulse rounded bg-slate-800" />
            <div className="mt-3 h-3 w-2/3 animate-pulse rounded bg-slate-800" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-3 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="h-4 w-1/2 animate-pulse rounded bg-slate-800" />
          <div className="mt-4 h-8 w-1/3 animate-pulse rounded bg-slate-800" />
          <div className="mt-4 h-3 w-2/3 animate-pulse rounded bg-slate-800" />
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
