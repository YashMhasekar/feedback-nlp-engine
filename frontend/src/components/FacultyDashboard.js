import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFirebaseAlerts } from "../hooks/useFirebaseAlerts";
import axios from "axios";
import EnhancedOverview from "./EnhancedOverview";
import TrendsInsightsLive from "./TrendsInsightsLive";
import AISuggestions from "./AISuggestions";
import ComparePerformance from "./ComparePerformance";
import SettingsProfile from "./SettingsProfile";
import AlertNotification from "./AlertNotification";

// Add animation styles
const animationStyles = `
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
    transition: all 0.3s ease-out;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = animationStyles;
  document.head.appendChild(styleSheet);
}

const FacultyDashboard = ({ user: propUser, onLogout: propLogout }) => {
  const navigate = useNavigate();
  const { user: contextUser, logout: contextLogout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // NEW: Trigger for refreshing trends
  const [alertCount, setAlertCount] = useState(0); // Track alert count
  const [showAlertNotification, setShowAlertNotification] = useState(false);

  // Use prop user if provided, otherwise use context user
  const user = propUser || contextUser;
  const logout = propLogout || contextLogout;

  // Redirect to login if no user data
  React.useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // If no user, don't render anything (will redirect)
  if (!user) {
    return null;
  }

  // Format user's full name (no prefix)
  const getUserDisplayName = () => {
    if (!user) return "User";

    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();

    // Debug logging
    console.log("User object:", user);
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Full Name:", fullName);

    return fullName || "User";
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "U";

    const firstName = user.first_name || "";
    const lastName = user.last_name || "";

    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();

    return `${firstInitial}${lastInitial}` || "U";
  };

  const facultyName = getUserDisplayName();
  const userInitials = getUserInitials();

  const handleLogout = () => {
    // Clear any stored authentication data
    logout();
    // Navigate to home page
    navigate("/", { replace: true });
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "analyze", label: "Analyze Feedback", icon: "📂" },
    { id: "trends", label: "Trends & Insights", icon: "📈" },
    { id: "suggestions", label: "Suggestions", icon: "💡" },
    { id: "compare", label: "Compare Performance", icon: "⚖️" },
    { id: "alerts", label: "Alerts & Reports", icon: "🚨" },
    { id: "settings", label: "Settings / Profile", icon: "⚙️" },
    { id: "student-feedback", label: "Student Submissions", icon: "📝" },
  ];

  const handleAnalysisComplete = () => {
    // Increment refresh trigger to update Trends & Insights
    setRefreshTrigger((prev) => prev + 1);

    // Show notification with option to view trends
    const notification = document.createElement("div");
    notification.className =
      "fixed top-24 right-8 z-50 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 animate-slide-in";
    notification.innerHTML = `
      <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div class="flex-1">
        <p class="font-bold text-sm">✅ Trends & Insights Updated!</p>
        <p class="text-xs opacity-90">Click to view updated analytics</p>
      </div>
    `;
    notification.style.cursor = "pointer";
    notification.onclick = () => {
      setActiveTab("trends");
      notification.remove();
    };
    document.body.appendChild(notification);

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.opacity = "0";
        notification.style.transform = "translateX(100%)";
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove();
          }
        }, 300);
      }
    }, 5000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <EnhancedOverview />;
      case "analyze":
        return (
          <AnalyzeFeedbackContent onAnalysisComplete={handleAnalysisComplete} />
        );
      case "trends":
        return (
          <TrendsInsightsLive
            key={refreshTrigger}
            refreshTrigger={refreshTrigger}
          />
        );
      case "suggestions":
        return <AISuggestions />;
      case "compare":
        return <ComparePerformance />;
      case "alerts":
        return <AlertsReportsContent />;
      case "settings":
        return <SettingsProfile />;
      case "student-feedback":
        return <StudentFeedbackContent />;
      default:
        return <EnhancedOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-72" : "w-20"
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <button
                onClick={handleLogoClick}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                  <img
                    src="/imagelogo.jpeg"
                    alt="Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to icon if image doesn't load
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <svg
                    className="w-7 h-7 text-white hidden"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                    Feedback Analyzer
                  </h1>
                  <p className="text-xs text-gray-600 font-medium">
                    Faculty Portal
                  </p>
                </div>
              </button>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center ${
                isSidebarOpen ? "px-4" : "px-2 justify-center"
              } py-3.5 rounded-lg transition-all duration-200 group ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {isSidebarOpen && (
                <span className="ml-3 text-sm">{item.label}</span>
              )}
              {activeTab === item.id && isSidebarOpen && (
                <div className="ml-auto w-1 h-6 bg-gradient-to-b from-violet-500 to-fuchsia-600 rounded-full shadow-md"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        {isSidebarOpen && (
          <div className="p-4 border-t border-gray-100">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
              <p className="text-xs font-bold text-gray-700 mb-1">Need Help?</p>
              <p className="text-xs text-gray-600 mb-3 font-medium">
                Check our documentation
              </p>
              <button className="w-full px-3 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white text-xs font-semibold rounded-lg hover:shadow-lg transition-all">
                View Docs
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Top Bar */}
        <header className="bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 border-b-2 border-purple-100 px-8 py-5 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Left Section with Logo */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogoClick}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                  <img
                    src="/imagelogo.jpeg"
                    alt="Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <svg
                    className="w-7 h-7 text-white hidden"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                    Feedback Analyzer
                  </h1>
                  <p className="text-xs text-gray-600 font-medium">
                    Faculty Dashboard
                  </p>
                </div>
              </button>
              <div className="h-10 w-px bg-purple-200"></div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Welcome back, {facultyName}
                </h2>
                <p className="text-gray-600 text-sm font-medium">
                  Here's your feedback analysis overview
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2.5 border-2 border-purple-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/80 backdrop-blur-sm"
                />
                <svg
                  className="w-5 h-5 text-purple-400 absolute left-3 top-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Notifications */}
              <button className="relative p-3 hover:bg-white/60 rounded-xl transition-all hover:shadow-md">
                <svg
                  className="w-6 h-6 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full ring-2 ring-white animate-pulse"></span>
              </button>

              {/* Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-3 pl-4 pr-3 py-2.5 hover:bg-white/60 rounded-xl transition-all hover:shadow-md"
                >
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-bold text-gray-800">
                      {facultyName}
                    </p>
                    <p className="text-xs text-gray-600 font-medium capitalize">
                      {user.role}
                    </p>
                  </div>
                  <div className="w-11 h-11 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {userInitials}
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border-2 border-purple-100 py-2 z-50 animate-fade-in">
                    <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                      <p className="text-base font-bold text-gray-800">
                        {facultyName}
                      </p>
                      <p className="text-xs text-gray-600 font-medium mt-1">
                        {user.email}
                      </p>
                      {user.department && (
                        <p className="text-xs text-gray-500 font-medium mt-1">
                          📚 {user.department}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab("settings");
                        setShowProfileDropdown(false);
                      }}
                      className="w-full flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-3 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="font-medium">My Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("settings");
                        setShowProfileDropdown(false);
                      }}
                      className="w-full flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-3 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="font-medium">Settings</span>
                    </button>
                    <button
                      onClick={handleLogoClick}
                      className="w-full flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                    >
                      <svg
                        className="w-5 h-5 mr-3 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      <span className="font-medium">Go to Homepage</span>
                    </button>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold"
                    >
                      <svg
                        className="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>
    </div>
  );
};

// Analyze Feedback Content Component
const AnalyzeFeedbackContent = ({ onAnalysisComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const allowedExtensions = ["csv", "xlsx", "xls", "tsv"];

      if (!allowedExtensions.includes(fileExtension)) {
        setError(
          "Unsupported file format. Please upload CSV, XLSX, XLS, or TSV files only."
        );
        return;
      }

      setSelectedFile(file);
      setError(null);
      setAnalysisResult(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const allowedExtensions = ["csv", "xlsx", "xls", "tsv"];

      if (!allowedExtensions.includes(fileExtension)) {
        setError(
          "Unsupported file format. Please upload CSV, XLSX, XLS, or TSV files only."
        );
        return;
      }

      setSelectedFile(file);
      setError(null);
      setAnalysisResult(null);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      console.log("Uploading file:", selectedFile.name);

      const response = await fetch(
        "http://localhost:5002/api/analyze-feedback",
        {
          method: "POST",
          body: formData,
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(95);

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok && data.status === "ok") {
        console.log("Analysis successful, setting results");
        console.log("Full response data:", JSON.stringify(data, null, 2));
        console.log("Stats:", data.stats);
        console.log("Rows count:", data.rows ? data.rows.length : 0);
        console.log("Summary:", data.summary);

        setUploadProgress(100);

        // Small delay to show 100% completion
        setTimeout(() => {
          setAnalysisResult(data);
          console.log("Analysis result set in state");

          // Show success message
          if (data.rows && data.rows.length > 0) {
            console.log(
              `Successfully analyzed ${data.rows.length} feedback entries`
            );
            setSuccessMessage(
              `✅ Successfully analyzed ${data.rows.length} feedback entries!`
            );
            setTimeout(() => setSuccessMessage(null), 5000); // Clear after 5 seconds

            // NEW: Trigger refresh of Trends & Insights
            if (onAnalysisComplete) {
              console.log("🔄 Triggering Trends & Insights refresh...");
              onAnalysisComplete();
            }
          } else {
            console.warn("No rows in analysis result");
          }
        }, 500);
      } else {
        const errorMsg = data.message || "Analysis failed. Please try again.";
        console.error("Analysis error:", errorMsg);
        setError(`⚠️ ${errorMsg}`);
      }
    } catch (err) {
      clearInterval(progressInterval);
      const errorMsg =
        "Failed to connect to server. Please ensure the backend is running on port 5002.";
      console.error("Upload error:", err);
      setError(`⚠️ ${errorMsg}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (analysisResult && analysisResult.download_url) {
      window.open(
        `http://localhost:5002${analysisResult.download_url}`,
        "_blank"
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-8 shadow-xl border-2 border-purple-100">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-violet-100 to-fuchsia-100 opacity-25 rounded-full -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-100 to-rose-100 opacity-25 rounded-full -ml-32 -mb-32"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-9 h-9 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-1">
                Analyze Student Feedback
              </h3>
              <p className="text-gray-700 text-base font-medium">
                Transform raw feedback into actionable insights with AI-powered
                analysis
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 border-2 border-emerald-200 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">
                    Accuracy
                  </p>
                  <p className="text-emerald-600 text-xl font-bold">98.5%</p>
                </div>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 border-2 border-amber-200 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">
                    Processing
                  </p>
                  <p className="text-amber-600 text-xl font-bold">Real-time</p>
                </div>
              </div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 border-2 border-purple-200 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-2xl">🤖</span>
                </div>
                <div>
                  <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">
                    AI Model
                  </p>
                  <p className="text-violet-600 text-xl font-bold">Gemini</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-gray-200">
        {/* Upload Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-3 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
            isDragging
              ? "border-violet-400 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 scale-[1.02] shadow-xl"
              : selectedFile
              ? "border-emerald-400 bg-gradient-to-br from-emerald-50 via-teal-50 to-mint-50 shadow-lg"
              : "border-purple-300 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 hover:border-violet-400 hover:shadow-lg"
          }`}
        >
          <div className="flex flex-col items-center">
            {/* Icon */}
            <div
              className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 transition-all duration-300 shadow-xl ${
                selectedFile
                  ? "bg-gradient-to-br from-emerald-400 via-teal-400 to-green-500 shadow-emerald-200"
                  : "bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-600 shadow-purple-200"
              }`}
            >
              {selectedFile ? (
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              )}
            </div>

            {/* Text */}
            <div className="mb-6">
              <p className="text-xl font-bold text-gray-700 mb-2">
                {selectedFile ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span className="text-2xl text-emerald-500">✓</span>
                    <span className="text-emerald-600">
                      {selectedFile.name}
                    </span>
                  </span>
                ) : (
                  <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                    Drag & drop your feedback file here
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-500 font-medium">
                {selectedFile
                  ? "✨ File ready for AI analysis"
                  : "or click the button below to browse"}
              </p>
            </div>

            {/* File Type Badges */}
            <div className="flex items-center space-x-3 mb-8">
              {[
                { type: "CSV", color: "from-violet-400 to-purple-500" },
                { type: "XLSX", color: "from-emerald-400 to-teal-500" },
                { type: "XLS", color: "from-fuchsia-400 to-pink-500" },
                { type: "TSV", color: "from-rose-400 to-orange-500" },
              ].map(({ type, color }, idx) => (
                <span
                  key={type}
                  className={`px-4 py-2 bg-gradient-to-r ${color} text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-105`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {type}
                </span>
              ))}
            </div>

            {/* Upload Button */}
            <input
              type="file"
              id="fileInput"
              accept=".csv,.xlsx,.xls,.tsv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label
              htmlFor="fileInput"
              className="group relative px-10 py-4 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-purple-300 transition-all duration-300 cursor-pointer overflow-hidden hover:scale-105"
            >
              <span className="relative z-10 flex items-center space-x-3 text-base">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span>
                  {selectedFile ? "🔄 Change File" : "📁 Choose File"}
                </span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </label>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border-2 border-emerald-300 rounded-3xl flex items-start shadow-xl animate-fade-in">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-emerald-700 mb-1">
                🎉 Analysis Complete!
              </p>
              <p className="text-sm text-emerald-600 font-medium">
                {successMessage}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-6 bg-gradient-to-r from-rose-50 via-pink-50 to-red-50 border-2 border-rose-300 rounded-3xl flex items-start shadow-xl animate-fade-in">
            <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-base font-bold text-rose-700 mb-1">
                ⚠️ Error Occurred
              </p>
              <p className="text-sm text-rose-600 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Upload Button */}
        {selectedFile && !analysisResult && (
          <div className="mt-6">
            <button
              onClick={handleUploadAndAnalyze}
              disabled={isUploading}
              className="group relative w-full px-10 py-5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-purple-300 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-pink-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {isUploading ? (
                <>
                  <svg
                    className="relative z-10 animate-spin h-7 w-7 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="relative z-10 text-xl">
                    🤖 Analyzing with AI...
                  </span>
                </>
              ) : (
                <>
                  <svg
                    className="relative z-10 w-7 h-7"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span className="relative z-10 text-xl">
                    ✨ Start AI Analysis
                  </span>
                  <svg
                    className="relative z-10 w-6 h-6 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

        {/* Progress Bar - Shown during analysis */}
        {isUploading && (
          <div className="mt-6 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-3xl p-8 border-2 border-purple-200 shadow-xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg
                      className="animate-spin h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <div className="absolute inset-0 bg-purple-300 rounded-2xl animate-ping opacity-20"></div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-700">
                      🤖 AI Analysis in Progress
                    </h4>
                    <p className="text-sm text-gray-600 font-medium">
                      Processing with advanced NLP engine
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                    {uploadProgress}%
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-semibold">
                    Complete
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="overflow-hidden h-4 text-xs flex rounded-full bg-white shadow-inner border-2 border-purple-100">
                  <div
                    style={{ width: `${uploadProgress}%` }}
                    className="shadow-lg flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-600 transition-all duration-500 rounded-full"
                  ></div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-pulse"></div>
              </div>

              {/* Analysis Steps */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-emerald-200 hover:shadow-lg transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-700">
                        File Upload
                      </p>
                      <p className="text-xs text-emerald-600 font-semibold">
                        ✓ Complete
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-purple-200 hover:shadow-lg transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-700">
                        Sentiment Analysis
                      </p>
                      <p className="text-xs text-purple-600 font-semibold">
                        ⚡ Processing
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-gray-200 hover:shadow-lg transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-slate-300 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 border-3 border-gray-400 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-500">
                        Categorization
                      </p>
                      <p className="text-xs text-gray-400 font-semibold">
                        ⏳ Pending
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-md border-2 border-gray-200 hover:shadow-lg transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-slate-300 rounded-xl flex items-center justify-center">
                      <div className="w-6 h-6 border-3 border-gray-400 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-500">
                        AI Suggestions
                      </p>
                      <p className="text-xs text-gray-400 font-semibold">
                        ⏳ Pending
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl p-8 shadow-xl border-2 border-emerald-200">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-100 to-cyan-100 opacity-40 rounded-full -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-emerald-100 to-green-100 opacity-40 rounded-full -ml-36 -mb-36"></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg
                      className="w-9 h-9 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                      🎉 AI Analysis Complete
                    </h4>
                    <p className="text-gray-600 text-base font-medium">
                      Comprehensive insights generated successfully
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white text-sm font-bold rounded-2xl hover:shadow-xl hover:shadow-purple-200 transition-all duration-300 flex items-center space-x-2 hover:scale-105"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>Download Report</span>
                </button>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-emerald-200 shadow-md">
                <p className="text-gray-700 leading-relaxed text-base font-medium">
                  {analysisResult.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 border-2 border-purple-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-3xl">📊</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2 font-bold uppercase tracking-wide">
                Total Feedback
              </p>
              <p className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                {analysisResult.stats?.total || 0}
              </p>
            </div>

            <div className="group bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 border-2 border-emerald-200 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-3xl">😊</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2 font-bold uppercase tracking-wide">
                Positive
              </p>
              <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {analysisResult.stats?.positive || 0}
              </p>
            </div>

            <div className="group bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-6 border-2 border-amber-200 hover:border-amber-300 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-3xl">😐</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2 font-bold uppercase tracking-wide">
                Neutral
              </p>
              <p className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                {analysisResult.stats?.neutral || 0}
              </p>
            </div>

            <div className="group bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-6 border-2 border-rose-200 hover:border-rose-300 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-3xl">😟</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2 font-bold uppercase tracking-wide">
                Negative
              </p>
              <p className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                {analysisResult.stats?.negative || 0}
              </p>
            </div>

            <div className="group bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl p-6 border-2 border-orange-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <span className="text-3xl">🚨</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2 font-bold uppercase tracking-wide">
                Alerts
              </p>
              <p className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {analysisResult.stats?.alerts || 0}
              </p>
            </div>
          </div>

          {/* Results Cards - Beautiful Display */}
          <div className="bg-white rounded-3xl border-2 border-gray-200 overflow-hidden shadow-xl">
            <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 p-8 border-b-2 border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg
                      className="w-7 h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                      📋 Detailed Analysis Results
                    </h4>
                    <p className="text-sm text-gray-600 mt-1 font-medium">
                      {analysisResult.rows
                        ? `Showing ${Math.min(
                            analysisResult.rows.length,
                            15
                          )} of ${analysisResult.rows.length} entries`
                        : "No results"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600 font-bold uppercase tracking-wide">
                    View:
                  </span>
                  <button className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all">
                    Cards
                  </button>
                  <button className="px-5 py-2.5 bg-white text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors border-2 border-gray-200">
                    Table
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5 max-h-[600px] overflow-y-auto bg-gradient-to-br from-slate-50 to-gray-50">
              {analysisResult.rows &&
                analysisResult.rows.slice(0, 15).map((row, index) => {
                  const sentimentConfig = {
                    POSITIVE: {
                      emoji: "😊",
                      bg: "from-emerald-50 to-teal-50",
                      border: "border-emerald-300",
                      text: "text-emerald-700",
                      badge:
                        "bg-gradient-to-r from-emerald-400 to-teal-500 text-white",
                      icon: "from-emerald-400 to-teal-500",
                    },
                    NEGATIVE: {
                      emoji: "😟",
                      bg: "from-rose-50 to-pink-50",
                      border: "border-rose-300",
                      text: "text-rose-700",
                      badge:
                        "bg-gradient-to-r from-rose-400 to-pink-500 text-white",
                      icon: "from-rose-400 to-pink-500",
                    },
                    NEUTRAL: {
                      emoji: "😐",
                      bg: "from-amber-50 to-yellow-50",
                      border: "border-amber-300",
                      text: "text-amber-700",
                      badge:
                        "bg-gradient-to-r from-amber-400 to-yellow-500 text-white",
                      icon: "from-amber-400 to-yellow-500",
                    },
                  };

                  const categoryConfig = {
                    Teaching: {
                      icon: "👨‍🏫",
                      color:
                        "bg-gradient-to-r from-blue-400 to-indigo-500 text-white",
                    },
                    Behavior: {
                      icon: "🤝",
                      color:
                        "bg-gradient-to-r from-violet-400 to-purple-500 text-white",
                    },
                    "Course Content": {
                      icon: "📚",
                      color:
                        "bg-gradient-to-r from-indigo-400 to-violet-500 text-white",
                    },
                    Infrastructure: {
                      icon: "🏢",
                      color:
                        "bg-gradient-to-r from-orange-400 to-amber-500 text-white",
                    },
                    General: {
                      icon: "📝",
                      color:
                        "bg-gradient-to-r from-gray-400 to-slate-500 text-white",
                    },
                  };

                  const sentiment = row.sentiment || "NEUTRAL";
                  const config =
                    sentimentConfig[sentiment] || sentimentConfig["NEUTRAL"];
                  const catConfig =
                    categoryConfig[row.category] || categoryConfig["General"];

                  return (
                    <div
                      key={index}
                      className={`group border-l-4 ${config.border} bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-[1.01]`}
                    >
                      {/* Card Header */}
                      <div
                        className={`bg-gradient-to-r ${config.bg} px-6 py-5 flex items-center justify-between border-b-2 ${config.border}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-16 h-16 bg-gradient-to-br ${config.icon} rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}
                          >
                            {config.emoji}
                          </div>
                          <div>
                            <p className="text-lg font-bold text-gray-700 mb-2">
                              🎓 Student ID: {row.student_id || `S${index + 1}`}
                            </p>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-4 py-1.5 text-xs font-bold rounded-full ${config.badge} shadow-md`}
                              >
                                {sentiment}
                              </span>
                              <span
                                className={`px-4 py-1.5 text-xs font-bold rounded-full ${catConfig.color} flex items-center space-x-1 shadow-md`}
                              >
                                <span>{catConfig.icon}</span>
                                <span>{row.category}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-4xl group-hover:scale-110 transition-transform">
                          {row.alert ? "🚨" : "✅"}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="px-6 py-6 space-y-5">
                        {/* Feedback */}
                        <div>
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center shadow-md">
                              <span className="text-xl">📝</span>
                            </div>
                            <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                              Student Feedback
                            </p>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-5 border-2 border-gray-200 shadow-sm font-medium">
                            "{row.feedback}"
                          </p>
                        </div>

                        {/* Suggestion */}
                        <div>
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center shadow-md">
                              <span className="text-xl">💡</span>
                            </div>
                            <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                              AI-Generated Suggestion
                            </p>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border-l-4 border-indigo-400 shadow-sm font-medium">
                            {row.suggestion}
                          </p>
                        </div>

                        {/* Alert Message if present */}
                        {row.alert && (
                          <div className="bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-300 rounded-2xl p-5 flex items-start space-x-3 shadow-lg">
                            <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                              <span className="text-2xl">⚠️</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-rose-700 uppercase tracking-wider mb-2">
                                🚨 Critical Alert Detected
                              </p>
                              <p className="text-sm text-rose-600 font-semibold">
                                This feedback requires immediate attention from
                                administration.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Footer */}
            {analysisResult.rows && analysisResult.rows.length > 15 && (
              <div className="p-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-t-2 border-gray-200 text-center">
                <div className="flex items-center justify-center space-x-3 mb-5">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-700 font-medium">
                    <span className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {analysisResult.rows.length - 15} more entries
                    </span>{" "}
                    available in the full report
                  </p>
                </div>
                <button
                  onClick={handleDownload}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white text-base font-bold rounded-2xl hover:shadow-2xl hover:shadow-indigo-300 transition-all duration-300 inline-flex items-center space-x-3 overflow-hidden hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg
                    className="relative z-10 w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span className="relative z-10">
                    📥 Download Complete Report
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Analyze Another File Button */}
          <button
            onClick={() => {
              setSelectedFile(null);
              setAnalysisResult(null);
              setError(null);
            }}
            className="group w-full px-10 py-5 bg-gradient-to-r from-slate-100 to-gray-100 text-gray-700 font-bold rounded-3xl hover:from-slate-200 hover:to-gray-200 transition-all duration-300 flex items-center justify-center space-x-3 border-2 border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            <svg
              className="w-7 h-7 group-hover:rotate-180 transition-transform duration-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="text-xl">🔄 Analyze Another File</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Other content components with minimal implementation
const AlertsReportsContent = () => {
  const { user } = useAuth();
  const { alerts, loading } = useFirebaseAlerts(user?.id, null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            Alerts & Reports
          </h3>
          <p className="text-sm text-gray-500">
            Critical feedback alerts requiring immediate attention
          </p>
        </div>
        <div className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-bold">
          {alerts.length} Alert{alerts.length !== 1 ? "s" : ""}
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
          <div className="text-5xl mb-3">✅</div>
          <p className="text-lg font-semibold text-green-800 mb-1">
            All Clear!
          </p>
          <p className="text-sm text-green-600">
            No critical alerts at this time.
          </p>
        </div>
      ) : (
        alerts.map((alert, index) => (
          <div
            key={alert.firebase_key || index}
            className="bg-white rounded-xl p-6 border-l-4 border-red-500 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                  <span
                    className={`inline-block px-2.5 py-1 ${
                      alert.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : alert.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    } text-xs font-semibold rounded-full`}
                  >
                    {alert.priority} Priority
                  </span>
                  <span
                    className={`inline-block px-2.5 py-1 ${
                      alert.status === "Pending"
                        ? "bg-orange-100 text-orange-700"
                        : alert.status === "Resolved"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    } text-xs font-semibold rounded-full`}
                  >
                    {alert.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(
                      alert.created_at || alert.timestamp
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Student:</span>{" "}
                    {alert.student_id}
                  </p>
                  <p className="text-gray-700 mb-2">{alert.feedback_text}</p>
                  {alert.alert_keywords && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {alert.alert_keywords.split(",").map((keyword, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full"
                        >
                          🚩 {keyword.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3 text-xs">
                  <span
                    className={`px-2 py-1 rounded-lg font-semibold ${
                      alert.sentiment === "POSITIVE"
                        ? "bg-green-100 text-green-700"
                        : alert.sentiment === "NEGATIVE"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {alert.sentiment}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg font-semibold">
                    {alert.category}
                  </span>
                </div>
              </div>
              <div className="ml-4 w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                🚨
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Student Feedback Submissions Component
const StudentFeedbackContent = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudentFeedbacks();
  }, [user]);

  const fetchStudentFeedbacks = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5002/api/faculty/${user.id}/student_feedbacks`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFeedbacks(response.data.feedbacks || []);
    } catch (err) {
      console.error("Error fetching student feedbacks:", err);
      setError(
        err.response?.data?.message || "Failed to load student feedbacks"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">
            Loading student submissions...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <div className="flex items-center space-x-3">
          <svg
            className="w-6 h-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-700 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">
            📝 Student Submissions
          </h3>
          <p className="text-sm text-gray-600">
            View all student-submitted feedback with AI analysis
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold">
            {feedbacks.length} Submission{feedbacks.length !== 1 ? "s" : ""}
          </div>
          <button
            onClick={fetchStudentFeedbacks}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center space-x-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* No Data State */}
      {feedbacks.length === 0 ? (
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h4 className="text-xl font-bold text-gray-800 mb-2">
            No Student Submissions Yet
          </h4>
          <p className="text-gray-600 mb-4">
            Students haven't submitted any feedback through the student portal
            yet.
          </p>
          <p className="text-sm text-gray-500">
            Share the student feedback link:{" "}
            <span className="font-mono bg-gray-200 px-2 py-1 rounded">
              http://localhost:4010/student
            </span>
          </p>
        </div>
      ) : (
        /* Feedback Cards */
        <div className="space-y-4">
          {feedbacks.map((feedback, index) => (
            <div
              key={feedback.id || index}
              className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all"
            >
              {/* Header Row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {feedback.student_id?.substring(0, 2) || "ST"}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">
                      Student ID: {feedback.student_id}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(feedback.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      feedback.sentiment === "POSITIVE"
                        ? "bg-green-100 text-green-700"
                        : feedback.sentiment === "NEGATIVE"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {feedback.sentiment}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                    {feedback.category}
                  </span>
                  {feedback.alert && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                      🚨 Alert
                    </span>
                  )}
                </div>
              </div>

              {/* Course Info */}
              <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">
                    Course
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {feedback.course}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">
                    Faculty
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {feedback.faculty}
                  </p>
                </div>
              </div>

              {/* Feedback Text */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-2">
                  Student Feedback
                </p>
                <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                  <p className="text-gray-800 leading-relaxed">
                    {feedback.feedback}
                  </p>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="border-t-2 border-gray-100 pt-4">
                <p className="text-xs text-gray-500 font-semibold uppercase mb-3 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  AI Analysis & Suggestion
                </p>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <p className="text-gray-700 leading-relaxed">
                    {feedback.suggestion}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
