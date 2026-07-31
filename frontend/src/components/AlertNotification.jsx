import React, { useEffect, useState } from 'react';

const AlertNotification = ({ alertCount, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (alertCount > 0) {
      setIsVisible(true);
    }
  }, [alertCount]);

  if (!isVisible || alertCount === 0) return null;

  return (
    <div className="fixed top-24 right-8 z-50 animate-slide-in">
      <div className="bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white rounded-2xl shadow-2xl p-6 max-w-md border-2 border-red-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center animate-pulse">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-bold">Critical Alert Detected!</h4>
              <p className="text-sm text-red-100">Admin has been notified</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              if (onClose) onClose();
            }}
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4">
          <p className="text-sm font-semibold mb-2">
            {alertCount} {alertCount === 1 ? 'feedback contains' : 'feedbacks contain'} concerning content
          </p>
          <p className="text-xs text-red-100">
            The system has detected potentially serious issues that require immediate attention. 
            The admin team has been automatically notified and will review these cases.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span className="font-medium">Reported to admin dashboard</span>
        </div>
      </div>
    </div>
  );
};

export default AlertNotification;
