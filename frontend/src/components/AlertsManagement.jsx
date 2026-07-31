import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  useFirebaseAlerts,
  getPendingAlertsCount,
  getAlertsByPriority,
} from "../hooks/useFirebaseAlerts";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5002";

const AlertsManagement = () => {
  const [stats, setStats] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Pending");
  const [filterPriority, setFilterPriority] = useState("");
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionNotes, setActionNotes] = useState("");
  const [useFirebase, setUseFirebase] = useState(true);

  // Use Firebase real-time alerts
  const {
    alerts: firebaseAlerts,
    loading: firebaseLoading,
    error: firebaseError,
  } = useFirebaseAlerts(
    null, // facultyId - null for all alerts (admin view)
    filterStatus || null
  );

  // Fallback to REST API alerts
  const [restAlerts, setRestAlerts] = useState([]);
  const [restLoading, setRestLoading] = useState(false);

  // Determine which alerts to use
  const alerts = useFirebase && !firebaseError ? firebaseAlerts : restAlerts;
  const loading = useFirebase ? firebaseLoading : restLoading;

  useEffect(() => {
    fetchStats();
    // Fetch REST API alerts as fallback
    if (!useFirebase || firebaseError) {
      fetchAlertsFromAPI();
    }
  }, [filterStatus, filterPriority, useFirebase, firebaseError]);

  const fetchAlertsFromAPI = async () => {
    setRestLoading(true);
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams();
      if (filterStatus) params.append("status", filterStatus);
      if (filterPriority) params.append("priority", filterPriority);

      const response = await axios.get(
        `${API_BASE_URL}/api/alerts/all?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRestAlerts(response.data.alerts || []);
      setRestLoading(false);
    } catch (error) {
      console.error("Error fetching alerts from API:", error);
      setRestLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/alerts/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleResolve = async (alertId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/alerts/${alertId}/resolve`,
        { notes: actionNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showNotification("Alert resolved successfully", "success");
      setShowModal(false);
      setActionNotes("");
      fetchAlertsFromAPI();
      fetchStats();
    } catch (error) {
      console.error("Error resolving alert:", error);
      showNotification("Failed to resolve alert", "error");
    }
  };

  const handleDismiss = async (alertId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/alerts/${alertId}/dismiss`,
        { notes: actionNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showNotification("Alert dismissed successfully", "success");
      setShowModal(false);
      setActionNotes("");
      fetchAlertsFromAPI();
      fetchStats();
    } catch (error) {
      console.error("Error dismissing alert:", error);
      showNotification("Failed to dismiss alert", "error");
    }
  };

  const showNotification = (message, type) => {
    const notification = document.createElement("div");
    notification.className = `fixed top-24 right-8 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 animate-slide-in ${
      type === "success"
        ? "bg-gradient-to-r from-green-500 to-emerald-600"
        : "bg-gradient-to-r from-red-500 to-pink-600"
    } text-white`;
    notification.innerHTML = `
      <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${
            type === "success"
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
        notification.style.opacity = "0";
        notification.style.transform = "translateX(100%)";
        setTimeout(() => notification.remove(), 300);
      }
    }, 3000);
  };

  const openActionModal = (alert) => {
    setSelectedAlert(alert);
    setShowModal(true);
    setActionNotes("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg
              className="w-8 h-8 text-white animate-spin"
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
          </div>
          <p className="text-lg font-bold text-gray-800">Loading alerts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Total Alerts
                </p>
                <p className="text-5xl font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  {stats.total}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                🚨
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Pending
                </p>
                <p className="text-5xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  {stats.pending}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                ⏳
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Resolved
                </p>
                <p className="text-5xl font-black bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  {stats.resolved}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                ✅
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Last 24h
                </p>
                <p className="text-5xl font-black bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  {stats.recent_24h}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                📊
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Dismissed">Dismissed</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
            >
              <option value="">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={() => {
                fetchAlertsFromAPI();
                fetchStats();
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-xl transition-all font-bold flex items-center space-x-2"
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
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setUseFirebase(!useFirebase)}
              className={`px-4 py-3 rounded-xl font-bold transition-all ${
                useFirebase
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              title={
                useFirebase ? "Using Firebase (Real-time)" : "Using REST API"
              }
            >
              {useFirebase ? "🔥 Live" : "📡 API"}
            </button>
          </div>
        </div>
      </div>

      {/* Alerts List */}
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
            <p className="text-gray-500 text-lg">
              No {filterStatus.toLowerCase()} alerts at this time.
            </p>
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
                    <div
                      className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${
                        alert.priority === "High"
                          ? "bg-gradient-to-r from-red-600 to-pink-600 text-white"
                          : alert.priority === "Medium"
                          ? "bg-gradient-to-r from-orange-500 to-yellow-500 text-white"
                          : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                      }`}
                    >
                      {alert.priority} Priority
                    </div>
                    <div
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        alert.status === "Pending"
                          ? "bg-orange-100 text-orange-700"
                          : alert.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {alert.status}
                    </div>
                  </div>
                  {alert.status === "Pending" && (
                    <button
                      onClick={() => openActionModal(alert)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all text-sm font-bold"
                    >
                      Take Action
                    </button>
                  )}
                </div>

                <h4 className="font-bold text-gray-800 text-lg mb-1">
                  {alert.faculty_name}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {alert.department} • {alert.faculty_email} • Student:{" "}
                  {alert.student_id}
                </p>

                <div className="p-4 bg-white rounded-2xl border-2 border-red-300 mb-4">
                  <p className="text-gray-800 leading-relaxed mb-2">
                    {alert.feedback_text}
                  </p>
                  {alert.alert_keywords && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {alert.alert_keywords.split(",").map((keyword, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold"
                        >
                          🚩 {keyword.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-lg font-bold ${
                        alert.sentiment === "POSITIVE"
                          ? "bg-green-100 text-green-700"
                          : alert.sentiment === "NEGATIVE"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {alert.sentiment}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg font-bold">
                      {alert.category}
                    </span>
                  </div>
                  <span className="text-gray-500 font-medium">
                    {new Date(alert.created_at).toLocaleString()}
                  </span>
                </div>

                {alert.notes && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      Admin Notes:
                    </p>
                    <p className="text-sm text-blue-800">{alert.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showModal && selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                Take Action on Alert
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-200">
              <p className="text-sm font-semibold text-red-900 mb-2">
                Faculty: {selectedAlert.faculty_name}
              </p>
              <p className="text-sm text-red-800">
                {selectedAlert.feedback_text}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Action Notes
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Enter notes about the action taken..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all font-medium resize-none"
                rows="4"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => handleResolve(selectedAlert.id)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-xl transition-all font-bold"
              >
                ✓ Resolve Alert
              </button>
              <button
                onClick={() => handleDismiss(selectedAlert.id)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:shadow-xl transition-all font-bold"
              >
                Dismiss Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsManagement;
