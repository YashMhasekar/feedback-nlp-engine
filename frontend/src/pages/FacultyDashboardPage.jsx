import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FacultyDashboard from '../components/FacultyDashboard';

const FacultyDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Pass user info and logout handler to the existing FacultyDashboard component
  return <FacultyDashboard user={user} onLogout={handleLogout} />;
};

export default FacultyDashboardPage;
