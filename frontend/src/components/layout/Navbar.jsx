import { Compass, Home, LogIn, Trophy, UserPlus } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/explore", label: "Explore", icon: Compass },
    { to: "/login", label: "Login", icon: LogIn },
    { to: "/register", label: "Register", icon: UserPlus }
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-outline-variant bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-white">
          <div className="rounded-xl bg-violet-500/20 p-2 text-violet-300">
            <Trophy size={18} />
          </div>
          <span className="font-display text-lg font-semibold tracking-wide">Tournament Bracket Generator</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-surface-container-highest text-white"
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-white"
                  }`
                }
              >
                <Icon size={15} />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

