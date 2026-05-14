import { CircleUserRound, LogOut, Search, UserRound } from "lucide-react";
import NotificationBell from "../common/NotificationBell";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { searchUsers } from "../../api/users";
import MobileNav from "./MobileNav";
import Sidebar from "./Sidebar";

function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-on-surface-variant">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  const basePath = location.pathname.startsWith("/app") ? "/app" : "";
  const hideSidebar = location.pathname.startsWith(`${basePath}/tournaments/`);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const query = searchQuery.trim();
    if (query.length < 2) {
      setUserResults([]);
      setSearchingUsers(false);
      return;
    }

    let cancelled = false;
    setSearchingUsers(true);
    const timeoutId = window.setTimeout(async () => {
      try {
        const results = await searchUsers(query, 10);
        if (!cancelled) {
          setUserResults(results);
        }
      } catch {
        if (!cancelled) {
          setUserResults([]);
        }
      } finally {
        if (!cancelled) {
          setSearchingUsers(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const openUserProfile = (profileUserId) => {
    setSearchQuery("");
    setUserResults([]);
    setShowSearchResults(false);
    navigate(`/app/users/${profileUserId}`);
  };

  return (
    <div className="min-h-screen bg-surface text-white">
      <div className="flex min-h-screen">
        {!hideSidebar ? <Sidebar basePath={basePath} /> : null}

        <div className="flex min-h-screen flex-1 flex-col pb-20 lg:pb-0">
          <header className="sticky top-0 z-20 border-b border-outline-variant bg-surface/95 backdrop-blur">
            <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div ref={searchRef} className="relative hidden w-full max-w-md md:block">
                <div className="flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-low px-3 py-1.5">
                  <Search size={16} className="text-on-surface-variant/80" />
                  <input
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                      setShowSearchResults(true);
                    }}
                    onFocus={() => setShowSearchResults(true)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && userResults[0]) {
                        openUserProfile(userResults[0].id);
                      }
                    }}
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-on-surface-variant/80"
                    placeholder="Search users..."
                  />
                </div>
                {showSearchResults && searchQuery.trim().length >= 2 ? (
                  <div className="absolute left-0 top-11 z-30 w-full overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low shadow-2xl">
                    <div className="border-b border-outline-variant px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
                      Users
                    </div>
                    {searchingUsers ? (
                      <p className="px-3 py-3 text-sm text-on-surface-variant">Searching...</p>
                    ) : userResults.length > 0 ? (
                      userResults.map((result) => (
                        <button
                          key={result.id}
                          type="button"
                          onClick={() => openUserProfile(result.id)}
                          className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-surface-container-high"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-container text-sm font-bold text-on-primary">
                            {result.avatar_url ? (
                              <img src={result.avatar_url} alt={result.username} className="h-full w-full object-cover" />
                            ) : (
                              <UserRound size={17} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">@{result.username}</p>
                            {result.full_name ? <p className="truncate text-xs text-on-surface-variant">{result.full_name}</p> : null}
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-3 text-sm text-on-surface-variant">No users found.</p>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="ml-auto flex items-center gap-2">
                {user ? (
                  <span className="hidden text-sm text-on-surface-variant sm:block">
                    @{user.username}
                  </span>
                ) : null}
                <NotificationBell />
                <button
                  type="button"
                  onClick={() => navigate("/app/profile")}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-surface-container-low text-on-surface-variant hover:text-white"
                >
                  <CircleUserRound size={15} />
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Logout"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant bg-surface-container-low text-on-surface-variant hover:text-red-400"
                >
                  <LogOut size={15} />
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
