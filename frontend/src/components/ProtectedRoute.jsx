import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute - User:', user);
  console.log('ProtectedRoute - Loading:', loading);
  console.log('ProtectedRoute - Allowed Roles:', allowedRoles);

  if (loading) {
    console.log('ProtectedRoute - Still loading, showing spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute - No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('ProtectedRoute - User role not allowed:', user.role);
    console.log('ProtectedRoute - Redirecting based on role');
    // Redirect to appropriate dashboard if user doesn't have permission
    if (user.role === 'admin') {
      console.log('ProtectedRoute - Redirecting admin to /dashboard/admin');
      return <Navigate to="/dashboard/admin" replace />;
    } else {
      console.log('ProtectedRoute - Redirecting faculty to /dashboard/faculty');
      return <Navigate to="/dashboard/faculty" replace />;
    }
  }

  console.log('ProtectedRoute - Access granted, rendering children');
  return children;
};

export default ProtectedRoute;
