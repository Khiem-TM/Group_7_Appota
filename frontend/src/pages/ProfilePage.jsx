import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listTournaments, toDisplayFormat } from "../api/tournaments";
import { updateMe } from "../api/users";
import { useAuth } from "../contexts/AuthContext";

function ProfilePage() {
  const { user, refetch } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ bio: "", country: "", avatar_url: "" });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const data = await listTournaments(1, 100);
        setTournaments(data.filter((t) => t.host_id === user.id));
      } catch {}
    }
    load();
  }, [user]);

  useEffect(() => {
    if (user) {
      setForm({ bio: user.bio || "", country: user.country || "", avatar_url: user.avatar_url || "" });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      await updateMe(form);
      await refetch();
      setEditing(false);
    } catch (err) {
      setSaveError(err.response?.data?.detail || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-on-surface-variant">
        Loading…
      </div>
    );
  }

  const initials = user.username ? user.username.slice(0, 2).toUpperCase() : "??";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title">Profile</h2>
        <p className="page-subtitle">Personal organizer profile and activity snapshot.</p>
      </div>

      <section className="soft-panel p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-container text-xl font-bold text-on-primary">
              {initials}
            </div>
            <div>
              <h3 className="font-display text-2xl text-white">{user.username}</h3>
              <p className="text-sm text-on-surface-variant">{user.email} • {user.role}</p>
              {user.bio ? <p className="mt-1 text-sm text-on-surface-variant">{user.bio}</p> : null}
              {user.country ? <p className="text-xs text-on-surface-variant/60">{user.country}</p> : null}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="self-start rounded-lg border border-outline-variant px-4 py-2 text-sm text-on-surface-variant hover:text-white"
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {editing ? (
          <div className="mt-6 space-y-4 border-t border-outline-variant pt-6">
            {saveError ? (
              <p className="text-sm text-red-400">{saveError}</p>
            ) : null}
            <div>
              <label className="text-xs uppercase tracking-[0.12em] text-on-surface-variant">Bio</label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="mt-1 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-white outline-none focus:border-primary-container"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.12em] text-on-surface-variant">Country</label>
              <input
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="mt-1 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-white outline-none focus:border-primary-container"
                placeholder="e.g. Vietnam"
              />
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        ) : null}
      </section>

      <section className="soft-panel p-4">
        <h3 className="font-display text-xl text-white">Managed Tournaments</h3>
        {tournaments.length === 0 ? (
          <p className="mt-3 text-sm text-on-surface-variant">No tournaments yet.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {tournaments.map((t) => (
              <Link
                key={t.id}
                to={`/app/tournaments/${t.id}`}
                className="block rounded-xl border border-outline-variant bg-surface-container-low/70 p-3 hover:border-primary-container/40"
              >
                <p className="font-medium text-on-surface">{t.name}</p>
                <p className="text-sm text-on-surface-variant">
                  {t.game || "No game"} • {toDisplayFormat(t.format)} • {t.start_date || "TBD"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProfilePage;
