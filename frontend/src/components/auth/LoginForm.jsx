import { LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="text-xs uppercase tracking-[0.14em] text-slate-400">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          placeholder="player@arenapro.com"
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase tracking-[0.14em] text-slate-400">Password</label>
          <span className="text-sm text-slate-300">Forgot password?</span>
        </div>
        <input
          type="password"
          required
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          placeholder="Enter your password"
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
        />
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3 text-base font-semibold text-white hover:from-blue-400 hover:to-violet-400"
      >
        <LogIn size={17} />
        Login
      </button>

      <p className="text-center text-base text-slate-400">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-medium text-cyan-400 hover:text-cyan-300">
          Register
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
