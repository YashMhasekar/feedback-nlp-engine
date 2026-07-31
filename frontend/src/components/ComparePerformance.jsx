import React, { useState } from 'react';

const ComparePerformance = () => {
  const [comparisonType, setComparisonType] = useState('time');
  const [selectedPeriod, setSelectedPeriod] = useState('semester');

  // Sample data - will be replaced with database data
  const timeComparison = {
    current: { period: 'Fall 2024', score: 87, positive: 72, neutral: 18, negative: 10 },
    previous: { period: 'Spring 2024', score: 82, positive: 68, neutral: 20, negative: 12 },
    yearAgo: { period: 'Fall 2023', score: 78, positive: 65, neutral: 22, negative: 13 }
  };

  const categoryComparison = [
    { category: 'Teaching Quality', current: 88, previous: 82, department: 85, improvement: 6 },
    { category: 'Course Content', current: 85, previous: 80, department: 83, improvement: 5 },
    { category: 'Communication', current: 90, previous: 85, department: 87, improvement: 5 },
    { category: 'Availability', current: 82, previous: 78, department: 80, improvement: 4 },
    { category: 'Assessment', current: 86, previous: 83, department: 84, improvement: 3 }
  ];

  const peerComparison = [
    { name: 'You', score: 87, students: 245, courses: 3, color: 'from-blue-500 to-cyan-500' },
    { name: 'Dept. Average', score: 83, students: 220, courses: 3, color: 'from-gray-400 to-gray-500' },
    { name: 'Top Performer', score: 92, students: 198, courses: 2, color: 'from-emerald-500 to-teal-500' },
    { name: 'College Average', score: 81, students: 235, courses: 3, color: 'from-purple-400 to-pink-400' }
  ];

  const monthlyProgress = [
    { month: 'Aug', score: 82, feedback: 45 },
    { month: 'Sep', score: 84, feedback: 52 },
    { month: 'Oct', score: 85, feedback: 48 },
    { month: 'Nov', score: 87, feedback: 55 },
    { month: 'Dec', score: 87, feedback: 45 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 rounded-2xl p-4 md:p-6 lg:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white mb-2">
              ⚖️ Compare Performance
            </h2>
            <p className="text-white/90 text-xs md:text-sm">
              Comprehensive performance analysis and benchmarking
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              value={comparisonType}
              onChange={(e) => setComparisonType(e.target.value)}
              className="px-4 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl border-2 border-white/30 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
            >
              <option value="time" className="text-gray-800">Time Periods</option>
              <option value="category" className="text-gray-800">Categories</option>
              <option value="peer" className="text-gray-800">Peer Benchmark</option>
              <option value="progress" className="text-gray-800">Progress Tracking</option>
            </select>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl border-2 border-white/30 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
            >
              <option value="semester" className="text-gray-800">This Semester</option>
              <option value="year" className="text-gray-800">This Year</option>
              <option value="all" className="text-gray-800">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Time Period Comparison */}
      {comparisonType === 'time' && (
        <div className="space-y-6">
          {/* Score Cards Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { data: timeComparison.current, gradient: 'from-blue-500 to-cyan-500', label: 'Current Period', icon: '🎯' },
              { data: timeComparison.previous, gradient: 'from-purple-500 to-pink-500', label: 'Previous Period', icon: '📅' },
              { data: timeComparison.yearAgo, gradient: 'from-orange-500 to-amber-500', label: 'Year Ago', icon: '📆' }
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center text-3xl shadow-lg`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{item.label}</span>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">{item.data.period}</p>
                  <p className={`text-5xl font-extrabold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                    {item.data.score}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Overall Score</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Positive</span>
                    <span className="font-bold text-emerald-600">{item.data.positive}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Neutral</span>
                    <span className="font-bold text-amber-600">{item.data.neutral}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Negative</span>
                    <span className="font-bold text-rose-600">{item.data.negative}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Performance Trend Comparison</h3>
            <div className="relative h-80">
              <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
                {/* Grid */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line key={i} x1="50" y1={50 + i * 50} x2="750" y2={50 + i * 50} stroke="#f3f4f6" strokeWidth="1" />
                ))}
                
                {/* Bars for each period */}
                {[
                  { x: 150, data: timeComparison.yearAgo, color: '#f59e0b' },
                  { x: 350, data: timeComparison.previous, color: '#a855f7' },
                  { x: 550, data: timeComparison.current, color: '#3b82f6' }
                ].map((item, index) => (
                  <g key={index}>
                    {/* Score bar */}
                    <rect
                      x={item.x - 40}
                      y={250 - item.data.score * 2}
                      width="80"
                      height={item.data.score * 2}
                      fill={item.color}
                      rx="8"
                      opacity="0.9"
                      className="hover:opacity-100 transition-opacity cursor-pointer"
                    />
                    {/* Score label */}
                    <text
                      x={item.x}
                      y={240 - item.data.score * 2}
                      textAnchor="middle"
                      className="text-sm font-bold fill-gray-700"
                    >
                      {item.data.score}
                    </text>
                    {/* Period label */}
                    <text
                      x={item.x}
                      y="280"
                      textAnchor="middle"
                      className="text-xs font-semibold fill-gray-600"
                    >
                      {item.data.period}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Category Comparison */}
      {comparisonType === 'category' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Category-wise Performance</h3>
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-xs font-semibold text-gray-600">Current</span>
                </span>
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-400 rounded opacity-60"></div>
                  <span className="text-xs font-semibold text-gray-600">Previous</span>
                </span>
                <span className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-emerald-500 rounded"></div>
                  <span className="text-xs font-semibold text-gray-600">Department</span>
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {categoryComparison.map((cat, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-md ${
                        index === 0 ? 'bg-gradient-to-br from-blue-100 to-cyan-100' :
                        index === 1 ? 'bg-gradient-to-br from-purple-100 to-pink-100' :
                        index === 2 ? 'bg-gradient-to-br from-emerald-100 to-teal-100' :
                        index === 3 ? 'bg-gradient-to-br from-orange-100 to-amber-100' :
                        'bg-gradient-to-br from-rose-100 to-pink-100'
                      }`}>
                        {index === 0 ? '👨‍🏫' : index === 1 ? '📚' : index === 2 ? '💬' : index === 3 ? '⏰' : '📝'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{cat.category}</p>
                        <p className="text-xs text-gray-500">+{cat.improvement} points improvement</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Previous</p>
                        <p className="text-lg font-bold text-purple-600">{cat.previous}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Current</p>
                        <p className="text-2xl font-extrabold text-blue-600">{cat.current}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Dept</p>
                        <p className="text-lg font-bold text-emerald-600">{cat.department}</p>
                      </div>
                    </div>
                  </div>

                  {/* Comparison bars */}
                  <div className="relative h-16 bg-gray-50 rounded-xl overflow-hidden">
                    {/* Department average line */}
                    <div 
                      className="absolute top-0 h-full w-1 bg-emerald-500 z-10"
                      style={{ left: `${cat.department}%` }}
                    >
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-emerald-500 rounded-full"></div>
                    </div>
                    
                    {/* Previous bar */}
                    <div 
                      className="absolute top-0 h-1/2 bg-gradient-to-r from-purple-400 to-pink-400 opacity-60 transition-all duration-1000"
                      style={{ width: `${cat.previous}%` }}
                    ></div>
                    
                    {/* Current bar */}
                    <div 
                      className="absolute bottom-0 h-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000 shadow-lg"
                      style={{ width: `${cat.current}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Peer Benchmark */}
      {comparisonType === 'peer' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {peerComparison.map((peer, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl p-6 shadow-xl border-2 ${
                  index === 0 ? 'border-blue-300 ring-4 ring-blue-100' : 'border-gray-100'
                } hover:shadow-2xl transition-all duration-300`}
              >
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-br ${peer.color} rounded-full flex items-center justify-center text-4xl shadow-xl`}>
                    {index === 0 ? '👤' : index === 1 ? '📊' : index === 2 ? '🏆' : '🎓'}
                  </div>
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{peer.name}</h4>
                  <div className={`text-5xl font-extrabold bg-gradient-to-r ${peer.color} bg-clip-text text-transparent mb-4`}>
                    {peer.score}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Students</span>
                      <span className="font-bold text-gray-800">{peer.students}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Courses</span>
                      <span className="font-bold text-gray-800">{peer.courses}</span>
                    </div>
                  </div>
                  {index === 0 && (
                    <div className="mt-4 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                      Your Performance
                    </div>
                  )}
                  {index === 2 && (
                    <div className="mt-4 px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold">
                      Top in Department
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Ranking visualization */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Performance Ranking</h3>
            <div className="space-y-4">
              {peerComparison.sort((a, b) => b.score - a.score).map((peer, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-amber-500 text-white' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-800">{peer.name}</span>
                      <span className="text-2xl font-extrabold text-gray-800">{peer.score}</span>
                    </div>
                    <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full bg-gradient-to-r ${peer.color} rounded-full transition-all duration-1000`}
                        style={{ width: `${(peer.score / 100) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Progress Tracking */}
      {comparisonType === 'progress' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Monthly Progress Tracking</h3>
            <div className="relative h-80">
              <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
                {/* Grid */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line key={i} x1="50" y1={50 + i * 50} x2="750" y2={50 + i * 50} stroke="#f3f4f6" strokeWidth="1" />
                ))}

                {/* Line chart */}
                <path
                  d={monthlyProgress.map((d, i) => {
                    const x = 100 + i * 150;
                    const y = 250 - (d.score - 70) * 10;
                    if (i === 0) return `M ${x} ${y}`;
                    const prevX = 100 + (i - 1) * 150;
                    const prevY = 250 - (monthlyProgress[i - 1].score - 70) * 10;
                    const cpX1 = prevX + 75;
                    const cpX2 = x - 75;
                    return `C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Data points */}
                {monthlyProgress.map((d, i) => {
                  const x = 100 + i * 150;
                  const y = 250 - (d.score - 70) * 10;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r="8" fill="#3b82f6" stroke="white" strokeWidth="3" />
                      <text x={x} y={y - 15} textAnchor="middle" className="text-sm font-bold fill-gray-700">
                        {d.score}
                      </text>
                      <text x={x} y="280" textAnchor="middle" className="text-sm font-semibold fill-gray-600">
                        {d.month}
                      </text>
                      <text x={x} y="295" textAnchor="middle" className="text-xs fill-gray-400">
                        {d.feedback} fb
                      </text>
                    </g>
                  );
                })}

                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Growth metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Total Growth', value: '+5 pts', icon: '📈', color: 'from-emerald-500 to-teal-500', percent: '+6.1%' },
              { label: 'Best Month', value: 'Nov', icon: '🏆', color: 'from-blue-500 to-cyan-500', percent: '87 score' },
              { label: 'Avg Feedback', value: '49', icon: '💬', color: 'from-purple-500 to-pink-500', percent: 'per month' }
            ].map((metric, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <div className={`w-14 h-14 bg-gradient-to-br ${metric.color} rounded-xl flex items-center justify-center text-3xl shadow-lg mb-4`}>
                  {metric.icon}
                </div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wide mb-1">{metric.label}</p>
                <p className={`text-4xl font-extrabold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent mb-1`}>
                  {metric.value}
                </p>
                <p className="text-sm text-gray-500">{metric.percent}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePerformance;
