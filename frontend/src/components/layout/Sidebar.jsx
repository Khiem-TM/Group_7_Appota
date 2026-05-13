import { Trophy } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

function Sidebar({ basePath = "" }) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-outline-variant bg-surface-container-lowest lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-outline-variant px-5 py-4">
          <Link to="/" className="font-display text-2xl font-semibold text-primary-fixed">
            Arena Pro
          </Link>
        </div>

        <div className="flex-1 px-4 py-4">
          <NavLink
            to={`${basePath}/dashboard`}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-surface-bright/20 text-white"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded ${
                    isActive ? "bg-surface-bright/20 text-primary-fixed" : "text-on-surface-variant group-hover:text-primary-fixed"
                  }`}
                >
                  <Trophy size={14} />
                </span>
                <span className="text-[13px] font-medium">Your Tournaments</span>
              </>
            )}
          </NavLink>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;


