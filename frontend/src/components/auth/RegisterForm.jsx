import { UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(form.email, form.username, form.password, "HOST");
      navigate("/app/dashboard");
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        setError(detail.map((d) => d.msg).join(" "));
      } else {
        setError(typeof detail === "string" ? detail : "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {error}
        </p>
      ) : null}

      <div>
        <label className="text-xs uppercase tracking-[0.14em] text-on-surface-variant">Username</label>
        <input
          type="text"
          required
          value={form.username}
          onChange={(event) => setForm({ ...form, username: event.target.value })}
          placeholder="arena_manager"
          className="mt-2 w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-base text-white outline-none placeholder:text-on-surface-variant/80 focus:border-primary-container"
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-[0.14em] text-on-surface-variant">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-base text-white outline-none placeholder:text-on-surface-variant/80 focus:border-primary-container"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs uppercase tracking-[0.14em] text-on-surface-variant">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            placeholder="Create password"
            className="mt-2 w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-base text-white outline-none placeholder:text-on-surface-variant/80 focus:border-primary-container"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-[0.14em] text-on-surface-variant">Confirm password</label>
          <input
            type="password"
            required
            value={form.confirmPassword}
            onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
            placeholder="Re-enter password"
            className="mt-2 w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-base text-white outline-none placeholder:text-on-surface-variant/80 focus:border-primary-container"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 pt-1 text-sm text-on-surface-variant">
        <input
          type="checkbox"
          required
          checked={form.acceptedTerms}
          onChange={(event) => setForm({ ...form, acceptedTerms: event.target.checked })}
          className="h-4 w-4 rounded border-outline-variant bg-surface-container-low text-primary-fixed-dim focus:ring-primary-container"
        />
        I agree to the Terms and Privacy Policy.
      </label>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3 text-base font-semibold text-white hover:from-blue-400 hover:to-violet-400 disabled:opacity-60"
      >
        <UserPlus size={17} />
        {loading ? "Creating account…" : "Register"}
      </button>

      <p className="text-center text-base text-on-surface-variant">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary-fixed-dim hover:text-primary-fixed">
          Login
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
