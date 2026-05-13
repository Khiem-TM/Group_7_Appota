import { ArrowRight, ShieldCheck, Swords, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="min-h-screen bg-hero-grid">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-8">
        <header className="flex items-center justify-between">
          <p className="font-display text-2xl text-cyan-200">BRKT // Generator</p>
          <div className="flex gap-2">
            <Link to="/login" className="rounded-xl border border-slate-600 px-4 py-2 text-sm text-slate-100">Login</Link>
            <Link to="/register" className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950">Register</Link>
          </div>
        </header>

        <main className="my-auto grid gap-8 py-10 lg:grid-cols-2 lg:items-center">
          <section>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">SaaS Tournament Control</p>
            <h1 className="mt-3 font-display text-5xl font-bold leading-tight text-white sm:text-6xl">
              Launch competitive brackets <span className="gradient-text">in hours</span>.
            </h1>
            <p className="mt-4 max-w-xl text-slate-300">
              Organize esports cups, manage match flow, publish standings, and broadcast announcements from one clean dashboard.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/app/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 hover:bg-cyan-400">
                Enter Dashboard <ArrowRight size={16} />
              </Link>
              <Link to="/app/explore" className="rounded-xl border border-slate-600 px-5 py-3 font-medium text-slate-100">
                Explore Tournaments
              </Link>
            </div>
          </section>

          <section className="soft-panel grid gap-4 p-6">
            <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
              <Trophy className="text-orange-400" size={20} />
              <p className="mt-2 font-medium text-white">Bracket + standings in sync</p>
              <p className="text-sm text-slate-400">Track progression and leaderboard updates from a single source of truth.</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
              <Swords className="text-cyan-300" size={20} />
              <p className="mt-2 font-medium text-white">Real-time match operations</p>
              <p className="text-sm text-slate-400">Update winners quickly and keep players informed each round.</p>
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
              <ShieldCheck className="text-lime-300" size={20} />
              <p className="mt-2 font-medium text-white">Admin-ready workflow</p>
              <p className="text-sm text-slate-400">Built to integrate with FastAPI auth and role-based permissions.</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default LandingPage;
