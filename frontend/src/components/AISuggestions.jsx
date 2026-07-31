import React, { useState } from 'react';

const AISuggestions = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample AI-generated suggestions - will be replaced with database data
  const suggestions = [
    {
      id: 1,
      category: 'Teaching',
      priority: 'high',
      title: 'Increase Interactive Q&A Sessions',
      summary: 'Students highly appreciate interactive teaching methods and request more opportunities for questions.',
      details: 'Based on 156 positive feedbacks, students specifically mentioned enjoying interactive sessions. Consider allocating 20% more time for Q&A in each lecture.',
      impact: 'High',
      effort: 'Low',
      affectedStudents: 156,
      sentiment: 'positive',
      aiConfidence: 92,
      actionItems: [
        'Add 10-15 minutes Q&A time at end of each lecture',
        'Use polling tools for real-time questions',
        'Create dedicated discussion forums'
      ],
      relatedFeedback: [
        'Love the interactive sessions, wish we had more',
        'Q&A time is most valuable part of class',
        'More discussion would help understanding'
      ],
      implementationTime: '1 week',
      expectedOutcome: '+15% student satisfaction'
    },
    {
      id: 2,
      category: 'Content',
      priority: 'high',
      title: 'Add More Practical Examples',
      summary: 'Students request more real-world applications and practical examples in course content.',
      details: 'Analysis of 142 feedbacks shows students want to see how theoretical concepts apply to real scenarios. Industry case studies would be beneficial.',
      impact: 'High',
      effort: 'Medium',
      affectedStudents: 142,
      sentiment: 'neutral',
      aiConfidence: 88,
      actionItems: [
        'Include 2-3 industry case studies per module',
        'Add practical coding exercises',
        'Invite guest speakers from industry'
      ],
      relatedFeedback: [
        'Need more practical examples',
        'Theory is good but want real applications',
        'Case studies would help a lot'
      ],
      implementationTime: '2-3 weeks',
      expectedOutcome: '+20% engagement'
    },
    {
      id: 3,
      category: 'Infrastructure',
      priority: 'medium',
      title: 'Improve Lab Equipment Availability',
      summary: 'Lab equipment shortage affecting practical sessions, causing delays and reduced hands-on time.',
      details: 'Multiple students (89 feedbacks) reported waiting times for equipment. Consider equipment rotation schedule or additional purchases.',
      impact: 'Medium',
      effort: 'High',
      affectedStudents: 89,
      sentiment: 'negative',
      aiConfidence: 85,
      actionItems: [
        'Implement equipment booking system',
        'Purchase 5 additional workstations',
        'Create equipment rotation schedule'
      ],
      relatedFeedback: [
        'Lab equipment always occupied',
        'Need more computers in lab',
        'Waiting time too long'
      ],
      implementationTime: '1 month',
      expectedOutcome: '-50% wait time'
    },
    {
      id: 4,
      category: 'Communication',
      priority: 'low',
      title: 'Enhance Assignment Feedback Timeliness',
      summary: 'Students appreciate detailed feedback but request faster turnaround times on assignments.',
      details: 'Based on 67 feedbacks, average desired feedback time is 5-7 days. Current average is 10-12 days.',
      impact: 'Medium',
      effort: 'Low',
      affectedStudents: 67,
      sentiment: 'neutral',
      aiConfidence: 79,
      actionItems: [
        'Set 7-day feedback deadline',
        'Use rubrics for faster grading',
        'Consider peer review for drafts'
      ],
      relatedFeedback: [
        'Feedback is great but takes too long',
        'Would like faster assignment returns',
        'Detailed comments appreciated'
      ],
      implementationTime: '2 weeks',
      expectedOutcome: '+10% satisfaction'
    },
    {
      id: 5,
      category: 'Teaching',
      priority: 'medium',
      title: 'Diversify Teaching Methods',
      summary: 'Mix of visual, auditory, and kinesthetic learning styles needed to engage all students.',
      details: 'AI analysis suggests incorporating videos, diagrams, and hands-on activities alongside lectures for better engagement.',
      impact: 'High',
      effort: 'Medium',
      affectedStudents: 203,
      sentiment: 'positive',
      aiConfidence: 91,
      actionItems: [
        'Create video tutorials for complex topics',
        'Use more visual diagrams and flowcharts',
        'Add group activities and workshops'
      ],
      relatedFeedback: [
        'Videos would help with revision',
        'Visual learner, need more diagrams',
        'Hands-on activities are most effective'
      ],
      implementationTime: '3 weeks',
      expectedOutcome: '+25% engagement'
    }
  ];

  // Filter suggestions
  const filteredSuggestions = suggestions.filter(sug => {
    const matchesCategory = selectedCategory === 'all' || sug.category.toLowerCase() === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || sug.priority === selectedPriority;
    const matchesSearch = searchQuery === '' || 
      sug.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sug.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPriority && matchesSearch;
  });

  // Priority colors
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'from-red-500 to-orange-500';
      case 'medium': return 'from-yellow-500 to-amber-500';
      case 'low': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getPriorityBg = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  // Category icons
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Teaching': return '👨‍🏫';
      case 'Content': return '📚';
      case 'Communication': return '💬';
      case 'Infrastructure': return '🏢';
      case 'Behavior': return '🤝';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-2xl p-4 md:p-6 lg:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white mb-2">
              💡 AI-Generated Suggestions
            </h2>
            <p className="text-white/90 text-xs md:text-sm">
              Actionable insights powered by NLP analysis of student feedback
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
            <span className="text-white text-sm font-semibold">
              {filteredSuggestions.length} Suggestions
            </span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search suggestions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-medium cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="teaching">Teaching</option>
            <option value="content">Content</option>
            <option value="communication">Communication</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="behavior">Behavior</option>
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm font-medium cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Suggestions', value: suggestions.length, icon: '💡', color: 'from-purple-500 to-pink-500' },
          { label: 'High Priority', value: suggestions.filter(s => s.priority === 'high').length, icon: '🔥', color: 'from-red-500 to-orange-500' },
          { label: 'Avg Confidence', value: `${Math.round(suggestions.reduce((acc, s) => acc + s.aiConfidence, 0) / suggestions.length)}%`, icon: '🎯', color: 'from-blue-500 to-cyan-500' },
          { label: 'Students Affected', value: suggestions.reduce((acc, s) => acc + s.affectedStudents, 0), icon: '👥', color: 'from-emerald-500 to-teal-500' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-2xl shadow-md`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide">{stat.label}</p>
            <p className={`text-3xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {filteredSuggestions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Suggestions Found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </div>
        ) : (
          filteredSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`bg-white rounded-2xl p-6 shadow-lg border-2 ${getPriorityBg(suggestion.priority)} hover:shadow-2xl transition-all duration-300 group`}
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {getCategoryIcon(suggestion.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-3 py-1 bg-gradient-to-r ${getPriorityColor(suggestion.priority)} text-white text-xs font-bold rounded-full shadow-md`}>
                        {suggestion.priority.toUpperCase()} PRIORITY
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                        {suggestion.category}
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        {suggestion.affectedStudents} students
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                      {suggestion.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {suggestion.summary}
                    </p>
                  </div>
                </div>

                {/* AI Confidence Badge */}
                <div className="flex flex-col items-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                  <div className="text-xs font-semibold text-gray-600 mb-1">AI Confidence</div>
                  <div className="text-3xl font-extrabold text-indigo-600">{suggestion.aiConfidence}%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${suggestion.aiConfidence}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 mb-4">
                <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Detailed Analysis
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">{suggestion.details}</p>
              </div>

              {/* Action Items */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Recommended Action Items
                </h4>
                <div className="space-y-2">
                  {suggestion.actionItems.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 bg-white rounded-lg p-3 border border-gray-200 hover:border-emerald-300 transition-colors">
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-emerald-600 text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700 flex-1">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Feedback Samples */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Sample Student Feedback
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {suggestion.relatedFeedback.map((feedback, index) => (
                    <div key={index} className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <div className="flex items-start space-x-2">
                        <span className="text-purple-600 text-lg">"</span>
                        <p className="text-xs text-gray-700 italic flex-1">{feedback}</p>
                        <span className="text-purple-600 text-lg">"</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-200">
                  <div className="text-xs font-semibold text-gray-600 mb-1">Impact</div>
                  <div className="text-lg font-bold text-blue-600">{suggestion.impact}</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-200">
                  <div className="text-xs font-semibold text-gray-600 mb-1">Effort</div>
                  <div className="text-lg font-bold text-orange-600">{suggestion.effort}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200">
                  <div className="text-xs font-semibold text-gray-600 mb-1">Timeline</div>
                  <div className="text-lg font-bold text-purple-600">{suggestion.implementationTime}</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-3 border border-emerald-200">
                  <div className="text-xs font-semibold text-gray-600 mb-1">Expected</div>
                  <div className="text-lg font-bold text-emerald-600">{suggestion.expectedOutcome}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button className="flex-1 min-w-[200px] px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Mark as Implemented</span>
                  </span>
                </button>
                <button className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-purple-500 hover:text-purple-600 transition-all duration-200">
                  View Details
                </button>
                <button className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-600 transition-all duration-200">
                  Export Report
                </button>
                <button className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AISuggestions;
