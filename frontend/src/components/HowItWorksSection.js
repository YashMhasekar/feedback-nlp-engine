import React, { useState } from 'react';

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: "01",
      title: "Upload Data",
      description: "Upload student feedback in multiple formats - CSV, Excel, PDF, or direct text input.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50"
    },
    {
      step: "02", 
      title: "AI Analysis",
      description: "Advanced NLP processes text, performs sentiment analysis, and categorizes feedback automatically.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50"
    },
    {
      step: "03",
      title: "Generate Reports",
      description: "Get comprehensive analytics with sentiment distribution, trends, and actionable recommendations.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50"
    },
    {
      step: "04",
      title: "Take Action",
      description: "Use dashboards to track progress, set alerts, and implement data-driven improvements.",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white shadow-lg border border-gray-200 mb-6">
            <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-gray-700 font-semibold">How It Works</span>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Simple
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Process</span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform student feedback into actionable insights in four simple steps
          </p>
        </div>

        {/* Interactive Steps */}
        <div className="relative">
          {/* Progress Bar */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className={`relative cursor-pointer transition-all duration-300 ${
                  activeStep === index ? 'transform -translate-y-2' : ''
                }`}
                onMouseEnter={() => setActiveStep(index)}
              >
                {/* Step Card */}
                <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                  activeStep === index ? 'border-blue-300 shadow-blue-100' : 'border-gray-100'
                }`}>
                  
                  {/* Step Number */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                      {step.step}
                    </div>
                    
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl ${step.bgColor} flex items-center justify-center text-gray-600 transition-transform duration-300 ${
                      activeStep === index ? 'scale-110' : ''
                    }`}>
                      {step.icon}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                  
                  {/* Active Indicator */}
                  <div className={`mt-4 h-1 bg-gradient-to-r ${step.color} rounded-full transition-all duration-300 ${
                    activeStep === index ? 'opacity-100' : 'opacity-0'
                  }`}></div>
                </div>

                {/* Connection Dot */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 -right-4 z-10">
                    <div className={`w-4 h-4 rounded-full border-4 border-white shadow-lg transition-all duration-300 ${
                      activeStep >= index ? 'bg-blue-500' : 'bg-gray-300'
                    }`}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Join Dr. Bapuji Salunkhe Institute in transforming student feedback analysis
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  Start Analysis
                </button>
                <button className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-colors duration-200">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;