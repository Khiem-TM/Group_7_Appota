function ConfirmModal({ open, title, description, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="soft-panel w-full max-w-md p-6">
        <h3 className="font-display text-xl font-bold text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-400">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-200">
            Cancel
          </button>
          <button onClick={onConfirm} className="rounded-lg bg-rose-500 px-3 py-2 text-sm font-semibold text-white">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
