import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5002';

const TestTrendsAPI = () => {
  const { user } = useAuth();
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testEndpoint = async (name, url) => {
    const token = localStorage.getItem('token');
    
    try {
      console.log(`Testing ${name}:`, url);
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log(`✅ ${name} Success:`, response.data);
      return { success: true, data: response.data, status: response.status };
    } catch (err) {
      console.error(`❌ ${name} Error:`, err);
      return { 
        success: false, 
        error: err.message, 
        status: err.response?.status,
        details: err.response?.data 
      };
    }
  };

  const runAllTests = async () => {
    if (!user || !user.id) {
      setError('No user logged in');
      return;
    }

    setLoading(true);
    setError(null);
    setResults({});

    const tests = {
      'Sentiment Stats': `${API_BASE_URL}/api/faculty/${user.id}/sentiment_stats`,
      'Category Distribution': `${API_BASE_URL}/api/faculty/${user.id}/category_distribution`,
      'Alerts': `${API_BASE_URL}/api/faculty/${user.id}/alerts`,
      'Trends': `${API_BASE_URL}/api/faculty/${user.id}/trends`,
      'Monthly Summary': `${API_BASE_URL}/api/faculty/${user.id}/monthly_summary`,
      'Category Scores': `${API_BASE_URL}/api/faculty/${user.id}/category_scores`,
      'Stats Summary': `${API_BASE_URL}/api/faculty/${user.id}/stats_summary`,
    };

    const testResults = {};
    
    for (const [name, url] of Object.entries(tests)) {
      testResults[name] = await testEndpoint(name, url);
    }

    setResults(testResults);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">🧪 Trends API Test Page</h1>
          
          {/* User Info */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <h2 className="text-lg font-bold text-blue-800 mb-2">User Information</h2>
            <div className="space-y-1 text-sm">
              <p><strong>User ID:</strong> {user?.id || 'Not logged in'}</p>
              <p><strong>Email:</strong> {user?.email || 'N/A'}</p>
              <p><strong>Name:</strong> {user?.first_name} {user?.last_name}</p>
              <p><strong>Token:</strong> {localStorage.getItem('token') ? '✅ Present' : '❌ Missing'}</p>
              <p><strong>API Base URL:</strong> {API_BASE_URL}</p>
            </div>
          </div>

          {/* Test Button */}
          <button
            onClick={runAllTests}
            disabled={loading || !user}
            className="w-full px-6 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-bold text-lg mb-6 transition-colors"
          >
            {loading ? '🔄 Testing...' : '🚀 Run All API Tests'}
          </button>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-800 font-semibold">❌ Error: {error}</p>
            </div>
          )}

          {/* Results */}
          {Object.keys(results).length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Results</h2>
              
              {Object.entries(results).map(([name, result]) => (
                <div
                  key={name}
                  className={`border-2 rounded-xl p-4 ${
                    result.success
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold">
                      {result.success ? '✅' : '❌'} {name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      result.success
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}>
                      Status: {result.status || 'N/A'}
                    </span>
                  </div>
                  
                  {result.success ? (
                    <div className="bg-white rounded-lg p-3 mt-2">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Response Data:</p>
                      <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <p className="text-red-700 font-semibold">Error: {result.error}</p>
                      {result.details && (
                        <pre className="text-xs bg-white p-3 rounded mt-2 overflow-x-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Instructions */}
          {Object.keys(results).length === 0 && !loading && (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">📋 Instructions</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Make sure you're logged in as a faculty member</li>
                <li>Ensure backend is running on port 5002</li>
                <li>Click "Run All API Tests" button above</li>
                <li>Check the results for each endpoint</li>
                <li>Open browser console (F12) for detailed logs</li>
              </ol>
              
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>💡 Tip:</strong> If all tests fail with 401 errors, try logging out and logging back in to refresh your token.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestTrendsAPI;
