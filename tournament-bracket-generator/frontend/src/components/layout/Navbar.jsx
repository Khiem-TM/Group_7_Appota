import { Bell, Search } from "lucide-react";

function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Operations Center</p>
          <h1 className="font-display text-lg font-semibold text-slate-100">Tournament Bracket Generator</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 md:flex">
            <Search size={16} className="text-slate-400" />
            <input
              className="w-44 bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
              placeholder="Search tournaments..."
            />
          </div>
          <button className="relative rounded-xl border border-slate-700 bg-slate-900/70 p-2 text-slate-200 hover:border-cyan-400">
            <Bell size={18} />
            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-orange-500" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
