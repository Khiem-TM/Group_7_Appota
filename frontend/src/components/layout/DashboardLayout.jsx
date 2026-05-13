import { Search } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import MobileNav from "./MobileNav";
import Sidebar from "./Sidebar";

const titleMap = {
  dashboard: "Dashboard",
  explore: "Explore Tournaments",
  tournaments: "Tournaments",
  profile: "Profile"
};

function DashboardLayout() {
  const location = useLocation();
  const basePath = location.pathname.startsWith("/app") ? "/app" : "";
  const normalizedPath = location.pathname.replace(/^\/app/, "");
  const pageKey = normalizedPath.split("/").filter(Boolean)[0] || "dashboard";
  const pageTitle = titleMap[pageKey] || "Dashboard";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">
        <Sidebar basePath={basePath} />

        <div className="flex min-h-screen flex-1 flex-col pb-20 lg:pb-0">
          <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div>
                <h1 className="font-display text-xl font-semibold text-white">{pageTitle}</h1>
                <p className="text-xs text-slate-400">Tournament Bracket Generator</p>
              </div>

              <div className="hidden w-full max-w-sm items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 md:flex">
                <Search size={16} className="text-slate-400" />
                <input
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  placeholder="Search tournaments, teams..."
                />
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-sm font-semibold text-cyan-400">
                U
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
