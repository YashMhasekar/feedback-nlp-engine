import React, { useState } from 'react';

const SettingsProfile = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Sample user data - will be replaced with actual user data
  const [userData, setUserData] = useState({
    // Personal Information
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@university.edu',
    phone: '+1 (555) 123-4567',
    department: 'Computer Science',
    designation: 'Associate Professor',
    employeeId: 'FAC-2024-001',
    joinDate: 'August 2020',
    
    // Professional Details
    specialization: 'Artificial Intelligence, Machine Learning',
    qualifications: 'Ph.D. in Computer Science',
    experience: '12 years',
    officeLocation: 'Building A, Room 305',
    officeHours: 'Mon-Fri, 2:00 PM - 4:00 PM',
    
    // Contact & Social
    linkedIn: 'linkedin.com/in/sarahjohnson',
    researchGate: 'researchgate.net/profile/Sarah-Johnson',
    googleScholar: 'scholar.google.com/citations?user=abc123',
    
    // Preferences
    language: 'English',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    theme: 'light',
    
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    monthlyReports: true,
    alertsEnabled: true,
    suggestionNotifications: true,
    
    // Privacy
    profileVisibility: 'department',
    showEmail: false,
    showPhone: false,
    dataSharing: true,
    
    // Security
    twoFactorAuth: false,
    sessionTimeout: '30',
    lastPasswordChange: '2024-09-15'
  });

  const sections = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'professional', label: 'Professional', icon: '💼' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'privacy', label: 'Privacy', icon: '🛡️' },
    { id: 'account', label: 'Account', icon: '🔧' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl p-4 md:p-6 lg:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-xl">
              👤
            </div>
            <div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white mb-1">
                Settings & Profile
              </h2>
              <p className="text-white/90 text-xs md:text-sm">
                Manage your account, preferences, and security settings
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold hover:bg-purple-50 transition-all duration-200 shadow-lg"
          >
            {isEditing ? '💾 Save Changes' : '✏️ Edit Profile'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100 sticky top-6">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{section.icon}</span>
                  <span className="font-semibold">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <div className="space-y-6">
              {/* Profile Header Card */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-6xl shadow-2xl">
                      👩‍🏫
                    </div>
                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
                      📷
                    </button>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-3xl font-extrabold text-gray-800 mb-2">
                      Dr. {userData.firstName} {userData.lastName}
                    </h3>
                    <p className="text-lg text-purple-600 font-semibold mb-3">{userData.designation}</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <span className="px-3 py-1 bg-white text-purple-700 text-sm font-semibold rounded-full border border-purple-200">
                        {userData.department}
                      </span>
                      <span className="px-3 py-1 bg-white text-gray-700 text-sm font-semibold rounded-full border border-gray-200">
                        {userData.employeeId}
                      </span>
                      <span className="px-3 py-1 bg-white text-emerald-700 text-sm font-semibold rounded-full border border-emerald-200">
                        Since {userData.joinDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="text-2xl mr-3">📋</span>
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'First Name', value: userData.firstName, icon: '👤' },
                    { label: 'Last Name', value: userData.lastName, icon: '👤' },
                    { label: 'Email Address', value: userData.email, icon: '📧' },
                    { label: 'Phone Number', value: userData.phone, icon: '📱' },
                    { label: 'Department', value: userData.department, icon: '🏢' },
                    { label: 'Designation', value: userData.designation, icon: '💼' }
                  ].map((field, index) => (
                    <div key={index} className="group">
                      <label className="block text-sm font-semibold text-gray-600 mb-2">
                        {field.icon} {field.label}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={field.value}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 font-medium">
                          {field.value}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Professional Section */}
          {activeSection === 'professional' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="text-2xl mr-3">💼</span>
                  Professional Details
                </h4>
                <div className="space-y-6">
                  {[
                    { label: 'Specialization', value: userData.specialization, icon: '🎯', multiline: true },
                    { label: 'Qualifications', value: userData.qualifications, icon: '🎓' },
                    { label: 'Experience', value: userData.experience, icon: '⏱️' },
                    { label: 'Office Location', value: userData.officeLocation, icon: '📍' },
                    { label: 'Office Hours', value: userData.officeHours, icon: '🕐' }
                  ].map((field, index) => (
                    <div key={index}>
                      <label className="block text-sm font-semibold text-gray-600 mb-2">
                        {field.icon} {field.label}
                      </label>
                      {isEditing ? (
                        field.multiline ? (
                          <textarea
                            value={field.value}
                            rows="3"
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          />
                        ) : (
                          <input
                            type="text"
                            value={field.value}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                          />
                        )
                      ) : (
                        <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 font-medium">
                          {field.value}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="text-2xl mr-3">🔗</span>
                  Professional Links
                </h4>
                <div className="space-y-4">
                  {[
                    { label: 'LinkedIn', value: userData.linkedIn, icon: '💼', color: 'from-blue-500 to-blue-600' },
                    { label: 'ResearchGate', value: userData.researchGate, icon: '🔬', color: 'from-teal-500 to-cyan-600' },
                    { label: 'Google Scholar', value: userData.googleScholar, icon: '🎓', color: 'from-red-500 to-orange-600' }
                  ].map((link, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${link.color} rounded-xl flex items-center justify-center text-2xl shadow-md`}>
                        {link.icon}
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-600 mb-1">{link.label}</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={link.value}
                            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        ) : (
                          <a href={`https://${link.value}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            {link.value}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Preferences Section */}
          {activeSection === 'preferences' && (
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-2xl mr-3">⚙️</span>
                System Preferences
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Language', value: userData.language, icon: '🌐', options: ['English', 'Spanish', 'French', 'German'] },
                  { label: 'Timezone', value: userData.timezone, icon: '🕐', options: ['America/New_York', 'America/Los_Angeles', 'Europe/London', 'Asia/Tokyo'] },
                  { label: 'Date Format', value: userData.dateFormat, icon: '📅', options: ['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'] },
                  { label: 'Theme', value: userData.theme, icon: '🎨', options: ['Light', 'Dark', 'Auto'] }
                ].map((pref, index) => (
                  <div key={index}>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      {pref.icon} {pref.label}
                    </label>
                    <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer font-medium">
                      {pref.options.map((option, idx) => (
                        <option key={idx} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-2xl mr-3">🔔</span>
                Notification Settings
              </h4>
              <div className="space-y-4">
                {[
                  { label: 'Email Notifications', desc: 'Receive notifications via email', checked: userData.emailNotifications },
                  { label: 'Push Notifications', desc: 'Browser push notifications', checked: userData.pushNotifications },
                  { label: 'Weekly Reports', desc: 'Get weekly performance summaries', checked: userData.weeklyReports },
                  { label: 'Monthly Reports', desc: 'Receive monthly analytics reports', checked: userData.monthlyReports },
                  { label: 'Alert Notifications', desc: 'Critical feedback alerts', checked: userData.alertsEnabled },
                  { label: 'AI Suggestions', desc: 'New AI-generated suggestions', checked: userData.suggestionNotifications }
                ].map((notif, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{notif.label}</p>
                      <p className="text-sm text-gray-500">{notif.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={notif.checked} className="sr-only peer" />
                      <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="text-2xl mr-3">🔒</span>
                  Security Settings
                </h4>
                <div className="space-y-6">
                  {/* Password */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-bold text-gray-800">Password</p>
                        <p className="text-sm text-gray-600">Last changed: {userData.lastPasswordChange}</p>
                      </div>
                      <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md">
                        Change Password
                      </button>
                    </div>
                  </div>

                  {/* Two-Factor Auth */}
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 mb-1">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={userData.twoFactorAuth} className="sr-only peer" />
                        <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-teal-500"></div>
                      </label>
                    </div>
                  </div>

                  {/* Session Timeout */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      🕐 Session Timeout (minutes)
                    </label>
                    <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer font-medium">
                      <option value="15">15 minutes</option>
                      <option value="30" selected>30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Section */}
          {activeSection === 'privacy' && (
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-2xl mr-3">🛡️</span>
                Privacy Settings
              </h4>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    👁️ Profile Visibility
                  </label>
                  <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer font-medium">
                    <option value="public">Public - Everyone can see</option>
                    <option value="department" selected>Department Only</option>
                    <option value="private">Private - Only me</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Show Email Address', desc: 'Display email on public profile', checked: userData.showEmail },
                    { label: 'Show Phone Number', desc: 'Display phone on public profile', checked: userData.showPhone },
                    { label: 'Data Sharing', desc: 'Share anonymized data for research', checked: userData.dataSharing }
                  ].map((privacy, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{privacy.label}</p>
                        <p className="text-sm text-gray-500">{privacy.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={privacy.checked} className="sr-only peer" />
                        <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-pink-500"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Account Section */}
          {activeSection === 'account' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="text-2xl mr-3">🔧</span>
                  Account Management
                </h4>
                <div className="space-y-4">
                  <button className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg text-left flex items-center justify-between">
                    <span>📥 Export My Data</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <button className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg text-left flex items-center justify-between">
                    <span>🔄 Reset All Settings</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <button className="w-full px-6 py-4 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-bold hover:from-red-600 hover:to-rose-600 transition-all shadow-lg text-left flex items-center justify-between">
                    <span>🗑️ Delete Account</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Help & Support */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <h4 className="text-lg font-bold text-gray-800 mb-4">💬 Need Help?</h4>
                <p className="text-gray-600 mb-4">Contact our support team for assistance</p>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors border border-purple-200">
                    📧 Email Support
                  </button>
                  <button className="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors border border-purple-200">
                    📚 Documentation
                  </button>
                  <button className="px-4 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors border border-purple-200">
                    💬 Live Chat
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsProfile;
