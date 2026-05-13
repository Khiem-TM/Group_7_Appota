import { Compass, Gauge, PlusSquare, Trophy, UserCircle2 } from "lucide-react";
import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/app/dashboard", icon: Gauge, label: "Home" },
  { to: "/app/explore", icon: Compass, label: "Explore" },
  { to: "/app/tournaments/create", icon: PlusSquare, label: "Create" },
  { to: "/app/tournaments/nebula-open", icon: Trophy, label: "Bracket" },
  { to: "/app/profile", icon: UserCircle2, label: "Profile" }
];

function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-800 bg-ink/95 px-2 py-2 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center rounded-xl py-2 text-[11px] ${
                  isActive ? "text-cyan-300" : "text-slate-400"
                }`
              }
            >
              <Icon size={16} />
              {tab.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileNav;
