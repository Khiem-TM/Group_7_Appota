import Navbar from "../components/layout/Navbar";
import RegisterForm from "../components/auth/RegisterForm";

function RegisterPage() {
  return (
    <div className="min-h-screen bg-surface text-white">
      <Navbar />

      <main className="mx-auto flex max-w-6xl items-center px-4 py-10 sm:px-6 lg:min-h-[calc(100vh-64px)] lg:px-8 lg:py-12">
        <div className="w-full overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-low lg:grid lg:grid-cols-2">
          <section className="hidden border-r border-outline-variant bg-auth-violet p-10 lg:flex lg:flex-col lg:justify-end">
            <h2 className="font-display text-5xl font-semibold text-violet-300">Join Arena Pro</h2>
            <p className="mt-3 max-w-md text-2xl leading-relaxed text-on-surface-variant">
              Set up your organizer account and launch your first tournament in minutes.
            </p>
          </section>

          <section className="p-6 sm:p-8 lg:p-10">
            <h1 className="font-display text-4xl font-semibold text-white">Create Account</h1>
            <p className="mt-2 text-lg text-on-surface-variant">Build brackets, run events, and track leaderboards.</p>
            <div className="mt-8">
              <RegisterForm />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default RegisterPage;

