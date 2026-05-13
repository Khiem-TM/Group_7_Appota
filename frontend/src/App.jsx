import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ExploreTournamentsPage from "./pages/ExploreTournamentsPage";
import CreateTournamentPage from "./pages/CreateTournamentPage";
import TournamentDetailPage from "./pages/TournamentDetailPage";
import ManageTournamentPage from "./pages/ManageTournamentPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/explore" element={<Navigate to="/app/explore" replace />} />
      <Route path="/tournaments/new" element={<Navigate to="/app/tournaments/new" replace />} />
      <Route path="/tournaments/create" element={<Navigate to="/app/tournaments/new" replace />} />

      <Route path="/app" element={<DashboardLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="explore" element={<ExploreTournamentsPage />} />
        <Route path="tournaments/new" element={<CreateTournamentPage />} />
        <Route path="tournaments/create" element={<Navigate to="/app/tournaments/new" replace />} />
        <Route path="tournaments/:id" element={<TournamentDetailPage />} />
        <Route path="tournaments/:id/manage" element={<ManageTournamentPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
