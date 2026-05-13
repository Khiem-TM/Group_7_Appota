import { Compass, Gauge, PlusSquare, UserCircle2 } from "lucide-react";
import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/dashboard", icon: Gauge, label: "Dashboard" },
  { to: "/explore", icon: Compass, label: "Explore" },
  { to: "/tournaments/new", icon: PlusSquare, label: "Create" },
  { to: "/profile", icon: UserCircle2, label: "Profile" }
];

function MobileNav({ basePath = "" }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-950/95 px-2 py-2 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const target = `${basePath}${tab.to}`;
          return (
            <NavLink
              key={tab.to}
              to={target}
              className={({ isActive }) =>
                `flex flex-col items-center rounded-xl py-2 text-[11px] transition ${
                  isActive ? "bg-slate-900 text-white" : "text-slate-400"
                }`
              }
            >
              <Icon size={17} className={"mb-1 " + "text-cyan-400"} />
              {tab.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileNav;
