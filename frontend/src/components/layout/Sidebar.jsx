import { Trophy } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

function Sidebar({ basePath = "" }) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-[#060b16] lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-800 px-5 py-4">
          <Link to="/" className="font-display text-2xl font-semibold text-cyan-300">
            Arena Pro
          </Link>
        </div>

        <div className="flex-1 px-4 py-4">
          <NavLink
            to={`${basePath}/dashboard`}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-slate-200/10 text-white"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded ${
                    isActive ? "bg-slate-100/10 text-cyan-300" : "text-slate-400 group-hover:text-cyan-300"
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
