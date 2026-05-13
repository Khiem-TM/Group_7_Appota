import { useState } from "react";
import { useParams } from "react-router-dom";
import AnnouncementPanel from "../components/announcements/AnnouncementPanel";
import ConfirmModal from "../components/common/ConfirmModal";
import EmptyState from "../components/common/EmptyState";
import BracketView from "../components/tournaments/BracketView";
import { announcements, bracketRounds, tournaments } from "../data/mockData";

function ManageTournamentPage() {
  const { id } = useParams();
  const tournament = tournaments.find((item) => item.id === id);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!tournament) {
    return <EmptyState title="Tournament not found" description="Try selecting another event from Explore page." />;
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="page-title">Manage: {tournament.name}</h2>
          <p className="page-subtitle">Control registration, round progression, and communication.</p>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <button className="rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-400">Start Next Round</button>
          <button className="rounded-xl border border-slate-700 px-4 py-3 text-slate-100 hover:border-cyan-400">Seed Participants</button>
          <button onClick={() => setConfirmOpen(true)} className="rounded-xl border border-rose-500/60 px-4 py-3 text-rose-200 hover:bg-rose-500/10">
            Close Registration
          </button>
        </section>

        <div className="space-y-3">
          <h3 className="font-display text-xl text-white">Bracket Control</h3>
          <BracketView rounds={bracketRounds} />
        </div>

        <AnnouncementPanel items={announcements} showCompose />
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="Close registration?"
        description="This mock action simulates locking participant registration before live rounds."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          alert("Mock action: registration closed.");
        }}
      />
    </>
  );
}

export default ManageTournamentPage;
