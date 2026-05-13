import { useState } from "react";

function TournamentForm() {
  const [form, setForm] = useState({
    name: "",
    game: "Valorant",
    format: "Single Elimination",
    maxParticipants: 16,
    startDate: ""
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Mock tournament created: ${form.name || "Untitled Tournament"}`);
  };

  return (
    <form onSubmit={handleSubmit} className="soft-panel space-y-4 p-5">
      <div>
        <label className="text-sm text-on-surface-variant">Tournament Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-1 w-full rounded-xl border border-outline-variant bg-surface-container-low/70 px-3 py-2 text-sm outline-none focus:border-primary-container"
          placeholder="Nebula Open"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-on-surface-variant">Game</label>
          <select
            value={form.game}
            onChange={(e) => setForm({ ...form, game: e.target.value })}
            className="mt-1 w-full rounded-xl border border-outline-variant bg-surface-container-low/70 px-3 py-2 text-sm outline-none focus:border-primary-container"
          >
            <option>Valorant</option>
            <option>League of Legends</option>
            <option>CS2</option>
            <option>Dota 2</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-on-surface-variant">Format</label>
          <select
            value={form.format}
            onChange={(e) => setForm({ ...form, format: e.target.value })}
            className="mt-1 w-full rounded-xl border border-outline-variant bg-surface-container-low/70 px-3 py-2 text-sm outline-none focus:border-primary-container"
          >
            <option>Single Elimination</option>
            <option>Double Elimination</option>
            <option>Round Robin + Playoff</option>
          </select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-on-surface-variant">Max Participants</label>
          <input
            type="number"
            min="4"
            value={form.maxParticipants}
            onChange={(e) => setForm({ ...form, maxParticipants: Number(e.target.value) })}
            className="mt-1 w-full rounded-xl border border-outline-variant bg-surface-container-low/70 px-3 py-2 text-sm outline-none focus:border-primary-container"
          />
        </div>
        <div>
          <label className="text-sm text-on-surface-variant">Start Date</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="mt-1 w-full rounded-xl border border-outline-variant bg-surface-container-low/70 px-3 py-2 text-sm outline-none focus:border-primary-container"
          />
        </div>
      </div>
      <button type="submit" className="rounded-xl bg-primary-container px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary">
        Create Tournament
      </button>
    </form>
  );
}

export default TournamentForm;


