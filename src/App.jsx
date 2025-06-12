import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/main/DashboardPage';
import UserPage from './pages/main/mantainence/UsersPage';
import ContentManagementPage from './pages/main/mantainence/ContentManagementPage';
import DriverPointsAssignmentPage from './pages/main/reviewer/DriverPointsAssignmentPage';
import TeamPointsAssignmentPage from './pages/main/reviewer/TeamPointsAssignmentPage';
import MVPPage from './pages/main/player/MvpPage';
import ResendVerificationPage from './pages/auth/ResendActivationPage';
import LeaguesPage from './pages/main/player/LeaguePage';
import JoinLeaguePage from './pages/main/player/JoinLeaguePage';
import ActivateAccountPage from './pages/auth/AuthenticationPage';
import GamePage from './pages/main/player/GamePage';

import GuideLayout from './docs/GuideLayout';
import Introduction from './docs/Introduction';
import FAQ from './docs/FAQ';
import AdminGuide from './docs/AdminGuide';
import ReviewerGuide from './docs/ReviewerGuide';
import PlayerGuide from './docs/PlayerGuide';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/resend-activation" element={<ResendVerificationPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin/mantainence/users" element={<UserPage />} />
        <Route path="/admin/mantainence/content" element={<ContentManagementPage />} />
        <Route path="/reviewer/assign/drivers" element={<DriverPointsAssignmentPage />} />
        <Route path="/reviewer/assign/teams" element={<TeamPointsAssignmentPage />} />
        <Route path="/player/mvps" element={<MVPPage />} />
        <Route path="/player/leagues" element={<LeaguesPage />} />
        <Route path="/join-league/:id" element={<JoinLeaguePage />} />
        <Route path="/activate/:token" element={<ActivateAccountPage />} />
        <Route path="/player/leagues/:leagueId/lineup" element={<GamePage />} />

        <Route path="/docs" element={<GuideLayout />}>
          <Route index element={<Navigate to="introduction" replace />} />
          <Route path="introduction" element={<Introduction />} />
          <Route path="how-to/admin" element={<AdminGuide />} />
          <Route path="how-to/reviewer" element={<ReviewerGuide />} />
          <Route path="how-to/player" element={<PlayerGuide />} />
          <Route path="faq" element={<FAQ />} />
        </Route>



        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
