import React, { useState } from 'react';

const TrendsInsights = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample data - will be replaced with real database data
  const monthlyData = [
    { month: 'Jan', positive: 65, neutral: 25, negative: 10, total: 180 },
    { month: 'Feb', positive: 68, neutral: 22, negative: 10, total: 195 },
    { month: 'Mar', positive: 70, neutral: 20, negative: 10, total: 210 },
    { month: 'Apr', positive: 72, neutral: 18, negative: 10, total: 225 },
    { month: 'May', positive: 75, neutral: 17, negative: 8, total: 240 },
    { month: 'Jun', positive: 78, neutral: 15, negative: 7, total: 255 }
  ];

  const categoryScores = [
    { category: 'Teaching', current: 85, previous: 78, target: 90 },
    { category: 'Content', current: 82, previous: 75, target: 88 },
    { category: 'Communication', current: 88, previous: 82, target: 92 },
    { category: 'Infrastructure', current: 70, previous: 68, target: 85 },
    { category: 'Behavior', current: 92, previous: 88, target: 95 }
  ];

  const weeklyComparison = [
    { week: 'Week 1', current: 820, previous: 750 },
    { week: 'Week 2', current: 890, previous: 780 },
    { week: 'Week 3', current: 950, previous: 820 },
    { week: 'Week 4', current: 1020, previous: 880 }
  ];

  return (
    <div className="space-y-6">
      {/* Header with Filters - Fully Responsive */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-4 md:p-6 lg:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white mb-2">📈 Trends & Insights</h2>
            <p className="text-white/90 text-xs md:text-sm">Comprehensive analytics and performance trends</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl border-2 border-white/30 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-white/50 hover:bg-white/30 transition-all duration-200 cursor-pointer"
            >
              <option value="1month" className="text-gray-800">Last Month</option>
              <option value="3months" className="text-gray-800">Last 3 Months</option>
              <option value="6months" className="text-gray-800">Last 6 Months</option>
              <option value="1year" className="text-gray-800">Last Year</option>
            </select>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 bg-white/20 backdrop-blur-sm text-white rounded-xl border-2 border-white/30 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-white/50 hover:bg-white/30 transition-all duration-200 cursor-pointer"
            >
              <option value="all" className="text-gray-800">All Categories</option>
              <option value="teaching" className="text-gray-800">Teaching</option>
              <option value="content" className="text-gray-800">Content</option>
              <option value="communication" className="text-gray-800">Communication</option>
              <option value="infrastructure" className="text-gray-800">Infrastructure</option>
            </select>
          </div>
        </div>
      </div>

      {/* Monthly Trend Line Chart - Responsive */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-xl border border-gray-100">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-800">Monthly Sentiment Trends</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1">6-month performance overview</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-100 rounded-lg shadow-sm">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-emerald-700">Positive</span>
            </span>
            <span className="flex items-center space-x-2 px-3 py-1.5 bg-amber-100 rounded-lg shadow-sm">
              <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-amber-700">Neutral</span>
            </span>
            <span className="flex items-center space-x-2 px-3 py-1.5 bg-rose-100 rounded-lg shadow-sm">
              <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-rose-700">Negative</span>
            </span>
          </div>
        </div>

        {/* Smooth Professional Line Chart */}
        <div className="relative h-80 md:h-96">
          <svg className="w-full h-full" viewBox="0 0 800 320" preserveAspectRatio="xMidYMid meet">
            {/* Subtle grid lines */}
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

            {/* Smooth curved lines - Professional style */}
            {/* Positive line */}
            <path
              d={monthlyData.map((d, i) => {
                const x = 100 + i * 130;
                const y = 250 - d.positive * 2;
                if (i === 0) return `M ${x} ${y}`;
                const prevX = 100 + (i - 1) * 130;
                const prevY = 250 - monthlyData[i - 1].positive * 2;
                const cpX1 = prevX + 65;
                const cpX2 = x - 65;
                return `C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
              }).join(' ')}
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.9"
              className="transition-all duration-300"
            />
            
            {/* Neutral line */}
            <path
              d={monthlyData.map((d, i) => {
                const x = 100 + i * 130;
                const y = 250 - d.neutral * 2;
                if (i === 0) return `M ${x} ${y}`;
                const prevX = 100 + (i - 1) * 130;
                const prevY = 250 - monthlyData[i - 1].neutral * 2;
                const cpX1 = prevX + 65;
                const cpX2 = x - 65;
                return `C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
              }).join(' ')}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.9"
              className="transition-all duration-300"
            />
            
            {/* Negative line */}
            <path
              d={monthlyData.map((d, i) => {
                const x = 100 + i * 130;
                const y = 250 - d.negative * 2;
                if (i === 0) return `M ${x} ${y}`;
                const prevX = 100 + (i - 1) * 130;
                const prevY = 250 - monthlyData[i - 1].negative * 2;
                const cpX1 = prevX + 65;
                const cpX2 = x - 65;
                return `C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
              }).join(' ')}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.9"
              className="transition-all duration-300"
            />

            {/* Clean data points */}
            {monthlyData.map((d, i) => (
              <g key={i} className="cursor-pointer">
                {/* Data points - subtle and clean */}
                <circle 
                  cx={100 + i * 130} 
                  cy={250 - d.positive * 2} 
                  r="5" 
                  fill="#10b981" 
                  stroke="white" 
                  strokeWidth="2"
                  className="hover:r-7 transition-all duration-200"
                />
                
                <circle 
                  cx={100 + i * 130} 
                  cy={250 - d.neutral * 2} 
                  r="5" 
                  fill="#f59e0b" 
                  stroke="white" 
                  strokeWidth="2"
                  className="hover:r-7 transition-all duration-200"
                />
                
                <circle 
                  cx={100 + i * 130} 
                  cy={250 - d.negative * 2} 
                  r="5" 
                  fill="#f43f5e" 
                  stroke="white" 
                  strokeWidth="2"
                  className="hover:r-7 transition-all duration-200"
                />
                
                {/* Month labels */}
                <text 
                  x={100 + i * 130} 
                  y="290" 
                  textAnchor="middle" 
                  className="text-sm fill-gray-600 font-semibold"
                >
                  {d.month}
                </text>
                
                {/* Total count */}
                <text 
                  x={100 + i * 130} 
                  y="305" 
                  textAnchor="middle" 
                  className="text-xs fill-gray-400"
                >
                  {d.total}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Comparison Charts Grid - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Category Performance Radar Chart */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-xl border border-gray-100">
          <div className="mb-4 md:mb-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-800">Category Performance Radar</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Current vs Previous vs Target</p>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-md h-80 md:h-96">
              <svg viewBox="0 0 240 240" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                {/* Clean background circles */}
                {[20, 40, 60, 80, 100].map((r, i) => (
                  <circle
                    key={i}
                    cx="120"
                    cy="120"
                    r={r}
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                ))}

                {/* Subtle axis lines */}
                {categoryScores.map((_, i) => {
                  const angle = (i * 72 - 90) * (Math.PI / 180);
                  return (
                    <line
                      key={i}
                      x1="120"
                      y1="120"
                      x2={120 + Math.cos(angle) * 100}
                      y2={120 + Math.sin(angle) * 100}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Previous performance polygon - subtle */}
                <polygon
                  points={categoryScores.map((cat, i) => {
                    const angle = (i * 72 - 90) * (Math.PI / 180);
                    const r = cat.previous;
                    return `${120 + Math.cos(angle) * r},${120 + Math.sin(angle) * r}`;
                  }).join(' ')}
                  fill="rgba(168, 85, 247, 0.1)"
                  stroke="#a855f7"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.7"
                  className="transition-all duration-300"
                />

                {/* Current performance polygon - clean and professional */}
                <polygon
                  points={categoryScores.map((cat, i) => {
                    const angle = (i * 72 - 90) * (Math.PI / 180);
                    const r = cat.current;
                    return `${120 + Math.cos(angle) * r},${120 + Math.sin(angle) * r}`;
                  }).join(' ')}
                  fill="rgba(59, 130, 246, 0.2)"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />

                {/* Clean data points */}
                {categoryScores.map((cat, i) => {
                  const angle = (i * 72 - 90) * (Math.PI / 180);
                  const x = 120 + Math.cos(angle) * cat.current;
                  const y = 120 + Math.sin(angle) * cat.current;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="5"
                      fill="#3b82f6"
                      stroke="white"
                      strokeWidth="2"
                      className="hover:r-7 transition-all duration-200 cursor-pointer"
                    />
                  );
                })}

                {/* Clean labels */}
                {categoryScores.map((cat, i) => {
                  const angle = (i * 72 - 90) * (Math.PI / 180);
                  const labelX = 120 + Math.cos(angle) * 130;
                  const labelY = 120 + Math.sin(angle) * 130;
                  return (
                    <g key={i}>
                      <rect
                        x={labelX - 32}
                        y={labelY - 10}
                        width="64"
                        height="20"
                        fill="white"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                        rx="6"
                        className="hover:fill-blue-50 transition-colors duration-200"
                      />
                      <text
                        x={labelX}
                        y={labelY + 4}
                        textAnchor="middle"
                        className="text-xs font-semibold fill-gray-700 pointer-events-none"
                      >
                        {cat.category}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 mt-4">
            <span className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-xs font-semibold text-gray-700">Current</span>
            </span>
            <span className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-purple-500 border-dashed rounded"></div>
              <span className="text-xs font-semibold text-gray-700">Previous</span>
            </span>
          </div>
        </div>

        {/* Weekly Comparison Bar Chart */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-xl border border-gray-100">
          <div className="mb-4 md:mb-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-800">Weekly Comparison</h3>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Current month vs Previous month</p>
          </div>

          <div className="space-y-6">
            {weeklyComparison.map((week, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-700">{week.week}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-semibold text-blue-600">{week.current}</span>
                    <span className="text-sm font-semibold text-purple-600">{week.previous}</span>
                  </div>
                </div>
                <div className="relative h-12 bg-gray-100 rounded-xl overflow-hidden">
                  {/* Previous month bar */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-50 rounded-xl transition-all duration-1000"
                    style={{ width: `${(week.previous / 1200) * 100}%` }}
                  ></div>
                  {/* Current month bar */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl transition-all duration-1000 shadow-lg"
                    style={{ width: `${(week.current / 1200) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-gray-100">
            <span className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded"></div>
              <span className="text-xs font-semibold text-gray-700">Current Month</span>
            </span>
            <span className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 opacity-50 rounded"></div>
              <span className="text-xs font-semibold text-gray-700">Previous Month</span>
            </span>
          </div>
        </div>
      </div>

      {/* Category Progress Comparison */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800">Category Progress Tracking</h3>
          <p className="text-sm text-gray-500 mt-1">Current vs Previous vs Target scores</p>
        </div>

        <div className="space-y-6">
          {categoryScores.map((cat, index) => (
            <div key={index} className="group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-md ${
                    index === 0 ? 'bg-gradient-to-br from-blue-100 to-cyan-100' :
                    index === 1 ? 'bg-gradient-to-br from-purple-100 to-pink-100' :
                    index === 2 ? 'bg-gradient-to-br from-teal-100 to-emerald-100' :
                    index === 3 ? 'bg-gradient-to-br from-orange-100 to-amber-100' :
                    'bg-gradient-to-br from-green-100 to-lime-100'
                  }`}>
                    {index === 0 ? '👨‍🏫' : index === 1 ? '📚' : index === 2 ? '💬' : index === 3 ? '🏢' : '🤝'}
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
                    cat.current > cat.previous ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {cat.current > cat.previous ? '↑' : '↓'} {Math.abs(cat.current - cat.previous)}%
                  </div>
                </div>
              </div>

              {/* Progress bars */}
              <div className="space-y-2">
                {/* Target line */}
                <div className="relative h-2 bg-gray-100 rounded-full">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gray-300 rounded-full"
                    style={{ width: `${cat.target}%` }}
                  ></div>
                  <div 
                    className="absolute top-1/2 transform -translate-y-1/2 w-1 h-4 bg-gray-600"
                    style={{ left: `${cat.target}%` }}
                  ></div>
                </div>

                {/* Previous score */}
                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r ${
                      index === 0 ? 'from-purple-400 to-pink-400' :
                      index === 1 ? 'from-purple-400 to-pink-400' :
                      index === 2 ? 'from-purple-400 to-pink-400' :
                      index === 3 ? 'from-purple-400 to-pink-400' :
                      'from-purple-400 to-pink-400'
                    } opacity-50 rounded-full transition-all duration-1000`}
                    style={{ width: `${cat.previous}%` }}
                  ></div>
                </div>

                {/* Current score */}
                <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div 
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r ${
                      index === 0 ? 'from-blue-500 to-cyan-500' :
                      index === 1 ? 'from-purple-500 to-pink-500' :
                      index === 2 ? 'from-teal-500 to-emerald-500' :
                      index === 3 ? 'from-orange-500 to-amber-500' :
                      'from-green-500 to-lime-500'
                    } rounded-full transition-all duration-1000 shadow-lg`}
                    style={{ width: `${cat.current}%` }}
                  >
                    <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sentiment Distribution Over Time */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800">Sentiment Distribution Timeline</h3>
          <p className="text-sm text-gray-500 mt-1">Stacked area chart showing sentiment evolution</p>
        </div>

        <div className="relative h-64">
          <svg className="w-full h-full" viewBox="0 0 800 250">
            {/* Grid */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="50"
                y1={30 + i * 50}
                x2="750"
                y2={30 + i * 50}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}

            {/* Stacked areas */}
            {/* Positive area */}
            <path
              d={`M 100,${230 - monthlyData[0].positive * 2} ${monthlyData.map((d, i) => 
                `L ${100 + i * 130},${230 - d.positive * 2}`
              ).join(' ')} L 750,230 L 100,230 Z`}
              fill="url(#stackedEmerald)"
              opacity="0.8"
            />

            {/* Neutral area */}
            <path
              d={`M 100,${230 - monthlyData[0].positive * 2 - monthlyData[0].neutral * 2} ${monthlyData.map((d, i) => 
                `L ${100 + i * 130},${230 - d.positive * 2 - d.neutral * 2}`
              ).join(' ')} ${monthlyData.map((d, i) => 
                `L ${100 + (monthlyData.length - 1 - i) * 130},${230 - monthlyData[monthlyData.length - 1 - i].positive * 2}`
              ).join(' ')} Z`}
              fill="url(#stackedAmber)"
              opacity="0.8"
            />

            {/* Negative area */}
            <path
              d={`M 100,${230 - monthlyData[0].positive * 2 - monthlyData[0].neutral * 2 - monthlyData[0].negative * 2} ${monthlyData.map((d, i) => 
                `L ${100 + i * 130},${230 - d.positive * 2 - d.neutral * 2 - d.negative * 2}`
              ).join(' ')} ${monthlyData.map((d, i) => 
                `L ${100 + (monthlyData.length - 1 - i) * 130},${230 - monthlyData[monthlyData.length - 1 - i].positive * 2 - monthlyData[monthlyData.length - 1 - i].neutral * 2}`
              ).join(' ')} Z`}
              fill="url(#stackedRose)"
              opacity="0.8"
            />

            {/* Month labels */}
            {monthlyData.map((d, i) => (
              <text
                key={i}
                x={100 + i * 130}
                y="245"
                textAnchor="middle"
                className="text-xs fill-gray-600 font-medium"
              >
                {d.month}
              </text>
            ))}

            <defs>
              <linearGradient id="stackedEmerald" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="stackedAmber" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="stackedRose" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Average Score', value: '82.5', change: '+4.2', icon: '📊', gradient: 'from-blue-500 to-indigo-600' },
          { label: 'Response Rate', value: '94%', change: '+8%', icon: '📈', gradient: 'from-emerald-500 to-teal-600' },
          { label: 'Improvement', value: '+12%', change: 'vs last period', icon: '🚀', gradient: 'from-purple-500 to-pink-600' },
          { label: 'Satisfaction', value: '4.2/5', change: '+0.3', icon: '⭐', gradient: 'from-orange-500 to-amber-600' }
        ].map((metric, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${metric.gradient} rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                {metric.icon}
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                {metric.change}
              </span>
            </div>
            <p className="text-gray-600 text-sm font-bold mb-1 uppercase tracking-wide">{metric.label}</p>
            <p className={`text-4xl font-extrabold bg-gradient-to-r ${metric.gradient} bg-clip-text text-transparent`}>
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      {/* Heatmap - Response Volume by Day & Hour */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800">Response Heatmap</h3>
          <p className="text-sm text-gray-500 mt-1">Feedback volume by day and time</p>
        </div>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xs text-gray-500 w-16 md:w-20">Time</span>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="w-16 md:w-20 text-center">
                  <span className="text-xs md:text-sm font-bold text-gray-700">{day}</span>
                </div>
              ))}
            </div>

            {['9AM', '12PM', '3PM', '6PM', '9PM'].map((time, timeIndex) => (
              <div key={time} className="flex items-center space-x-2 mb-2">
                <span className="text-xs md:text-sm text-gray-600 w-16 md:w-20 font-medium">{time}</span>
                {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                  const intensity = Math.random() * 100;
                  const bgColor = intensity > 75 ? '#10b981' :
                                 intensity > 50 ? '#fbbf24' :
                                 intensity > 25 ? '#f59e0b' : '#e5e7eb';
                  return (
                    <div
                      key={day}
                      className="w-16 md:w-20 h-12 md:h-14 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl cursor-pointer flex items-center justify-center group relative overflow-hidden"
                      style={{ backgroundColor: bgColor }}
                    >
                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                      
                      {/* Value display */}
                      <span className="text-xs md:text-sm font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 relative z-10">
                        {Math.floor(intensity)}
                      </span>
                      
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-20 shadow-xl">
                        <div className="font-semibold">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day]} {time}</div>
                        <div className="text-gray-300">{Math.floor(intensity)} responses</div>
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                          <div className="border-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-4 mt-6 pt-4 border-t border-gray-100">
            <span className="text-xs md:text-sm text-gray-600 font-medium">Low</span>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-lg shadow-sm"></div>
              <div className="w-8 h-8 bg-amber-500 rounded-lg shadow-sm"></div>
              <div className="w-8 h-8 bg-yellow-400 rounded-lg shadow-sm"></div>
              <div className="w-8 h-8 bg-emerald-500 rounded-lg shadow-sm"></div>
            </div>
            <span className="text-xs md:text-sm text-gray-600 font-medium">High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendsInsights;
