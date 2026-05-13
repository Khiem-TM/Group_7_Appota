import Navbar from "../components/layout/Navbar";
import LoginForm from "../components/auth/LoginForm";

function LoginPage() {
  return (
    <div className="min-h-screen bg-surface text-white">
      <Navbar />

      <main className="mx-auto flex max-w-6xl items-center px-4 py-10 sm:px-6 lg:min-h-[calc(100vh-64px)] lg:px-8 lg:py-12">
        <div className="w-full overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-low lg:grid lg:grid-cols-2">
          <section className="hidden border-r border-outline-variant bg-auth-cyan p-10 lg:flex lg:flex-col lg:justify-end">
            <h2 className="font-display text-5xl font-semibold text-primary-fixed">Arena Pro</h2>
            <p className="mt-3 max-w-md text-2xl leading-relaxed text-on-surface-variant">
              The elite management platform for competitive esports tournaments and brackets.
            </p>
          </section>

          <section className="p-6 sm:p-8 lg:p-10">
            <h1 className="font-display text-4xl font-semibold text-white">Welcome Back</h1>
            <p className="mt-2 text-lg text-on-surface-variant">Sign in to manage your tournaments.</p>
            <div className="mt-8">
              <LoginForm />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;

