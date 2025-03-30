import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login.js";
import Register from "./pages/register.js";
import UserDashboard from "./pages/userDashboard.js";



function App() {
  return (
    <Router>
      <Routes>
        {/* Default to login page */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        

      </Routes>
    </Router>
  );
}

export default App;
