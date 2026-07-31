import { useState, useEffect } from "react";
import { database, ref, onValue } from "../firebase/config";

/**
 * Custom hook for real-time Firebase alerts
 * @param {number|null} facultyId - Filter by faculty ID (null for all alerts)
 * @param {string|null} status - Filter by status (Pending, Resolved, Dismissed)
 * @returns {Object} { alerts, loading, error }
 */
export const useFirebaseAlerts = (facultyId = null, status = null) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Reference to alerts in Firebase
    const alertsRef = ref(database, "alerts");

    // Subscribe to real-time updates
    const unsubscribe = onValue(
      alertsRef,
      (snapshot) => {
        try {
          const data = snapshot.val();

          if (!data) {
            setAlerts([]);
            setLoading(false);
            return;
          }

          // Convert Firebase object to array
          const alertsArray = Object.keys(data).map((key) => ({
            firebase_key: key,
            ...data[key],
          }));

          // Apply filters
          let filteredAlerts = alertsArray;

          if (facultyId) {
            filteredAlerts = filteredAlerts.filter(
              (alert) => alert.faculty_id === facultyId
            );
          }

          if (status) {
            filteredAlerts = filteredAlerts.filter(
              (alert) => alert.status === status
            );
          }

          // Sort by timestamp (newest first)
          filteredAlerts.sort((a, b) => {
            const timeA = new Date(a.timestamp || a.created_at || 0);
            const timeB = new Date(b.timestamp || b.created_at || 0);
            return timeB - timeA;
          });

          setAlerts(filteredAlerts);
          setLoading(false);
        } catch (err) {
          console.error("Error processing Firebase alerts:", err);
          setError(err.message);
          setLoading(false);
        }
      },
      (err) => {
        console.error("Firebase error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [facultyId, status]);

  return { alerts, loading, error };
};

/**
 * Get count of pending alerts
 * @param {Array} alerts - Array of alerts
 * @returns {number} Count of pending alerts
 */
export const getPendingAlertsCount = (alerts) => {
  return alerts.filter((alert) => alert.status === "Pending").length;
};

/**
 * Get alerts by priority
 * @param {Array} alerts - Array of alerts
 * @param {string} priority - Priority level (High, Medium, Low)
 * @returns {Array} Filtered alerts
 */
export const getAlertsByPriority = (alerts, priority) => {
  return alerts.filter((alert) => alert.priority === priority);
};

/**
 * Get recent alerts (last 24 hours)
 * @param {Array} alerts - Array of alerts
 * @returns {Array} Recent alerts
 */
export const getRecentAlerts = (alerts) => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return alerts.filter((alert) => {
    const alertTime = new Date(alert.timestamp || alert.created_at);
    return alertTime > oneDayAgo;
  });
};
