import {
  Activity,
  ArrowRight,
  BellRing,
  Brackets,
  CircleDashed,
  Crown,
  ListOrdered,
  Radio,
  ShieldCheck,
  Swords,
  UserPlus,
  UsersRound
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

const featureCards = [
  {
    icon: Brackets,
    title: "Multiple tournament formats",
    description: "Run single-elim, double-elim, round-robin, and Swiss in one platform."
  },
  {
    icon: Radio,
    title: "Real-time bracket updates",
    description: "Scores and brackets sync instantly for players and admins."
  },
  {
    icon: Crown,
    title: "Tournament leaderboard",
    description: "Track standings, points, and team performance with clean tables."
  },
  {
    icon: BellRing,
    title: "Organizer announcements",
    description: "Broadcast updates, delays, and match instructions in seconds."
  },
  {
    icon: Activity,
    title: "Match result reporting",
    description: "Record outcomes quickly and keep bracket progression accurate."
  },
  {
    icon: UserPlus,
    title: "Player registration",
    description: "Capture entrants, manage slots, and handle waitlists smoothly."
  }
];

const formats = [
  { icon: Swords, label: "Single Elimination" },
  { icon: CircleDashed, label: "Double Elimination" },
  { icon: ListOrdered, label: "Round Robin" },
  { icon: ShieldCheck, label: "Swiss" }
];

const trendingTournaments = [
  {
    id: "pro-am-open",
    title: "Pro-Am Valorant Open",
    subtitle: "Double Elim • FPS",
    players: "64/64 Teams",
    cta: "View Bracket"
  },
  {
    id: "community-blitz",
    title: "Community Chess Blitz",
    subtitle: "Swiss • Strategy",
    players: "128/256 Players",
    cta: "Register"
  },
  {
    id: "sunday-night-fights",
    title: "Sunday Night Fights",
    subtitle: "Double Elim • FGC",
    players: "32/32 Players",
    cta: "View Bracket"
  }
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-slate-900">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.18),transparent_38%),radial-gradient(circle_at_82%_12%,rgba(139,92,246,0.2),transparent_36%)]" />
          <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pt-20">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium tracking-[0.2em] text-cyan-400">
                ESPORTS READY
              </span>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-6xl">
                Create Tournament Brackets in Minutes
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">
                Manage single-elimination, double-elimination, round-robin, and Swiss tournaments with real-time updates.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  to="/tournaments/create"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white hover:from-blue-400 hover:to-violet-400"
                >
                  Create Tournament <ArrowRight size={16} />
                </Link>
                <Link
                  to="/explore"
                  className="inline-flex items-center rounded-xl border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:border-slate-700"
                >
                  Explore Tournaments
                </Link>
              </div>
            </div>

            <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/50 p-3 shadow-[0_0_0_1px_rgba(30,41,59,0.4)] sm:p-4">
              <div className="h-[300px] rounded-xl border border-slate-800 bg-[radial-gradient(circle_at_70%_22%,rgba(34,211,238,0.12),transparent_40%),linear-gradient(145deg,#020617,#0f172a)] sm:h-[440px]" />
            </div>
          </div>
        </section>

        <section className="border-b border-slate-900 bg-slate-950/80">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="font-display text-3xl font-semibold">Every Format, Fully Automated</h2>
              <p className="mt-2 text-sm text-slate-400">
                From quick weekend cups to season-long leagues, we&apos;ve got the logic handled.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {formats.map((format) => {
                const Icon = format.icon;
                return (
                  <div
                    key={format.label}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-200"
                  >
                    <Icon size={14} className="text-cyan-400" />
                    {format.label}
                  </div>
                );
              })}
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featureCards.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                    <div className="inline-flex rounded-lg bg-violet-500/15 p-2 text-violet-300">
                      <Icon size={16} />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-950">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="font-display text-3xl font-semibold text-white">Trending Tournaments</h2>
                <p className="mt-1 text-sm text-slate-400">Join active events happening right now.</p>
              </div>
              <Link to="/explore" className="text-sm text-cyan-400 hover:text-cyan-300">
                View All
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {trendingTournaments.map((tournament) => (
                <article key={tournament.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                  <div className="h-28 rounded-xl border border-slate-800 bg-[linear-gradient(130deg,#0f172a,#1e293b)]" />
                  <p className="mt-4 text-xs uppercase tracking-[0.14em] text-violet-300">{tournament.subtitle}</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{tournament.title}</h3>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                    <span className="inline-flex items-center gap-1"><UsersRound size={14} />{tournament.players}</span>
                    <Link to="/explore" className="text-cyan-400 hover:text-cyan-300">
                      {tournament.cta}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
          <div>
            <p className="font-display text-2xl font-semibold text-white">Arena Pro</p>
            <p className="mt-2 max-w-sm text-sm text-slate-400">The modern operating system for esports organizers.</p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm text-slate-400 sm:grid-cols-3">
            <div>
              <p className="mb-2 font-semibold text-white">Product</p>
              <p>Features</p>
              <p>Pricing</p>
              <p>Formats</p>
            </div>
            <div>
              <p className="mb-2 font-semibold text-white">Resources</p>
              <p>Documentation</p>
              <p>API</p>
              <p>Support</p>
            </div>
            <div>
              <p className="mb-2 font-semibold text-white">Legal</p>
              <p>Privacy Policy</p>
              <p>Terms of Service</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
