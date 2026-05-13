import { Link } from "react-router-dom";

function EmptyState({ title, description, actionLabel, actionTo, onAction }) {
  const hasAction = Boolean(actionLabel);

  return (
    <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-8 text-center">
      <h3 className="font-display text-2xl font-semibold text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-on-surface-variant">{description}</p>

      {hasAction && (
        <div className="mt-5">
          {actionTo ? (
            <Link to={actionTo} className="inline-flex rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400">
              {actionLabel}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default EmptyState;

