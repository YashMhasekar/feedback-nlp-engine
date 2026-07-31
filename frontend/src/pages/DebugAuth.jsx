import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DebugAuth = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [localStorageUser, setLocalStorageUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setLocalStorageUser(JSON.parse(storedUser));
    }
  }, []);

  const handleNavigate = (path) => {
    console.log('Manually navigating to:', path);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Auth Debug Page</h1>

        {/* Context User */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">User from Context</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
          {user && (
            <div className="mt-4">
              <p className="font-semibold">Role: <span className="text-blue-600">{user.role}</span></p>
              <p className="font-semibold">Is Admin: <span className="text-blue-600">{user.role === 'admin' ? 'YES' : 'NO'}</span></p>
            </div>
          )}
        </div>

        {/* LocalStorage User */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">User from localStorage</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(localStorageUser, null, 2)}
          </pre>
          {localStorageUser && (
            <div className="mt-4">
              <p className="font-semibold">Role: <span className="text-blue-600">{localStorageUser.role}</span></p>
              <p className="font-semibold">Is Admin: <span className="text-blue-600">{localStorageUser.role === 'admin' ? 'YES' : 'NO'}</span></p>
            </div>
          )}
        </div>

        {/* Token */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Token</h2>
          <p className="text-sm break-all bg-gray-100 p-4 rounded">
            {token || 'No token'}
          </p>
        </div>

        {/* Navigation Tests */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Navigation Tests</h2>
          <div className="space-y-2">
            <button
              onClick={() => handleNavigate('/dashboard/admin')}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Navigate to Admin Dashboard
            </button>
            <button
              onClick={() => handleNavigate('/dashboard/faculty')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Navigate to Faculty Dashboard
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear Storage & Reload
            </button>
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold mb-4 text-yellow-800">Recommendations</h2>
          {user && user.role === 'admin' && (
            <p className="text-yellow-800">
              ✅ You are logged in as ADMIN. You should be able to access /dashboard/admin
            </p>
          )}
          {user && user.role === 'faculty' && (
            <p className="text-yellow-800">
              ✅ You are logged in as FACULTY. You should be able to access /dashboard/faculty
            </p>
          )}
          {!user && (
            <p className="text-yellow-800">
              ❌ No user logged in. Please login first.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebugAuth;
