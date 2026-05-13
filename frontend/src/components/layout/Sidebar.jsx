import { Compass, Gauge, PlusSquare, UserCircle2 } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/explore", label: "Explore Tournaments", icon: Compass },
  { to: "/tournaments/create", label: "Create Tournament", icon: PlusSquare },
  { to: "/profile", label: "Profile", icon: UserCircle2 }
];

function Sidebar({ basePath = "" }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-800 bg-slate-950 lg:block">
      <div className="flex h-full flex-col p-5">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-400">Control Room</p>
          <h2 className="mt-2 font-display text-xl font-semibold text-white">Tournament Hub</h2>
          <p className="mt-1 text-xs text-slate-400">Manage brackets, rounds, and participants</p>
        </div>

        <nav className="mt-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const target = `${basePath}${item.to}`;
            return (
              <NavLink
                key={item.to}
                to={target}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    isActive
                      ? "border border-violet-500/40 bg-violet-500/10 text-white"
                      : "border border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-900 hover:text-white"
                  }`
                }
              >
                <Icon size={17} className="text-cyan-400" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
