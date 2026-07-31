import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5002";

const StudentDashboard = () => {
  const [formData, setFormData] = useState({
    student_id: "",
    course: "",
    faculty: "",
    feedback: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/submit_feedback`,
        formData
      );

      setResult(response.data);

      // Clear form
      setFormData({
        student_id: "",
        course: "",
        faculty: "",
        feedback: "",
      });

      // Show success message
      setTimeout(() => setResult(null), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Student Feedback Portal
          </h1>
          <p className="text-gray-600">
            Share your feedback to help improve our courses
          </p>
        </div>

        {/* Success Message */}
        {result && (
          <div className="mb-6 p-6 bg-green-50 border-2 border-green-200 rounded-2xl animate-slide-in">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-green-800 mb-1">
                  Feedback Submitted Successfully!
                </h3>
                <p className="text-sm text-green-700 mb-3">{result.message}</p>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      result.analysis?.sentiment === "POSITIVE"
                        ? "bg-green-100 text-green-700"
                        : result.analysis?.sentiment === "NEGATIVE"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {result.analysis?.sentiment}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                    {result.analysis?.category}
                  </span>
                  {result.analysis?.alert && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                      🚨 Alert Created
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-700 font-semibold">{error}</p>
            </div>
          </div>
        )}

        {/* Feedback Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student ID */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Student ID *
              </label>
              <input
                type="text"
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                required
                placeholder="e.g., S12345"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Course */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Course *
              </label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                placeholder="e.g., Computer Science 101"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Faculty */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Faculty Name *
              </label>
              <input
                type="text"
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                required
                placeholder="e.g., Dr. Smith"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
              />
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Your Feedback *
              </label>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Share your thoughts about the course, teaching methods, or any concerns..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                Your feedback will be analyzed and shared with the faculty to
                improve the course.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl hover:scale-105"
              }`}
            >
              {submitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Submitting & Analyzing...</span>
                </span>
              ) : (
                "Submit Feedback"
              )}
            </button>
          </form>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
            <div className="text-3xl mb-2">🔒</div>
            <p className="text-sm font-semibold text-gray-700">Anonymous</p>
            <p className="text-xs text-gray-500">Your identity is protected</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
            <div className="text-3xl mb-2">🤖</div>
            <p className="text-sm font-semibold text-gray-700">AI Analyzed</p>
            <p className="text-xs text-gray-500">Instant sentiment analysis</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm font-semibold text-gray-700">Actionable</p>
            <p className="text-xs text-gray-500">Helps improve courses</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
