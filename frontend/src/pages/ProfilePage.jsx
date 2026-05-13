import { currentUser, tournaments } from "../data/mockData";

function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title">Profile</h2>
        <p className="page-subtitle">Personal organizer profile and activity snapshot.</p>
      </div>

      <section className="soft-panel p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500 text-xl font-bold text-slate-950">
            {currentUser.avatar}
          </div>
          <div>
            <h3 className="font-display text-2xl text-white">{currentUser.displayName}</h3>
            <p className="text-sm text-slate-300">@{currentUser.username} • {currentUser.role}</p>
            <p className="mt-1 text-sm text-slate-400">{currentUser.bio}</p>
          </div>
        </div>
      </section>

      <section className="soft-panel p-4">
        <h3 className="font-display text-xl text-white">Managed Tournaments</h3>
        <div className="mt-3 space-y-2">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
              <p className="font-medium text-slate-100">{tournament.name}</p>
              <p className="text-sm text-slate-400">{tournament.game} • {tournament.startDate}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProfilePage;
