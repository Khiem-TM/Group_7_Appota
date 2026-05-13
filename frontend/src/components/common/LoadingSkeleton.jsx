function LoadingSkeleton({ variant = "card", count = 3, className = "" }) {
  if (variant === "list") {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="rounded-2xl border border-outline-variant bg-surface-container-low p-4">
            <div className="h-4 w-1/3 animate-pulse rounded bg-surface-container-highest" />
            <div className="mt-3 h-3 w-2/3 animate-pulse rounded bg-surface-container-highest" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-3 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-outline-variant bg-surface-container-low p-5">
          <div className="h-4 w-1/2 animate-pulse rounded bg-surface-container-highest" />
          <div className="mt-4 h-8 w-1/3 animate-pulse rounded bg-surface-container-highest" />
          <div className="mt-4 h-3 w-2/3 animate-pulse rounded bg-surface-container-highest" />
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;

