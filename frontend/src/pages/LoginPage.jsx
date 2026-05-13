import { Link } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-grid p-4">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl font-bold text-white">Welcome Back</h1>
        <p className="mb-5 mt-1 text-sm text-slate-400">Sign in to continue managing your tournaments.</p>
        <LoginForm />
        <p className="mt-4 text-sm text-slate-400">
          New here? <Link to="/register" className="text-cyan-300 hover:underline">Create account</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
