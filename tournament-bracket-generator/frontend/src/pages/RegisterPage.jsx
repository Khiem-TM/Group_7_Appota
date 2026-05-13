import { Link } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";

function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-grid p-4">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl font-bold text-white">Create Organizer Account</h1>
        <p className="mb-5 mt-1 text-sm text-slate-400">Start building brackets and hosting events today.</p>
        <RegisterForm />
        <p className="mt-4 text-sm text-slate-400">
          Already registered? <Link to="/login" className="text-cyan-300 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
