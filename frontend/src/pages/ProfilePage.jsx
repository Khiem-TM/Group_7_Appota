import { CalendarDays, Camera, Medal, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMyProfile, getUserProfile, updateMe, uploadProfileMedia } from "../api/users";
import { useAuth } from "../contexts/AuthContext";

const defaultCover = "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80";

function StatCard({ value, label, active = false }) {
  return (
    <div className={`rounded-xl border bg-surface-container-low p-5 text-center ${active ? "border-cyan-400" : "border-outline-variant"}`}>
      <p className="font-display text-4xl font-bold text-white">{value ?? 0}</p>
      <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface-variant">{label}</p>
    </div>
  );
}

function ProfilePage() {
  const { userId } = useParams();
  const { user, refetch } = useAuth();
  const isOwnProfile = !userId || Number(userId) === user?.id;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: "", bio: "", country: "", avatar_url: "", cover_url: "" });
  const [saving, setSaving] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState({ avatar: false, cover: false });
  const [error, setError] = useState("");

  async function loadProfile() {
    setLoading(true);
    setError("");
    try {
      const data = isOwnProfile ? await getMyProfile() : await getUserProfile(userId);
      setProfile(data);
      setForm({
        full_name: data.full_name || "",
        bio: data.bio || "",
        country: data.country || "",
        avatar_url: data.avatar_url || "",
        cover_url: data.cover_url || "",
      });
    } catch {
      setError("Profile not found.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, [userId, user?.id]);

  const initials = useMemo(() => profile?.username?.slice(0, 2).toUpperCase() || "??", [profile]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      await updateMe(form);
      await refetch();
      await loadProfile();
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleMediaUpload = async (kind, file) => {
    if (!file) return;
    setUploadingMedia((current) => ({ ...current, [kind]: true }));
    setError("");
    try {
      const { url } = await uploadProfileMedia(kind, file);
      const field = kind === "avatar" ? "avatar_url" : "cover_url";
      setForm((current) => ({ ...current, [field]: url }));
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to upload image.");
    } finally {
      setUploadingMedia((current) => ({ ...current, [kind]: false }));
    }
  };

  if (loading) return <div className="flex min-h-[220px] items-center justify-center text-on-surface-variant">Loading…</div>;
  if (!profile) return <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">{error}</div>;

  const cover = profile.cover_url || defaultCover;
  const avatar = profile.avatar_url;
  const previewCover = form.cover_url || cover;
  const previewAvatar = form.avatar_url || avatar;

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-low/70">
      <div className="relative h-56 bg-surface-container-highest md:h-72">
        <img src={cover} alt="Profile cover" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        {isOwnProfile ? (
          <button onClick={() => setEditing(true)} className="absolute right-4 top-4 rounded-lg bg-black/50 p-2 text-white hover:bg-black/70" title="Edit profile media">
            <Camera size={18} />
          </button>
        ) : null}
      </div>

      <div className="relative px-6 pb-8 md:px-10">
        <div className="-mt-16 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-surface bg-surface-container-highest text-3xl font-bold text-on-primary shadow-xl">
              {avatar ? <img src={avatar} alt={profile.username} className="h-full w-full object-cover" /> : initials}
            </div>
            <div className="pb-2">
              <h1 className="font-display text-4xl font-bold text-white">{profile.username}</h1>
              <p className="mt-1 text-sm text-on-surface-variant">
                {profile.country || "Global"} • Member since {new Date(profile.created_at).toLocaleDateString(undefined, { month: "short", year: "numeric" })}
              </p>
              {profile.bio ? <p className="mt-2 max-w-2xl text-sm text-on-surface">{profile.bio}</p> : null}
            </div>
          </div>
          {isOwnProfile ? (
            <button onClick={() => setEditing((v) => !v)} className="rounded-xl border border-outline-variant px-4 py-2 text-sm text-on-surface hover:border-primary-container">
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          ) : null}
        </div>

        {editing ? (
          <section className="mt-6 rounded-xl border border-outline-variant bg-surface-container-low p-5">
            {error ? <p className="mb-3 text-sm text-red-400">{error}</p> : null}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-outline-variant bg-surface p-4">
                <p className="text-sm font-semibold text-white">Avatar</p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-container-highest text-xl font-bold text-on-primary">
                    {previewAvatar ? <img src={previewAvatar} alt="Avatar preview" className="h-full w-full object-cover" /> : initials}
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-on-surface hover:border-primary-container">
                    <Camera size={16} />
                    {uploadingMedia.avatar ? "Uploading..." : "Choose avatar"}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => handleMediaUpload("avatar", e.target.files?.[0])}
                    />
                  </label>
                </div>
              </div>
              <div className="rounded-xl border border-outline-variant bg-surface p-4">
                <p className="text-sm font-semibold text-white">Cover image</p>
                <div className="mt-3 overflow-hidden rounded-lg border border-outline-variant bg-surface-container-highest">
                  <img src={previewCover} alt="Cover preview" className="h-24 w-full object-cover" />
                </div>
                <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-on-surface hover:border-primary-container">
                  <Camera size={16} />
                  {uploadingMedia.cover ? "Uploading..." : "Choose cover"}
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => handleMediaUpload("cover", e.target.files?.[0])}
                  />
                </label>
              </div>
              <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Full name" className="rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-white outline-none" />
              <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="Country" className="rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-white outline-none" />
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Bio" rows={3} className="rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-white outline-none md:col-span-2" />
            </div>
            <button onClick={handleSave} disabled={saving} className="mt-4 rounded-xl bg-primary-container px-5 py-2 text-sm font-semibold text-on-primary disabled:opacity-60">
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </section>
        ) : null}

        <nav className="mt-8 flex gap-8 border-b border-outline-variant text-sm font-semibold text-on-surface-variant">
          <span className="border-b-2 border-cyan-300 pb-3 text-cyan-200">Overview</span>
          <span className="pb-3">Tournaments</span>
          <span className="pb-3">Statistics</span>
          <span className="pb-3">Achievements</span>
        </nav>

        <section className="mt-8">
          <h2 className="font-display text-2xl font-bold italic text-white">Overall Stats</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            <StatCard value={profile.total_tournaments_hosted} label="Tournaments Organized" />
            <StatCard value={profile.total_matches_played} label="Matches Played" active />
            <StatCard value={profile.total_tournaments_joined} label="Tournaments Participated" />
            <StatCard value={profile.total_hosted_participants} label="Hosted Participants" />
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold italic text-white">Top Finishes</h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <StatCard value={profile.first_place_finishes} label="First Place" active />
              <StatCard value={profile.top_three_finishes} label="Top 3" />
              <StatCard value={profile.total_wins} label="Wins" />
              <StatCard value={profile.achievements?.length || 0} label="Achievements" />
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold italic text-white">Games Played</h2>
            <div className="mt-4 space-y-3">
              {(profile.games_played || []).length === 0 ? <p className="text-sm text-on-surface-variant">No game history yet.</p> : profile.games_played.map((g) => (
                <div key={g.game} className="flex items-center justify-between rounded-xl border border-outline-variant bg-surface-container-low p-3">
                  <span className="font-semibold text-white">{g.game}</span>
                  <span className="text-sm text-on-surface-variant">{g.tournaments} tournaments</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold italic text-white">Hosted Tournaments</h2>
            <div className="mt-4 space-y-3">
              {(profile.hosted_tournaments || []).length === 0 ? <p className="text-sm text-on-surface-variant">No hosted tournaments.</p> : profile.hosted_tournaments.map((t) => (
                <Link key={t.id} to={`/app/tournaments/${t.id}`} className="block rounded-xl border border-outline-variant bg-surface-container-low p-4 hover:border-primary-container">
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="mt-1 text-sm text-on-surface-variant"><Trophy className="mr-1 inline" size={14} />{t.game || "No game"} • {t.status}</p>
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold italic text-white">Participated Tournaments</h2>
            <div className="mt-4 space-y-3">
              {(profile.participated_tournaments || []).length === 0 ? <p className="text-sm text-on-surface-variant">No participated tournaments.</p> : profile.participated_tournaments.map((t) => (
                <Link key={t.id} to={`/app/tournaments/${t.id}`} className="block rounded-xl border border-outline-variant bg-surface-container-low p-4 hover:border-primary-container">
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="mt-1 text-sm text-on-surface-variant"><CalendarDays className="mr-1 inline" size={14} />{t.game || "No game"} • {t.start_date || "TBD"}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold italic text-white">Achievements</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            {(profile.achievements || []).map((a) => (
              <div key={a.label} className="rounded-xl border border-outline-variant bg-surface-container-low p-4">
                <Medal className="text-orange-400" size={20} />
                <p className="mt-3 text-2xl font-bold text-white">{a.value}</p>
                <p className="text-xs uppercase tracking-[0.1em] text-on-surface-variant">{a.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProfilePage;
