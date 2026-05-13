import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-hero-grid">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col pb-20 lg:pb-0">
          <Navbar />
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}

export default DashboardLayout;
