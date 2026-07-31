import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002';

const TrendsInsightsLive = ({ refreshTrigger }) => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for real data
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryScores, setCategoryScores] = useState([]);
  const [sentimentStats, setSentimentStats] = useState({ POSITIVE: 0, NEGATIVE: 0, NEUTRAL: 0 });
  const [alertCount, setAlertCount] = useState(0);
  const [statsSummary, setStatsSummary] = useState(null);

  useEffect(() => {
    if (user && user.id) {
      console.log('🔄 TrendsInsightsLive: Fetching data (refreshTrigger:', refreshTrigger, ')');
      console.log('👤 User ID:', user.id);
      console.log('🔑 Token exists:', !!localStorage.getItem('token'));
      fetchAllData();
    } else {
      console.warn('⚠️ TrendsInsightsLive: No user or user ID found');
      console.log('User object:', user);
    }
  }, [user, refreshTrigger]); // Added refreshTrigger to dependencies

  const fetchAllData = async () => {
    if (!user || !user.id) {
      console.log('No user or user ID found');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No token found in localStorage');
        setError('Authentication token missing. Please login again.');
        setLoading(false);
        return;
      }
      
      console.log('📊 Fetching analytics data for user:', user.id);
      console.log('🔑 Token exists:', !!token);
      console.log('🔑 Token preview:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
      console.log('🌐 API Base URL:', API_BASE_URL);
      
      const config = {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Fetch all data in parallel
      const [
        monthlyRes,
        categoryScoresRes,
        sentimentRes,
        alertsRes,
        statsRes
      ] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/faculty/${user.id}/monthly_summary`, config),
        axios.get(`${API_BASE_URL}/api/faculty/${user.id}/category_scores`, config),
        axios.get(`${API_BASE_URL}/api/faculty/${user.id}/sentiment_stats`, config),
        axios.get(`${API_BASE_URL}/api/faculty/${user.id}/alerts`, config),
        axios.get(`${API_BASE_URL}/api/faculty/${user.id}/stats_summary`, config)
      ]);

      console.log('✅ Analytics data fetched successfully');
      console.log('📊 Monthly Data:', monthlyRes.data);
      console.log('📊 Category Scores:', categoryScoresRes.data);
      console.log('📊 Sentiment Stats:', sentimentRes.data);
      console.log('📊 Alert Count:', alertsRes.data.alerts);
      console.log('📊 Stats Summary:', statsRes.data);
      
      setMonthlyData(monthlyRes.data);
      setCategoryScores(categoryScoresRes.data);
      setSentimentStats(sentimentRes.data);
      setAlertCount(alertsRes.data.alerts);
      setStatsSummary(statsRes.data);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      console.error('Error response:', err.response);
      
      if (err.response && err.response.status === 401) {
        setError('Session expired. Please logout and login again.');
      } else if (err.response && err.response.status === 403) {
        setError('Access denied. You do not have permission to view this data.');
      } else {
        setError('Failed to load analytics data. Please try again.');
      }
      
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Data</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchAllData}
          className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  // Calculate total sentiment for pie chart
  const totalSentiment = sentimentStats.POSITIVE + sentimentStats.NEGATIVE + sentimentStats.NEUTRAL;
  
  // Check if there's any data - check sentiment stats too!
  const hasData = monthlyData.length > 0 || categoryScores.length > 0 || totalSentiment > 0 || (statsSummary && statsSummary.total_feedback > 0);
  
  // Debug logging
  console.log('Data check:', {
    monthlyData: monthlyData.length,
    categoryScores: categoryScores.length,
    totalSentiment,
    statsSummary: statsSummary?.total_feedback,
    hasData
  });

  if (!hasData) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-12 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Data Yet</h3>
        <p className="text-gray-600 mb-6">Upload feedback to see trends and insights here.</p>
        <button
          onClick={fetchAllData}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-4 md:p-6 lg:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white mb-2">📈 Trends & Insights</h2>
            <p className="text-white/90 text-xs md:text-sm">Real-time analytics from your feedback data</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <button
              onClick={fetchAllData}
              className="px-4 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl border-2 border-white/30 font-medium text-sm hover:bg-white/30 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      {statsSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                📊
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                Total
              </span>
            </div>
            <p className="text-gray-600 text-sm font-bold mb-1 uppercase tracking-wide">Total Feedback</p>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              {statsSummary.total_feedback}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                📈
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                {statsSummary.positive_percentage}%
              </span>
            </div>
            <p className="text-gray-600 text-sm font-bold mb-1 uppercase tracking-wide">Positive Rate</p>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              {statsSummary.positive_percentage}%
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                🚀
              </div>
              <span className={`px-3 py-1 ${statsSummary.improvement >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} text-xs font-bold rounded-full`}>
                {statsSummary.improvement >= 0 ? '+' : ''}{statsSummary.improvement}%
              </span>
            </div>
            <p className="text-gray-600 text-sm font-bold mb-1 uppercase tracking-wide">Growth</p>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
              {statsSummary.improvement >= 0 ? '+' : ''}{statsSummary.improvement}%
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                🚨
              </div>
              <span className={`px-3 py-1 ${alertCount > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} text-xs font-bold rounded-full`}>
                {alertCount > 0 ? 'Action Needed' : 'All Clear'}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-bold mb-1 uppercase tracking-wide">Alerts</p>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
              {alertCount}
            </p>
          </div>
        </div>
      )}

      {/* Sentiment Distribution Pie Chart */}
      {totalSentiment > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Sentiment Distribution</h3>
          <div className="flex flex-col md:flex-row items-center justify-around gap-8">
            {/* Pie Chart */}
            <div className="relative w-64 h-64">
              <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                {(() => {
                  const positivePercent = (sentimentStats.POSITIVE / totalSentiment) * 100;
                  const neutralPercent = (sentimentStats.NEUTRAL / totalSentiment) * 100;
                  const negativePercent = (sentimentStats.NEGATIVE / totalSentiment) * 100;
                  
                  const positiveAngle = (positivePercent / 100) * 360;
                  const neutralAngle = (neutralPercent / 100) * 360;
                  const negativeAngle = (negativePercent / 100) * 360;
                  
                  let currentAngle = 0;
                  
                  const createArc = (startAngle, endAngle, color) => {
                    const start = (startAngle * Math.PI) / 180;
                    const end = (endAngle * Math.PI) / 180;
                    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
                    
                    const x1 = 100 + 80 * Math.cos(start);
                    const y1 = 100 + 80 * Math.sin(start);
                    const x2 = 100 + 80 * Math.cos(end);
                    const y2 = 100 + 80 * Math.sin(end);
                    
                    return (
                      <path
                        d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={color}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    );
                  };
                  
                  return (
                    <>
                      {positivePercent > 0 && createArc(currentAngle, currentAngle + positiveAngle, '#10b981')}
                      {neutralPercent > 0 && createArc(currentAngle + positiveAngle, currentAngle + positiveAngle + neutralAngle, '#f59e0b')}
                      {negativePercent > 0 && createArc(currentAngle + positiveAngle + neutralAngle, 360, '#f43f5e')}
                      <circle cx="100" cy="100" r="50" fill="white" />
                    </>
                  );
                })()}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-800">{totalSentiment}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-lg"></div>
                <div>
                  <p className="font-bold text-gray-800">Positive</p>
                  <p className="text-2xl font-extrabold text-emerald-600">{sentimentStats.POSITIVE}</p>
                  <p className="text-sm text-gray-500">{((sentimentStats.POSITIVE / totalSentiment) * 100).toFixed(1)}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-500 rounded-lg"></div>
                <div>
                  <p className="font-bold text-gray-800">Neutral</p>
                  <p className="text-2xl font-extrabold text-amber-600">{sentimentStats.NEUTRAL}</p>
                  <p className="text-sm text-gray-500">{((sentimentStats.NEUTRAL / totalSentiment) * 100).toFixed(1)}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-rose-500 rounded-lg"></div>
                <div>
                  <p className="font-bold text-gray-800">Negative</p>
                  <p className="text-2xl font-extrabold text-rose-600">{sentimentStats.NEGATIVE}</p>
                  <p className="text-sm text-gray-500">{((sentimentStats.NEGATIVE / totalSentiment) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Trend Chart */}
      {monthlyData.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Monthly Sentiment Trends</h3>
              <p className="text-sm text-gray-500 mt-1">Last {monthlyData.length} months performance</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-xs font-semibold text-gray-700">Positive</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-xs font-semibold text-gray-700">Neutral</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                <span className="text-xs font-semibold text-gray-700">Negative</span>
              </span>
            </div>
          </div>

          <div className="h-80">
            <svg className="w-full h-full" viewBox="0 0 800 320" preserveAspectRatio="xMidYMid meet">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line
                  key={i}
                  x1="50"
                  y1={50 + i * 50}
                  x2="750"
                  y2={50 + i * 50}
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
              ))}

              {/* Y-axis labels */}
              {[100, 75, 50, 25, 0].map((val, i) => (
                <text
                  key={i}
                  x="30"
                  y={50 + i * 50 + 5}
                  className="text-xs fill-gray-400 font-medium"
                  textAnchor="end"
                >
                  {val}%
                </text>
              ))}

              {/* Lines */}
              {monthlyData.length > 1 && (
                <>
                  {/* Positive line */}
                  <path
                    d={monthlyData.map((d, i) => {
                      const x = 100 + i * (650 / (monthlyData.length - 1));
                      const y = 250 - d.positive * 2;
                      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  
                  {/* Neutral line */}
                  <path
                    d={monthlyData.map((d, i) => {
                      const x = 100 + i * (650 / (monthlyData.length - 1));
                      const y = 250 - d.neutral * 2;
                      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  
                  {/* Negative line */}
                  <path
                    d={monthlyData.map((d, i) => {
                      const x = 100 + i * (650 / (monthlyData.length - 1));
                      const y = 250 - d.negative * 2;
                      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </>
              )}

              {/* Data points and labels */}
              {monthlyData.map((d, i) => {
                const x = 100 + i * (650 / Math.max(monthlyData.length - 1, 1));
                return (
                  <g key={i}>
                    <circle cx={x} cy={250 - d.positive * 2} r="5" fill="#10b981" stroke="white" strokeWidth="2" />
                    <circle cx={x} cy={250 - d.neutral * 2} r="5" fill="#f59e0b" stroke="white" strokeWidth="2" />
                    <circle cx={x} cy={250 - d.negative * 2} r="5" fill="#f43f5e" stroke="white" strokeWidth="2" />
                    
                    <text x={x} y="290" textAnchor="middle" className="text-sm fill-gray-600 font-semibold">
                      {d.month}
                    </text>
                    <text x={x} y="305" textAnchor="middle" className="text-xs fill-gray-400">
                      {d.total}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* Category Performance */}
      {categoryScores.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Category Performance</h3>
          <div className="space-y-6">
            {categoryScores.map((cat, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-md ${
                      index % 5 === 0 ? 'bg-gradient-to-br from-blue-100 to-cyan-100' :
                      index % 5 === 1 ? 'bg-gradient-to-br from-purple-100 to-pink-100' :
                      index % 5 === 2 ? 'bg-gradient-to-br from-teal-100 to-emerald-100' :
                      index % 5 === 3 ? 'bg-gradient-to-br from-orange-100 to-amber-100' :
                      'bg-gradient-to-br from-green-100 to-lime-100'
                    }`}>
                      {index % 5 === 0 ? '👨‍🏫' : index % 5 === 1 ? '📚' : index % 5 === 2 ? '💬' : index % 5 === 3 ? '🏢' : '🤝'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{cat.category}</p>
                      <p className="text-xs text-gray-500">Target: {cat.target}%</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Previous</p>
                      <p className="text-lg font-bold text-purple-600">{cat.previous}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Current</p>
                      <p className="text-2xl font-extrabold text-blue-600">{cat.current}%</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      cat.current > cat.previous ? 'bg-green-100 text-green-700' : 
                      cat.current < cat.previous ? 'bg-red-100 text-red-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {cat.current > cat.previous ? '↑' : cat.current < cat.previous ? '↓' : '='} {Math.abs(cat.current - cat.previous)}%
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r ${
                      index % 5 === 0 ? 'from-blue-500 to-cyan-500' :
                      index % 5 === 1 ? 'from-purple-500 to-pink-500' :
                      index % 5 === 2 ? 'from-teal-500 to-emerald-500' :
                      index % 5 === 3 ? 'from-orange-500 to-amber-500' :
                      'from-green-500 to-lime-500'
                    } rounded-full transition-all duration-1000`}
                    style={{ width: `${cat.current}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendsInsightsLive;
