import { Compass, Gauge, PlusSquare, Settings, Trophy, UserCircle2 } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/app/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/app/explore", label: "Explore", icon: Compass },
  { to: "/app/tournaments/create", label: "Create", icon: PlusSquare },
  { to: "/app/tournaments/nebula-open", label: "Tournament", icon: Trophy },
  { to: "/app/tournaments/nebula-open/manage", label: "Manage", icon: Settings },
  { to: "/app/profile", label: "Profile", icon: UserCircle2 }
];

function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-gradient-to-b from-slate-950 to-slate-900 lg:block">
      <div className="flex h-full flex-col p-4">
        <div className="rounded-2xl border border-cyan-600/30 bg-cyan-950/30 p-4">
          <p className="font-display text-xl text-cyan-100">BRKT // HUB</p>
          <p className="mt-1 text-xs text-cyan-200/80">Build and run cups in minutes</p>
        </div>
        <nav className="mt-6 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-cyan-500/15 text-cyan-200 shadow-glow"
                      : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                  }`
                }
              >
                <Icon size={16} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
