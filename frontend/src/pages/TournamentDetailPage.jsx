import { ChevronLeft, ClipboardList, Plus, Share2, Shuffle, Swords } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { tournaments } from "../data/mockData";

const tabs = [
  { key: "bracket", label: "Bracket" },
  { key: "standings", label: "Standings" },
  { key: "announcements", label: "Announcements (0)" },
  { key: "log", label: "Log (1)" },
  { key: "stations", label: "Stations" },
  { key: "participants", label: "Participants" },
  { key: "settings", label: "Settings" },
  { key: "issues", label: "Issues (0)" }
];

function formatDateTime(value) {
  if (!value) return "May 12, 2026, 7:01 PM +07";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return (
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }).format(date) + " +07"
  );
}

function TournamentDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("participants");

  const tournament = useMemo(() => {
    const fromRoute = tournaments.find((item) => item.id === id);
    if (fromRoute) {
      return {
        id: fromRoute.id,
        name: fromRoute.name,
        organizer: fromRoute.organizer,
        format: fromRoute.format,
        game: fromRoute.game,
        participants: fromRoute.participants,
        startTime: fromRoute.startDate
      };
    }

    const fromState = location.state?.tournament;
    if (fromState) {
      return {
        id: fromState.id,
        name: fromState.name,
        organizer: fromState.host || "ductinbk",
        format: fromState.format,
        game: fromState.game,
        participants: fromState.participants ?? 0,
        startTime: fromState.startTime
      };
    }

    return {
      id,
      name: "123",
      organizer: "ductinbk",
      format: "Single Elimination",
      game: "League of Legends",
      participants: 0,
      startTime: "2026-05-12T19:01"
    };
  }, [id, location.state]);

  return (
    <div className="-mx-4 -my-6 min-h-[calc(100vh-3.5rem)] bg-surface sm:-mx-6 lg:-mx-8">
      <div className="mx-auto min-h-[calc(100vh-3.5rem)] max-w-[1440px] bg-tournament-shell lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-r border-outline-variant bg-surface-container-low/70">
          <div className="px-6 py-6">
            <Link
              to="/app/dashboard"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface text-on-surface-variant hover:text-white"
            >
              <ChevronLeft size={22} />
            </Link>
          </div>

          <nav className="space-y-1 px-5 pb-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`w-full rounded-md px-4 py-2.5 text-left text-lg leading-tight tracking-tight transition ${
                  activeTab === tab.key
                    ? "bg-surface-container-highest text-white"
                    : "text-on-surface-variant hover:bg-surface-container-highest/60 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <section className="px-6 py-8 lg:px-12 lg:py-10">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="font-display text-3xl font-bold italic tracking-tight text-white md:text-4xl">{tournament.name}</h1>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-outline-variant bg-surface-container-highest px-6 py-3 text-on-surface hover:bg-surface-bright"
            >
              <Share2 size={18} />
            </button>
          </div>

          <div className="mt-5 h-1 w-28 bg-tertiary-container" />

          <div className="mt-8 rounded-2xl border border-outline-variant bg-surface-container-low/90 p-8 lg:flex lg:items-start lg:justify-between lg:gap-8">
            <dl className="grid grid-cols-[105px_1fr] gap-x-6 gap-y-3 text-base leading-tight md:grid-cols-[120px_1fr] md:text-xl">
              <dt className="text-on-surface-variant">Players</dt>
              <dd className="text-white">{tournament.participants}</dd>
              <dt className="text-on-surface-variant">Format</dt>
              <dd className="text-white">{tournament.format}</dd>
              <dt className="text-on-surface-variant">Game</dt>
              <dd className="text-white">{tournament.game}</dd>
              <dt className="text-on-surface-variant">Start Time</dt>
              <dd className="text-white">{formatDateTime(tournament.startTime)}</dd>
            </dl>

            <div className="mt-6 rounded-full bg-surface-bright px-7 py-4 text-lg leading-tight lg:mt-0">
              <p className="text-on-surface">Organized by</p>
              <p className="mt-1 text-tertiary">{tournament.organizer}</p>
            </div>
          </div>

          <div className="mt-10 space-y-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <h2 className="font-display text-3xl font-bold italic tracking-tight text-white md:text-4xl">
                Manage Participants
              </h2>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-bright px-5 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-container-highest">
                  <Shuffle size={16} /> Shuffle Seeds
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-bright px-5 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-container-highest">
                  <ClipboardList size={16} /> Bulk Add
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-outline-variant bg-surface-container-low/85 p-8">
              <p className="text-base text-on-surface md:text-lg">
                No participants yet. Add participants to start generating brackets.
              </p>
            </div>

            <div className="flex justify-end">
              <button className="inline-flex items-center gap-2 rounded-full bg-tertiary-container px-7 py-3 text-base font-bold italic text-white hover:bg-tertiary">
                <Plus size={20} /> Add Participant
              </button>
            </div>

            <div className="rounded-xl border border-outline-variant bg-surface/75 p-5 text-sm text-on-surface-variant">
              <p className="inline-flex items-center gap-2">
                <Swords size={16} className="text-primary-fixed-dim" />
                A bracket preview will be displayed once 2 or more participants are registered.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TournamentDetailPage;
