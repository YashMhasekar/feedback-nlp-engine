import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Homepage from "./components/Homepage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboardNew";
import FacultyDashboardPage from "./pages/FacultyDashboardPage";
import StudentDashboard from "./pages/StudentDashboard";
import DebugAuth from "./pages/DebugAuth";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/debug-auth" element={<DebugAuth />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/faculty"
              element={
                <ProtectedRoute allowedRoles={["faculty"]}>
                  <FacultyDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Legacy route redirect */}
            <Route
              path="/faculty-dashboard"
              element={<Navigate to="/dashboard/faculty" replace />}
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
