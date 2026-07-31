import React, { useState, useEffect } from 'react';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "Feedback Analyzer has revolutionized how we understand our students. The sentiment analysis and categorization features have helped us identify specific areas for improvement that we never noticed before. Our teaching quality has improved dramatically.",
      author: "Dr. Sarah Johnson",
      position: "Professor of Computer Science",
      institution: "Stanford University",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      improvement: "40% increase in student satisfaction"
    },
    {
      quote: "The alert system caught several concerning issues early, allowing us to address them promptly. This platform has significantly improved our response time to student concerns and created a safer learning environment.",
      author: "Prof. Michael Chen",
      position: "Dean of Student Affairs",
      institution: "MIT",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      improvement: "60% faster issue resolution"
    },
    {
      quote: "The visual dashboard makes it so easy to track trends over time. We can now see the direct impact of our teaching improvements on student satisfaction. The insights are incredibly actionable and precise.",
      author: "Dr. Emily Rodriguez",
      position: "Department Head, Mathematics",
      institution: "Harvard University",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      improvement: "25% improvement in course ratings"
    },
    {
      quote: "Implementation was seamless, and the insights we've gained have been invaluable. Our student satisfaction scores have improved by 35% since we started using this platform. The ROI is exceptional.",
      author: "James Wilson",
      position: "Academic Director",
      institution: "Oxford University",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      improvement: "35% boost in satisfaction scores"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-purple-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 mb-8 shadow-lg">
            <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-blue-700 font-semibold">Loved by Educators</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-8">
            Trusted by
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Leading Institutions</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            See how top universities and colleges are transforming their feedback processes 
            and achieving remarkable improvements in student satisfaction with our AI-powered platform.
          </p>
        </div>

        {/* Enhanced Testimonial Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className={`group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 ${
                index === currentTestimonial ? 'ring-2 ring-blue-500 ring-opacity-50 scale-105' : 'hover:scale-105'
              }`}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center opacity-60">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>

              {/* Rating Stars */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </blockquote>

              {/* Author Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-bold text-gray-800 text-lg">
                      {testimonial.author}
                    </div>
                    <div className="text-blue-600 font-semibold">
                      {testimonial.position}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {testimonial.institution}
                    </div>
                  </div>
                </div>

                {/* Improvement Badge */}
                <div className="bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2 rounded-full border border-emerald-200">
                  <div className="text-emerald-700 font-semibold text-sm">
                    {testimonial.improvement}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mb-16 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonial
                  ? 'bg-blue-600 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 group-hover:shadow-lg transition-all duration-300">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-2">500+</div>
              <div className="text-gray-600 font-semibold">Institutions</div>
            </div>
          </div>
          <div className="text-center group">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 group-hover:shadow-lg transition-all duration-300">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">1M+</div>
              <div className="text-gray-600 font-semibold">Feedback Processed</div>
            </div>
          </div>
          <div className="text-center group">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 group-hover:shadow-lg transition-all duration-300">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-2">98%</div>
              <div className="text-gray-600 font-semibold">Satisfaction Rate</div>
            </div>
          </div>
          <div className="text-center group">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 group-hover:shadow-lg transition-all duration-300">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 mb-2">24/7</div>
              <div className="text-gray-600 font-semibold">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;