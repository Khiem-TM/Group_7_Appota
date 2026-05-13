import TournamentForm from "../components/tournaments/TournamentForm";

function CreateTournamentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title">Create Tournament</h2>
        <p className="page-subtitle">Set your format, player capacity, and kickoff schedule.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TournamentForm />
        </div>
        <aside className="soft-panel p-4">
          <h3 className="font-display text-lg text-white">Launch Tips</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>Define clear check-in timing before round one.</li>
            <li>Pick a bracket format matching event duration.</li>
            <li>Prepare announcement templates for delays and updates.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

export default CreateTournamentPage;
