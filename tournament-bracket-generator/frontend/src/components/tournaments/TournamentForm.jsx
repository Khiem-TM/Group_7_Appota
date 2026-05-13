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
        <label className="text-sm text-slate-300">Tournament Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm outline-none focus:border-cyan-400"
          placeholder="Nebula Open"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-300">Game</label>
          <select
            value={form.game}
            onChange={(e) => setForm({ ...form, game: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm outline-none focus:border-cyan-400"
          >
            <option>Valorant</option>
            <option>League of Legends</option>
            <option>CS2</option>
            <option>Dota 2</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-300">Format</label>
          <select
            value={form.format}
            onChange={(e) => setForm({ ...form, format: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm outline-none focus:border-cyan-400"
          >
            <option>Single Elimination</option>
            <option>Double Elimination</option>
            <option>Round Robin + Playoff</option>
          </select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-300">Max Participants</label>
          <input
            type="number"
            min="4"
            value={form.maxParticipants}
            onChange={(e) => setForm({ ...form, maxParticipants: Number(e.target.value) })}
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm outline-none focus:border-cyan-400"
          />
        </div>
        <div>
          <label className="text-sm text-slate-300">Start Date</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm outline-none focus:border-cyan-400"
          />
        </div>
      </div>
      <button type="submit" className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
        Create Tournament
      </button>
    </form>
  );
}

export default TournamentForm;
