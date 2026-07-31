import React, { useState } from 'react';

const EnhancedOverview = () => {
  const [timeRange, setTimeRange] = useState('7days');
  
  // Enhanced stats with vibrant colorful combinations
  const stats = [
    { 
      label: 'Total Feedbacks', 
      value: '1,247', 
      icon: '📊',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-100',
      change: '+12%',
      changeType: 'increase',
      subtext: 'vs last period',
      trend: [45, 52, 48, 61, 55, 67, 72],
      accentColor: 'bg-blue-500'
    },
    { 
      label: 'Positive Feedback', 
      value: '68%', 
      icon: '😊',
      gradient: 'from-emerald-500 to-green-600',
      bgGradient: 'from-emerald-50 to-green-100',
      change: '+5%',
      changeType: 'increase',
      subtext: '848 responses',
      trend: [60, 62, 64, 65, 66, 67, 68],
      accentColor: 'bg-emerald-500'
    },
    { 
      label: 'Negative Feedback', 
      value: '12%', 
      icon: '😟',
      gradient: 'from-rose-500 to-pink-600',
      bgGradient: 'from-rose-50 to-pink-100',
      change: '-3%',
      changeType: 'decrease',
      subtext: '150 responses',
      trend: [18, 17, 15, 14, 13, 12, 12],
      accentColor: 'bg-rose-500'
    },
    { 
      label: 'AI Suggestions', 
      value: '34', 
      icon: '💡',
      gradient: 'from-purple-500 to-violet-600',
      bgGradient: 'from-purple-50 to-violet-100',
      change: '+8',
      changeType: 'increase',
      subtext: 'actionable items',
      trend: [20, 22, 25, 28, 30, 32, 34],
      accentColor: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Vibrant Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-300 opacity-10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-3">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl">🎯</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">Performance Dashboard</h2>
                  <p className="text-white/90 text-sm">Real-time analytics and comprehensive insights</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse shadow-lg"></div>
                  <span className="text-white/90 text-sm font-medium">Live Updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-white/80 text-sm">Updated moments ago</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-3">
              <button className="px-5 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 font-medium text-sm border border-white/30">
                Export Report
              </button>
              <button className="px-5 py-2.5 bg-white text-indigo-600 rounded-xl hover:bg-yellow-300 hover:text-indigo-700 transition-all duration-200 font-bold text-sm shadow-xl">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards with Sparklines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center text-3xl shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {stat.icon}
                </div>
                <div className="flex flex-col items-end">
                  <span className={`flex items-center space-x-1 text-xs font-bold px-3 py-1.5 rounded-full shadow-md ${
                    stat.changeType === 'increase' ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' : 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white'
                  }`}>
                    {stat.changeType === 'increase' ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    )}
                    <span>{stat.change}</span>
                  </span>
                </div>
              </div>

              {/* Value */}
              <div className="mb-3">
                <p className="text-gray-600 text-sm font-bold mb-1 uppercase tracking-wide">{stat.label}</p>
                <p className={`text-5xl font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
                <p className="text-xs text-gray-600 mt-1 font-medium">{stat.subtext}</p>
              </div>

              {/* Mini Sparkline */}
              <div className="flex items-end justify-between h-10 space-x-1">
                {stat.trend.map((height, idx) => (
                  <div 
                    key={idx} 
                    className={`flex-1 bg-gradient-to-t ${stat.gradient} rounded-t-lg opacity-40 group-hover:opacity-80 transition-all duration-300 shadow-sm`}
                    style={{ height: `${(height / Math.max(...stat.trend)) * 100}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Distribution - Enhanced */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Sentiment Analysis</h3>
              <p className="text-xs text-gray-500 mt-1">Current distribution</p>
            </div>
            <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
          
          {/* Donut Chart */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F3F4F6" strokeWidth="12" />
                {/* Positive segment */}
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="none" 
                  stroke="url(#greenGradient)" 
                  strokeWidth="12" 
                  strokeDasharray="170 251" 
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                {/* Neutral segment */}
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="none" 
                  stroke="url(#yellowGradient)" 
                  strokeWidth="12" 
                  strokeDasharray="50 251" 
                  strokeDashoffset="-170" 
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                {/* Negative segment */}
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="none" 
                  stroke="url(#redGradient)" 
                  strokeWidth="12" 
                  strokeDasharray="30 251" 
                  strokeDashoffset="-220" 
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                
                {/* Gradients */}
                <defs>
                  <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                  <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Center content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-800">1,247</p>
                  <p className="text-xs text-gray-500 font-medium">Total</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-100 border-2 border-emerald-300 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full shadow-md"></div>
                <span className="text-sm font-bold text-emerald-800">Positive</span>
              </div>
              <div className="text-right">
                <p className="text-xl font-extrabold text-emerald-700">68%</p>
                <p className="text-xs text-emerald-600 font-medium">848 responses</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-100 border-2 border-amber-300 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full shadow-md"></div>
                <span className="text-sm font-bold text-amber-800">Neutral</span>
              </div>
              <div className="text-right">
                <p className="text-xl font-extrabold text-amber-700">20%</p>
                <p className="text-xs text-amber-600 font-medium">249 responses</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-pink-100 border-2 border-rose-300 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full shadow-md"></div>
                <span className="text-sm font-bold text-rose-800">Negative</span>
              </div>
              <div className="text-right">
                <p className="text-xl font-extrabold text-rose-700">12%</p>
                <p className="text-xs text-rose-600 font-medium">150 responses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Trends - Enhanced */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Feedback Trends</h3>
              <p className="text-xs text-gray-500 mt-1">Weekly performance metrics</p>
            </div>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm border-2 border-gray-200 rounded-xl px-4 py-2 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="year">This Year</option>
            </select>
          </div>
          
          {/* Bar Chart */}
          <div className="relative">
            <div className="h-72 flex items-end justify-between space-x-3">
              {[
                { height: 65, label: 'Mon', value: 812, positive: 68, negative: 12 },
                { height: 72, label: 'Tue', value: 899, positive: 70, negative: 11 },
                { height: 68, label: 'Wed', value: 850, positive: 67, negative: 13 },
                { height: 80, label: 'Thu', value: 1000, positive: 72, negative: 10 },
                { height: 75, label: 'Fri', value: 937, positive: 69, negative: 12 },
                { height: 85, label: 'Sat', value: 1062, positive: 74, negative: 9 },
                { height: 90, label: 'Sun', value: 1125, positive: 76, negative: 8 }
              ].map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 absolute -top-20 transform -translate-x-1/2 left-1/2 whitespace-nowrap shadow-xl">
                    <div className="font-semibold mb-1">{day.label}</div>
                    <div className="space-y-0.5">
                      <div>Total: {day.value}</div>
                      <div className="text-green-400">Positive: {day.positive}%</div>
                      <div className="text-red-400">Negative: {day.negative}%</div>
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                  </div>
                  
                  {/* Bar */}
                  <div className="w-full relative">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 via-indigo-500 to-purple-500 rounded-t-xl transition-all duration-500 hover:from-blue-700 hover:via-indigo-600 hover:to-purple-600 shadow-xl cursor-pointer relative overflow-hidden group-hover:shadow-2xl" 
                      style={{ height: `${day.height * 3}px` }}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white to-transparent opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                    </div>
                  </div>
                  
                  {/* Label */}
                  <p className="text-xs font-semibold text-gray-600 mt-3">{day.label}</p>
                  <p className="text-xs text-gray-400">{day.value}</p>
                </div>
              ))}
            </div>
            
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="border-t border-gray-100"></div>
              ))}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Avg. Positive</p>
              </div>
              <p className="text-2xl font-bold text-gray-800">71%</p>
            </div>
            <div className="text-center border-x border-gray-100">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Total Volume</p>
              </div>
              <p className="text-2xl font-bold text-gray-800">6,685</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Peak Day</p>
              </div>
              <p className="text-2xl font-bold text-gray-800">Sun</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Category Breakdown</h3>
              <p className="text-xs text-gray-500 mt-1">Feedback by category</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { name: 'Teaching Quality', value: 85, count: 423, icon: '👨‍🏫', gradient: 'from-blue-500 to-cyan-500', bgColor: 'bg-gradient-to-br from-blue-100 to-cyan-100' },
              { name: 'Course Content', value: 78, count: 389, icon: '📚', gradient: 'from-purple-500 to-pink-500', bgColor: 'bg-gradient-to-br from-purple-100 to-pink-100' },
              { name: 'Communication', value: 72, count: 358, icon: '💬', gradient: 'from-teal-500 to-emerald-500', bgColor: 'bg-gradient-to-br from-teal-100 to-emerald-100' },
              { name: 'Infrastructure', value: 65, count: 324, icon: '🏢', gradient: 'from-orange-500 to-amber-500', bgColor: 'bg-gradient-to-br from-orange-100 to-amber-100' },
              { name: 'Behavior', value: 92, count: 458, icon: '🤝', gradient: 'from-green-500 to-lime-500', bgColor: 'bg-gradient-to-br from-green-100 to-lime-100' }
            ].map((category, index) => (
              <div key={index} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${category.bgColor} border-2 border-white shadow-lg rounded-xl flex items-center justify-center text-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-200`}>
                      {category.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{category.name}</p>
                      <p className="text-xs text-gray-600 font-medium">{category.count} feedbacks</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-extrabold bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}>{category.value}%</p>
                  </div>
                </div>
                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r ${category.gradient} rounded-full transition-all duration-1000 ease-out shadow-md`}
                    style={{ width: `${category.value}%` }}
                  >
                    <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions & Insights */}
        <div className="space-y-6">
          {/* Top Insights */}
          <div className="bg-gradient-to-r from-yellow-100 via-amber-100 to-orange-100 border-l-4 border-orange-500 rounded-2xl p-6 shadow-xl">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0 animate-pulse">
                🔥
              </div>
              <div className="flex-1">
                <h4 className="text-base font-extrabold text-orange-900 mb-2">🌟 Top Insight of the Week</h4>
                <p className="text-sm text-gray-800 leading-relaxed mb-3 font-medium">
                  Students highly appreciate interactive teaching methods. Consider increasing Q&A sessions by 20% for better engagement.
                </p>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-md">High Priority</span>
                  <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold rounded-full shadow-md">Teaching</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
            <h4 className="text-sm font-bold text-gray-800 mb-4">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 group shadow-xl hover:shadow-2xl transform hover:scale-105">
                <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-white">Upload File</span>
              </button>
              
              <button className="flex flex-col items-center justify-center p-5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 group shadow-xl hover:shadow-2xl transform hover:scale-105">
                <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-white">View Reports</span>
              </button>
              
              <button className="flex flex-col items-center justify-center p-5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 group shadow-xl hover:shadow-2xl transform hover:scale-105">
                <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-white">AI Insights</span>
              </button>
              
              <button className="flex flex-col items-center justify-center p-5 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 group shadow-xl hover:shadow-2xl transform hover:scale-105">
                <div className="w-14 h-14 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-white">View Alerts</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Performance Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
              <p className="text-xs text-gray-500 mt-1">Latest feedback submissions</p>
            </div>
            <button className="text-sm text-indigo-600 font-semibold hover:text-indigo-700">View All →</button>
          </div>
          
          <div className="space-y-4">
            {[
              { time: '2 min ago', student: 'Student #1247', sentiment: 'positive', text: 'Excellent teaching methodology and clear explanations', category: 'Teaching' },
              { time: '15 min ago', student: 'Student #1246', sentiment: 'neutral', text: 'Course content is good but needs more practical examples', category: 'Content' },
              { time: '1 hour ago', student: 'Student #1245', sentiment: 'positive', text: 'Very helpful and approachable professor', category: 'Behavior' },
              { time: '2 hours ago', student: 'Student #1244', sentiment: 'negative', text: 'Lab equipment needs maintenance', category: 'Infrastructure' }
            ].map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 group">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.sentiment === 'positive' ? 'bg-green-100' :
                  activity.sentiment === 'negative' ? 'bg-red-100' : 'bg-yellow-100'
                }`}>
                  <span className="text-lg">
                    {activity.sentiment === 'positive' ? '😊' : activity.sentiment === 'negative' ? '😟' : '😐'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-gray-800">{activity.student}</p>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{activity.text}</p>
                  <span className="inline-block px-2 py-1 bg-white text-gray-600 text-xs font-medium rounded-full border border-gray-200">
                    {activity.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Score Card */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 shadow-2xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-300 opacity-20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-300 opacity-20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-extrabold">Performance Score</h3>
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>

            {/* Circular Progress */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-44 h-44">
                <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="none" 
                    stroke="#fbbf24" 
                    strokeWidth="10" 
                    strokeDasharray="220 251" 
                    strokeLinecap="round"
                    className="transition-all duration-1000 drop-shadow-lg"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-6xl font-extrabold mb-1 text-yellow-300">87</p>
                    <p className="text-sm text-white/90 font-medium">out of 100</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg">
                <span className="text-sm font-bold text-white">Student Satisfaction</span>
                <span className="text-lg font-extrabold text-yellow-300">92%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg">
                <span className="text-sm font-bold text-white">Response Rate</span>
                <span className="text-lg font-extrabold text-cyan-300">85%</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg">
                <span className="text-sm font-bold text-white">Improvement</span>
                <span className="text-lg font-extrabold flex items-center text-green-300">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  +12%
                </span>
              </div>
            </div>

            <button className="w-full mt-6 px-4 py-3.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-extrabold hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105">
              View Detailed Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedOverview;
