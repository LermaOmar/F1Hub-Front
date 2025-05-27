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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin/mantainence/users" element={<UserPage />} />
        <Route path="/admin/mantainence/content" element={<ContentManagementPage/>} />
        <Route path="/reviewer/assign/drivers" element={<DriverPointsAssignmentPage/>} />
        <Route path="/reviewer/assign/teams" element={<TeamPointsAssignmentPage/>} />
        <Route path="/player/mvps" element={<MVPPage/>} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
