import React, { useEffect } from 'react';

const SalaryPredictor = () => {
  useEffect(() => {
    // Open the Streamlit app in a new tab
    window.open('http://localhost:8506/', '_blank');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600">
            <h1 className="text-2xl font-bold text-white">
              💰 Smart Salary Predictor & Interview Tools
            </h1>
            <p className="text-blue-100 mt-1">
              AI-powered salary estimation and interview preparation tools
            </p>
          </div>

          <div className="p-6">
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    <strong>Success:</strong> The AI tools have been opened in a new tab.
                    If it didn't open automatically, click the button below.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                🚀 Features Available:
              </h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><strong>Salary Prediction:</strong> Get accurate salary estimates based on your profile</li>
                <li><strong>AI Performance Analysis:</strong> Practice with domain-specific interview questions</li>
                <li><strong>AI Interview Feedback:</strong> Advanced AI analysis with personalized feedback</li>
                <li><strong>Real-time Scoring:</strong> Instant feedback and performance metrics</li>
              </ul>
            </div>

            <div className="text-center">
              <button
                onClick={() => window.open('http://localhost:8506/', '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
              >
                🚀 Open AI Tools
              </button>
            </div>

            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Note:</strong> This tool requires the ML service to be running on localhost:8506.
                    Make sure to start the Streamlit application before using these features.
                  </p>
                  <p className="text-sm text-yellow-700 mt-2">
                    <strong>Command:</strong> <code className="bg-yellow-100 px-2 py-1 rounded">streamlit run unified_app.py</code>
                    in the WebApp-ML-salaryprediction directory.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryPredictor;
