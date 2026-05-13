function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  onClose,
  loading = false
}) {
  if (!open) return null;

  const handleCancel = onCancel || onClose;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4" onClick={handleCancel}>
      <div
        className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-400">{description}</p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-slate-600 hover:text-white"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
