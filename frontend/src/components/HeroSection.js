import React from 'react';

const HeroSection = () => {
  return (
    <section id="home" className="relative h-[80vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image - Positioned lower to show buttons */}
      <div className="absolute top-16 left-0 right-0 bottom-0">
        <img 
          src="/homesoft.png" 
          alt="Background" 
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        {/* Fallback gradient background */}
        <div className="hidden absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
      </div>
      
      {/* Animated Background Elements - Subtle */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs - Very subtle */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-200/10 to-purple-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-200/10 to-blue-200/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-indigo-200/5 to-rose-200/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        
        {/* Geometric Shapes - Colorful and subtle */}
        <div className="absolute top-32 right-20 w-4 h-4 bg-blue-400/40 rotate-45 animate-bounce-gentle"></div>
        <div className="absolute bottom-32 left-16 w-6 h-6 bg-emerald-400/40 rotate-12 animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400/40 rotate-45 animate-bounce-gentle" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-8">
        <div className="animate-fade-in">
          {/* College Name - Adjusted positioning and size */}
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-600 mb-2">
              Dr. Bapuji Salunkhe Institute of Engineering and Technology
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
          </div>

          {/* Main Heading - Adjusted font sizes */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            <span className="text-slate-800">Transform Student</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600">
              Feedback into
            </span>
            <br />
            <span className="text-slate-800">Actionable Insights</span>
          </h1>
          
          {/* Subtitle - Adjusted size and spacing */}
          <p className="text-base sm:text-lg text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Advanced AI-powered platform designed to analyze, categorize, and visualize student feedback 
            for enhanced educational excellence at our institution.
            <span className="text-blue-600 font-medium"> Discover insights that drive meaningful improvements.</span>
          </p>

          {/* CTA Buttons - Clean design */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 min-w-[200px]">
              <span className="relative z-10 flex items-center justify-center">
                Get Started Free
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            
            <button className="group px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-2xl border-2 border-gray-200 hover:border-blue-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 min-w-[200px]">
              <span className="flex items-center justify-center">
                How It Works
                <svg className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>


    </section>
  );
};

export default HeroSection;