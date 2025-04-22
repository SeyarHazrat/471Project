
// 30180289
// Seyar Ghulom Hazrat
// 30171176
// Abdullah Khan
// 301714465
// Abdu Rahman Ben Issa

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login.js";
import Register from "./pages/register.js";
import UserDashboard from "./pages/userDashboard.js";
import JobDetails from './components/jobDetails.js';
import SavedJobs from "./pages/SavedJobs.js";
import AdminDashboard from "./pages/AdminDashboard.js";
import AdminViewJobs from "./pages/AdminViewJobs.js";
import AdminViewApplications from "./pages/AdminViewApplications";
import CreateJob from "./pages/CreateJob.js";
import UserApplications from "./pages/userApplications.js";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default to login page */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/admin/view-jobs" element={<AdminViewJobs />} />
        <Route path="/admin/view-applications" element={<AdminViewApplications />} />
        <Route path="/admin/create-job" element={<CreateJob />} />
        <Route path="/user-applications" element={<UserApplications />} />

      </Routes>
    </Router>
  );
}

export default App;
