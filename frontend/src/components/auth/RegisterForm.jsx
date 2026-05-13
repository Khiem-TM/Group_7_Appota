import { useState } from "react";

function RegisterForm() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(`Mock registration created for ${form.username}`);
  };

  return (
    <form onSubmit={handleSubmit} className="soft-panel space-y-4 p-6">
      <div>
        <label className="text-sm text-slate-300">Username</label>
        <input
          type="text"
          required
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm outline-none focus:border-cyan-400"
          placeholder="pro_manager"
        />
      </div>
      <div>
        <label className="text-sm text-slate-300">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm outline-none focus:border-cyan-400"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="text-sm text-slate-300">Password</label>
        <input
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm outline-none focus:border-cyan-400"
          placeholder="Create password"
        />
      </div>
      <button type="submit" className="w-full rounded-xl bg-orange-500 px-4 py-2 font-semibold text-slate-950 hover:bg-orange-400">
        Create Account
      </button>
    </form>
  );
}

export default RegisterForm;
