import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Redirect to login if no user data
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  // If no user, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  // Format user's full name (no prefix)
  const getUserDisplayName = () => {
    if (!user) return 'Admin';
    
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    
    // Debug logging
    console.log('Admin User object:', user);
    console.log('First Name:', firstName);
    console.log('Last Name:', lastName);
    console.log('Full Name:', fullName);
    
    return fullName || 'Admin';
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return 'AD';
    
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    
    return `${firstInitial}${lastInitial}` || 'AD';
  };

  const adminName = getUserDisplayName();
  const userInitials = getUserInitials();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-b-2 border-indigo-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            {/* Left Section with Logo */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLogoClick}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                  <img 
                    src="/imagelogo.jpeg" 
                    alt="Logo" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <svg 
                    className="w-7 h-7 text-white hidden" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Feedback Analyzer
                  </h1>
                  <p className="text-xs text-gray-600 font-medium">Admin Portal</p>
                </div>
              </button>
              <div className="h-10 w-px bg-indigo-200"></div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Welcome back, {adminName}</h2>
                <p className="text-gray-600 text-sm font-medium">Manage your system and users</p>
              </div>
            </div>

            {/* Right Section - Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-3 pl-4 pr-3 py-2.5 hover:bg-white/60 rounded-xl transition-all hover:shadow-md"
              >
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-gray-800">{adminName}</p>
                  <p className="text-xs text-gray-600 font-medium capitalize">{user.role}</p>
                </div>
                <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {userInitials}
                </div>
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border-2 border-indigo-100 py-2 z-50 animate-fade-in">
                  <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <p className="text-base font-bold text-gray-800">{adminName}</p>
                    <p className="text-xs text-gray-600 font-medium mt-1">{user.email}</p>
                    {user.department && (
                      <p className="text-xs text-gray-500 font-medium mt-1">📚 {user.department}</p>
                    )}
                    {user.employee_id && (
                      <p className="text-xs text-gray-500 font-medium mt-1">🆔 {user.employee_id}</p>
                    )}
                  </div>
                  <button 
                    onClick={handleLogoClick}
                    className="w-full flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-indigo-50 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span className="font-medium">Go to Homepage</span>
                  </button>
                  <hr className="my-2 border-gray-200" />
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg border-2 border-indigo-100 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                Admin Dashboard
              </h3>
              <p className="text-gray-700 text-base font-medium">Manage system settings and monitor all activities</p>
            </div>
          </div>
        </div>

        {/* User Information Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Full Name</p>
              <p className="text-lg font-bold text-gray-900">{user.first_name} {user.last_name}</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Email Address</p>
              <p className="text-lg font-bold text-gray-900">{user.email}</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Department</p>
              <p className="text-lg font-bold text-gray-900">{user.department || 'Not Specified'}</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-200">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Employee ID</p>
              <p className="text-lg font-bold text-gray-900">{user.employee_id || 'Not Specified'}</p>
            </div>
            
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-5 border border-violet-200 md:col-span-2">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Role</p>
              <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-base font-bold shadow-md">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {user.role.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Admin Features Card */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-blue-900">Admin Features Coming Soon</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: '👥', title: 'User Management', desc: 'Manage faculty and admin accounts' },
              { icon: '📊', title: 'System Reports', desc: 'Generate comprehensive analytics' },
              { icon: '📈', title: 'Trend Analytics', desc: 'View department-wide insights' },
              { icon: '⚙️', title: 'System Settings', desc: 'Configure application settings' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white rounded-xl p-5 border border-blue-200 hover:shadow-md transition-all">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{feature.icon}</span>
                  <div>
                    <p className="font-bold text-gray-900">{feature.title}</p>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
