import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import AlertsManagement from '../components/AlertsManagement';

const API_BASE_URL = 'http://localhost:5002';

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;
    
    const incrementTime = (duration / end) * 1;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <span>{count}</span>;
};

const AdminDashboardNew = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState(null);
  const [faculty, setFaculty] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [trends, setTrends] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Redirect to login if no user data
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const [statsRes, facultyRes, feedbacksRes, alertsRes, trendsRes, deptsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/admin/stats`, config).catch(err => ({ data: { stats: {}, recent_activity: [], sentiment_distribution: {}, department_sentiment: {} } })),
        axios.get(`${API_BASE_URL}/api/admin/faculty`, config).catch(err => ({ data: { faculty: [] } })),
        axios.get(`${API_BASE_URL}/api/admin/feedbacks?limit=50`, config).catch(err => ({ data: { feedbacks: [] } })),
        axios.get(`${API_BASE_URL}/api/admin/alerts`, config).catch(err => ({ data: { alerts: [] } })),
        axios.get(`${API_BASE_URL}/api/admin/trends`, config).catch(err => ({ data: { sentiment_trend: {}, category_distribution: {} } })),
        axios.get(`${API_BASE_URL}/api/admin/departments`, config).catch(err => ({ data: { departments: [] } }))
      ]);

      setStats(statsRes.data.stats || {});
      setFaculty(facultyRes.data.faculty || []);
      setFeedbacks(feedbacksRes.data.feedbacks || []);
      setAlerts(alertsRes.data.alerts || []);
      setTrends(trendsRes.data || {});
      setDepartments(deptsRes.data.departments || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      // Show error notification
      showNotification('Error loading dashboard data. Please refresh.', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-24 right-8 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 animate-slide-in ${
      type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-pink-600'
    } text-white`;
    notification.innerHTML = `
      <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${type === 'success' 
            ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />'
            : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />'
          }
        </svg>
      </div>
      <p class="font-semibold">${message}</p>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
      }
    }, 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const getUserDisplayName = () => {
    if (!user) return 'Admin';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Admin';
  };

  const getUserInitials = () => {
    if (!user) return 'AD';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'AD';
  };

  if (!user) return null;

  const adminName = getUserDisplayName();
  const userInitials = getUserInitials();

  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         f.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = !filterDepartment || f.department === filterDepartment;
    return matchesSearch && matchesDept;
  });

  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: '📊', gradient: 'from-blue-500 to-cyan-500' },
    { id: 'faculty', label: 'Faculty Management', icon: '👥', gradient: 'from-purple-500 to-pink-500' },
    { id: 'feedbacks', label: 'Feedback Monitor', icon: '📝', gradient: 'from-green-500 to-emerald-500' },
    { id: 'alerts', label: 'Alert System', icon: '🚨', gradient: 'from-red-500 to-orange-500' },
    { id: 'trends', label: 'Analytics & Reports', icon: '📈', gradient: 'from-indigo-500 to-purple-500' },
    { id: 'settings', label: 'System Settings', icon: '⚙️', gradient: 'from-gray-600 to-gray-700' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
            <svg className="w-10 h-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-xl font-bold text-gray-800 mb-2">Loading Admin Dashboard...</p>
          <p className="text-gray-500">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Vertical Sidebar - Light Theme - Responsive */}
      <aside className={`${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${
        isSidebarOpen ? 'w-72' : 'lg:w-20 w-72'
      } fixed lg:relative h-full bg-white border-r border-gray-200 transition-all duration-300 flex flex-col shadow-xl z-20`}>
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity w-full"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ring-4 ring-blue-100">
              <img 
                src="/imagelogo.jpeg" 
                alt="Logo" 
                className="w-full h-full object-cover rounded-2xl"
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
            {isSidebarOpen && (
              <div className="flex-1">
                <h1 className="text-lg font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Portal
                </h1>
                <p className="text-xs text-gray-600 font-semibold">Control Center</p>
              </div>
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 px-3 overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative overflow-hidden ${
                  activeTab === item.id
                    ? `bg-gradient-to-r ${item.gradient} shadow-lg scale-105 text-white`
                    : 'hover:bg-gray-100 hover:scale-102 text-gray-700'
                }`}
              >
                {activeTab === item.id && (
                  <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                )}
                <span className="text-2xl relative z-10">{item.icon}</span>
                {isSidebarOpen && (
                  <span className={`font-semibold text-sm relative z-10 ${
                    activeTab === item.id ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    {item.label}
                  </span>
                )}
                {activeTab === item.id && isSidebarOpen && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse relative z-10"></div>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-full flex items-center space-x-3 p-3 rounded-2xl hover:bg-white transition-all duration-200 hover:shadow-md"
            >
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0 ring-4 ring-blue-100">
                {userInitials}
              </div>
              {isSidebarOpen && (
                <>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-bold text-gray-800 truncate">{adminName}</p>
                    <p className="text-xs text-gray-600 font-semibold capitalize">{user.role}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>

            {showProfileDropdown && isSidebarOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 py-2 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <p className="text-sm font-bold text-gray-800">{adminName}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{user.email}</p>
                </div>
                <button 
                  onClick={handleLogoClick}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition-colors group"
                >
                  <svg className="w-4 h-4 mr-2 text-blue-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="font-semibold">Homepage</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold group"
                >
                  <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Toggle Sidebar Button - Desktop */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-24 w-8 h-8 bg-white border-2 border-gray-200 rounded-full items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all z-30 group"
        >
          <svg className={`w-4 h-4 text-gray-600 group-hover:text-blue-600 transition-all ${isSidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar w-full">
        {/* Top Header Bar - Responsive */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-5">
            <div className="flex items-center justify-between">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="flex-1 lg:flex-none ml-4 lg:ml-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5 hidden sm:block">
                  Welcome back, {adminName}
                </p>
              </div>

              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* System Status - Hidden on mobile */}
                <div className="hidden md:flex items-center space-x-2 px-3 sm:px-4 py-2 bg-green-50 rounded-xl border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-green-700">Online</span>
                </div>

                {/* Refresh Button */}
                <button 
                  onClick={fetchData}
                  disabled={loading}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition-all disabled:opacity-50"
                  title="Refresh Data"
                >
                  <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area - Responsive Padding */}
        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === 'overview' && <OverviewTab stats={stats} />}
          {activeTab === 'faculty' && (
            <FacultyTab 
              faculty={filteredFaculty}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterDepartment={filterDepartment}
              setFilterDepartment={setFilterDepartment}
              departments={departments}
              onRefresh={fetchData}
            />
          )}
          {activeTab === 'feedbacks' && <FeedbacksTab feedbacks={feedbacks} departments={departments} />}
          {activeTab === 'alerts' && <AlertsManagement />}
          {activeTab === 'trends' && <TrendsTab trends={trends} stats={stats} />}
          {activeTab === 'settings' && <SettingsTab user={user} />}
        </div>
      </main>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Faculty',
      value: stats?.total_faculty || 0,
      icon: '👨‍🏫',
      gradient: 'from-blue-500 via-blue-600 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
      iconBg: 'from-blue-500 to-cyan-500',
      change: stats?.total_faculty > 0 ? `${stats.total_faculty} Active` : 'No Data',
      changeType: 'positive'
    },
    {
      title: 'Feedbacks Processed',
      value: stats?.total_feedbacks || 0,
      icon: '📝',
      gradient: 'from-green-500 via-emerald-600 to-teal-600',
      bgGradient: 'from-green-50 to-emerald-50',
      iconBg: 'from-green-500 to-emerald-500',
      change: stats?.total_feedbacks > 0 ? `${stats.total_feedbacks} Total` : 'No Data',
      changeType: 'positive'
    },
    {
      title: 'Active Departments',
      value: stats?.active_departments || 0,
      icon: '🏢',
      gradient: 'from-purple-500 via-violet-600 to-indigo-600',
      bgGradient: 'from-purple-50 to-indigo-50',
      iconBg: 'from-purple-500 to-indigo-500',
      change: stats?.active_departments > 0 ? `${stats.active_departments} Depts` : 'No Data',
      changeType: 'positive'
    },
    {
      title: 'Critical Alerts',
      value: stats?.alerts_count || 0,
      icon: '🚨',
      gradient: 'from-red-500 via-rose-600 to-pink-600',
      bgGradient: 'from-red-50 to-pink-50',
      iconBg: 'from-red-500 to-pink-500',
      change: stats?.alerts_count > 0 ? 'Needs Attention' : 'All Clear',
      changeType: stats?.alerts_count > 0 ? 'negative' : 'positive'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, index) => (
          <div 
            key={index} 
            className="group relative bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 border border-gray-200 overflow-hidden hover:-translate-y-1"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${card.iconBg} rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  {card.icon}
                </div>
                <span className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-full shadow-sm ${
                  card.changeType === 'positive' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {card.change}
                </span>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm font-semibold mb-1 sm:mb-2 group-hover:text-gray-700">{card.title}</p>
              <p className={`text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                <AnimatedCounter value={card.value} />
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-2xl"></div>
          </div>
        ))}
      </div>

      {/* Charts Row - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <span className="text-xl">📊</span>
              </div>
              Sentiment Overview
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Positive', value: '68%', color: 'from-green-500 to-emerald-500', icon: '😊' },
              { label: 'Neutral', value: '22%', color: 'from-yellow-500 to-orange-500', icon: '😐' },
              { label: 'Negative', value: '10%', color: 'from-red-500 to-pink-500', icon: '😟' }
            ].map((sentiment, idx) => (
              <div key={idx} className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-200">
                <div className="text-4xl mb-2">{sentiment.icon}</div>
                <p className={`text-3xl font-black bg-gradient-to-r ${sentiment.color} bg-clip-text text-transparent mb-1`}>
                  {sentiment.value}
                </p>
                <p className="text-xs font-semibold text-gray-600">{sentiment.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <span className="text-xl">🏢</span>
              </div>
              Top Departments
            </h3>
          </div>
          <div className="space-y-4">
            {[
              { dept: 'Computer Science', score: 92, color: 'from-blue-500 to-cyan-500', icon: '💻' },
              { dept: 'Mathematics', score: 88, color: 'from-purple-500 to-pink-500', icon: '📐' },
              { dept: 'Physics', score: 85, color: 'from-green-500 to-emerald-500', icon: '⚛️' },
              { dept: 'Chemistry', score: 82, color: 'from-orange-500 to-red-500', icon: '🧪' }
            ].map((item, idx) => (
              <div key={idx} className="group p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-bold text-gray-800">{item.dept}</span>
                  </div>
                  <span className={`text-2xl font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                    {item.score}
                  </span>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out shadow-lg`}
                    style={{width: `${item.score}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <span className="text-xl">⏱️</span>
            </div>
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              { type: 'feedback', dept: 'Computer Science', sentiment: 'Positive', time: '2 mins ago', icon: '📝', color: 'from-green-500 to-emerald-500' },
              { type: 'alert', dept: 'Mathematics', sentiment: 'Flagged', time: '15 mins ago', icon: '🚨', color: 'from-red-500 to-pink-500' },
              { type: 'faculty', dept: 'Physics', sentiment: 'New Member', time: '1 hour ago', icon: '👤', color: 'from-blue-500 to-cyan-500' }
            ].map((activity, idx) => (
              <div key={idx} className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
                <div className={`w-12 h-12 bg-gradient-to-br ${activity.color} rounded-xl flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 mb-0.5">
                    {activity.type === 'feedback' ? 'New feedback analyzed' : 
                     activity.type === 'alert' ? 'Critical alert generated' : 
                     'Faculty member added'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">{activity.dept}</span> • {activity.sentiment}
                  </p>
                </div>
                <span className="text-xs text-gray-500 font-medium">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-xl p-8 text-white">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <span className="text-2xl mr-2">⚡</span>
            Quick Actions
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Add Faculty', icon: '👥' },
              { label: 'Upload Feedback', icon: '📤' },
              { label: 'Generate Report', icon: '📊' },
              { label: 'System Settings', icon: '⚙️' }
            ].map((action, idx) => (
              <button 
                key={idx}
                className="w-full flex items-center space-x-3 p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-200 border border-white/20 hover:scale-105"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="font-semibold">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Faculty Tab Component
const FacultyTab = ({ faculty, searchTerm, setSearchTerm, filterDepartment, setFilterDepartment, departments, onRefresh }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Search and Filter Bar - Responsive */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-gray-200">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-3.5 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-sm sm:text-base"
            />
          </div>

          {/* Filter and Add Button Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="flex-1 px-4 py-3 sm:py-3.5 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium text-sm sm:text-base"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <button className="px-6 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl sm:rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-200 font-bold flex items-center justify-center space-x-2 shadow-lg text-sm sm:text-base">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Faculty</span>
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 font-medium">
            Showing <span className="font-bold text-gray-800">{faculty.length}</span> faculty member{faculty.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Faculty Cards Grid - Responsive */}
      {faculty.length === 0 ? (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-200 text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-4xl sm:text-5xl mx-auto mb-4 sm:mb-6">
            👥
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No Faculty Found</h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">Try adjusting your search or filters</p>
          <button 
            onClick={onRefresh}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm sm:text-base"
          >
            Refresh Data
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {faculty.map((member) => (
            <div 
              key={member.id} 
              className="group bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-4 sm:p-6 border border-gray-200 hover:-translate-y-1"
            >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{member.name}</h4>
                  <p className="text-xs text-gray-500 font-medium">{member.employee_id}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-sm">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600 font-medium truncate">{member.email}</span>
              </div>
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-bold">
                {member.department}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 text-center">
                <p className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {member.feedback_count}
                </p>
                <p className="text-xs font-semibold text-gray-600">Feedbacks</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 text-center">
                <p className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {Math.floor(Math.random() * 5) + 3}
                </p>
                <p className="text-xs font-semibold text-gray-600">Courses</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 text-sm font-bold">
                View Profile
              </button>
              <button className="px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-bold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Feedbacks Tab Component
const FeedbacksTab = ({ feedbacks }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Export - Responsive */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">All Feedback Analysis</h3>
            <p className="text-sm text-gray-600 mt-1">Total: {feedbacks.length} feedbacks</p>
          </div>
          <button className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl sm:rounded-2xl hover:shadow-xl transition-all font-bold flex items-center justify-center space-x-2 text-sm sm:text-base">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Feedback Cards - Responsive */}
      {feedbacks.length === 0 ? (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-200 text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-4xl sm:text-5xl mx-auto mb-4 sm:mb-6">
            📝
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No Feedback Data</h3>
          <p className="text-sm sm:text-base text-gray-600">Feedback will appear here once faculty upload data</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {feedbacks.slice(0, 10).map((feedback) => (
          <div 
            key={feedback.id} 
            className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-200 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                  feedback.sentiment === 'POSITIVE' ? 'bg-gradient-to-br from-green-500 to-emerald-500' :
                  feedback.sentiment === 'NEGATIVE' ? 'bg-gradient-to-br from-red-500 to-pink-500' :
                  'bg-gradient-to-br from-yellow-500 to-orange-500'
                }`}>
                  {feedback.sentiment === 'POSITIVE' ? '😊' : feedback.sentiment === 'NEGATIVE' ? '😟' : '😐'}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg mb-1">{feedback.faculty_name}</h4>
                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                    <span>{feedback.department}</span>
                    <span>•</span>
                    <span>{feedback.student_id}</span>
                  </div>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-md ${
                feedback.sentiment === 'POSITIVE' ? 'bg-green-100 text-green-700' :
                feedback.sentiment === 'NEGATIVE' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {feedback.sentiment}
              </span>
            </div>
            <p className="text-gray-700 text-sm mb-4 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-200">
              {feedback.feedback_text?.substring(0, 200)}...
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-xs text-gray-500 font-medium">
                {new Date(feedback.uploaded_at).toLocaleDateString()}
              </span>
              <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors text-sm font-semibold">
                View Details →
              </button>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Alerts Tab Component
const AlertsTab = ({ alerts }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Critical', count: alerts.filter(a => a.priority === 'High').length, color: 'from-red-500 to-pink-500', icon: '🚨' },
          { label: 'Medium', count: alerts.filter(a => a.priority === 'Medium').length, color: 'from-orange-500 to-yellow-500', icon: '⚠️' },
          { label: 'Low', count: alerts.filter(a => a.priority === 'Low').length, color: 'from-blue-500 to-cyan-500', icon: 'ℹ️' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">{stat.label} Priority</p>
                <p className={`text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.count}
                </p>
              </div>
              <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mr-3 shadow-lg">
            <span className="text-2xl">🚨</span>
          </div>
          Critical Alerts
        </h3>
        
        {alerts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-6 shadow-2xl">
              ✅
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-2">All Clear!</p>
            <p className="text-gray-500 text-lg">No alerts or flagged feedback at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className="group p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-3xl border-2 border-red-200 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${
                      alert.priority === 'High' ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white' :
                      alert.priority === 'Medium' ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white' :
                      'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    }`}>
                      {alert.priority} Priority
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors text-sm font-bold shadow-lg">
                      ✓ Resolve
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-bold shadow-lg">
                      📧 Notify
                    </button>
                  </div>
                </div>
                <h4 className="font-bold text-gray-800 text-lg mb-1">{alert.faculty_name}</h4>
                <p className="text-sm text-gray-600 mb-4">{alert.department} • Student: {alert.student_id}</p>
                <div className="p-4 bg-white rounded-2xl border-2 border-red-300 mb-4">
                  <p className="text-gray-800 leading-relaxed">{alert.feedback_text}</p>
                </div>
                <span className="text-sm text-gray-500 font-medium">
                  {new Date(alert.uploaded_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Trends Tab Component
const TrendsTab = ({ trends, stats }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Avg Rating', value: '8.4/10', change: '+0.3', icon: '⭐', color: 'from-yellow-500 to-orange-500' },
          { label: 'Response Rate', value: '94%', change: '+5%', icon: '📊', color: 'from-green-500 to-emerald-500' },
          { label: 'Satisfaction', value: '87%', change: '+2%', icon: '😊', color: 'from-blue-500 to-cyan-500' },
          { label: 'Engagement', value: '91%', change: '+7%', icon: '🎯', color: 'from-purple-500 to-pink-500' }
        ].map((metric, idx) => (
          <div key={idx} className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                {metric.icon}
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                {metric.change}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-600 mb-1">{metric.label}</p>
            <p className={`text-3xl font-black bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <span className="text-xl">📈</span>
            </div>
            Sentiment Trends
          </h3>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl border-2 border-dashed border-blue-300">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-2xl">
                📊
              </div>
              <p className="text-lg font-bold text-gray-800 mb-2">Interactive Chart</p>
              <p className="text-sm text-gray-500">Visualization will be displayed here</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <span className="text-xl">🎯</span>
            </div>
            Top Categories
          </h3>
          <div className="space-y-4">
            {[
              { category: 'Teaching Quality', count: 245, color: 'from-blue-500 to-cyan-500', icon: '📚' },
              { category: 'Course Content', count: 198, color: 'from-green-500 to-emerald-500', icon: '📖' },
              { category: 'Communication', count: 167, color: 'from-purple-500 to-pink-500', icon: '💬' }
            ].map((item, idx) => {
              const percentage = (item.count / 245) * 100;
              return (
                <div key={idx} className="group p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-bold text-gray-800">{item.category}</span>
                    </div>
                    <span className={`text-xl font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                      {item.count}
                    </span>
                  </div>
                  <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out shadow-lg`}
                      style={{width: `${percentage}%`}}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-4">Export Analytics</h3>
          <p className="text-blue-100 font-medium mb-8">Download comprehensive reports and insights</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'PDF Report', icon: '📄', desc: 'Detailed analysis' },
              { label: 'Excel Data', icon: '📊', desc: 'Raw data export' },
              { label: 'Charts & Graphs', icon: '📈', desc: 'Visual insights' }
            ].map((option, idx) => (
              <button 
                key={idx}
                className="group p-6 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-200 border-2 border-white/20 hover:scale-105 text-left"
              >
                <div className="text-4xl mb-3">{option.icon}</div>
                <p className="font-bold text-lg mb-1">{option.label}</p>
                <p className="text-sm text-blue-100">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Tab Component
const SettingsTab = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mr-3 shadow-lg">
            <span className="text-2xl">⚙️</span>
          </div>
          System Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Full Name</p>
            <p className="text-lg font-bold text-gray-900">{user.first_name} {user.last_name}</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Email Address</p>
            <p className="text-lg font-bold text-gray-900">{user.email}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Department</p>
            <p className="text-lg font-bold text-gray-900">{user.department || 'Not Specified'}</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Employee ID</p>
            <p className="text-lg font-bold text-gray-900">{user.employee_id || 'Not Specified'}</p>
          </div>
          
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-200 md:col-span-2">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Role</p>
            <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-base font-bold shadow-md">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              {user.role.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">System Configuration</h3>
        <p className="mb-6 opacity-90">Manage system-wide settings and preferences</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'User Management', icon: '👥' },
            { label: 'Email Notifications', icon: '📧' },
            { label: 'Data Backup', icon: '💾' },
            { label: 'Security Settings', icon: '🔒' }
          ].map((setting, idx) => (
            <button 
              key={idx}
              className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/20 transition-all duration-200 border border-white/20 text-left flex items-center space-x-3"
            >
              <span className="text-3xl">{setting.icon}</span>
              <span className="font-semibold">{setting.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardNew;
