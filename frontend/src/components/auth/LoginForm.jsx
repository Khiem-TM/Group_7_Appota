import { LogIn, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/app/dashboard");
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {error}
        </p>
      ) : null}

      <div>
        <label className="text-xs uppercase tracking-[0.14em] text-on-surface-variant">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          placeholder="player@arenapro.com"
          className="mt-2 w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-base text-white outline-none transition placeholder:text-on-surface-variant/80 focus:border-primary-container"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase tracking-[0.14em] text-on-surface-variant">Password</label>
          <span className="text-sm text-on-surface-variant">Forgot password?</span>
        </div>
        <div className="relative mt-2">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="Enter your password"
            className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 pr-10 text-base text-white outline-none transition placeholder:text-on-surface-variant/80 focus:border-primary-container"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3 text-base font-semibold text-white hover:from-blue-400 hover:to-violet-400 disabled:opacity-60"
      >
        <LogIn size={17} />
        {loading ? "Signing in…" : "Login"}
      </button>

      <p className="text-center text-base text-on-surface-variant">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-medium text-primary-fixed-dim hover:text-primary-fixed">
          Register
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
