import { Bell, CircleUserRound, Search } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import MobileNav from "./MobileNav";
import Sidebar from "./Sidebar";

function DashboardLayout() {
  const location = useLocation();
  const basePath = location.pathname.startsWith("/app") ? "/app" : "";
  const hideSidebar = location.pathname.startsWith(`${basePath}/tournaments/`);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        {!hideSidebar ? <Sidebar basePath={basePath} /> : null}

        <div className="flex min-h-screen flex-1 flex-col pb-20 lg:pb-0">
          <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
            <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="hidden w-full max-w-md items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 md:flex">
                <Search size={16} className="text-slate-500" />
                <input
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  placeholder="Search events, players..."
                />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                >
                  <Bell size={15} />
                </button>
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
                >
                  <CircleUserRound size={15} />
                </button>
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>

      <MobileNav basePath={basePath} />
    </div>
  );
}

export default DashboardLayout;
