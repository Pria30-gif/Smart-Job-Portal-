import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageSquare, Compass, Award } from 'lucide-react';

// Enhanced Feature Card with more professional styling
const FeatureCard = ({ icon, title, description, linkTo, isFeatured }) => (
  <Link to={linkTo} className="relative block p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 h-full overflow-hidden">
    {isFeatured && (
        <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-500 text-white text-xs font-bold rounded-bl-lg">NEW</div>
    )}
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-6 ring-4 ring-blue-50">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{description}</p>
  </Link>
);

// New Component for a "Tip of the Day" feature
const TipOfTheDay = () => (
    <div className="mt-20 p-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl text-white text-left">
        <div className="flex items-center mb-4">
            <Award size={28} className="mr-3"/>
            <h3 className="text-2xl font-bold">Career Tip of the Day</h3>
        </div>
        <p className="text-blue-100 text-lg">
            When answering "Tell me about yourself," use the "Present, Past, Future" formula. Briefly describe your current role (Present), mention relevant past experiences that led you here (Past), and explain what you're looking to do next in your career (Future).
        </p>
    </div>
);


const CareerCoach = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto">
          
          {/* --- NEW: Professional Hero Section --- */}
          <div className="grid md:grid-cols-2 gap-12 items-center text-left">
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                Your Personal <span className="text-blue-600">AI Career Coach</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                Unlock your potential with AI-powered guidance for resumes, interviews, and career pathing.
              </p>
              <div className="mt-10">
                <Link to="/mock-interview">
                  <button className="bg-blue-600 text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105">
                    Start a Session
                  </button>
                </Link>
              </div>
            </div>
            {/* You can add an illustration or image here if you have one */}
            <div className="hidden md:block bg-blue-50 p-8 rounded-2xl">
                <img src="https://placehold.co/600x400/e0e7ff/3730a3?text=AI+Coach\nIllustration" alt="AI Coach Illustration" className="rounded-lg shadow-lg" />
            </div>
          </div>

          {/* --- ENHANCED: Feature Cards Section --- */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">How Can I Help You Today?</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <FeatureCard
                icon={<FileText size={32} />}
                title="Instant Resume Review"
                description="Get immediate feedback on formatting, keywords, and overall impact to land more interviews."
                linkTo="/resume-review"
              />
              <FeatureCard
                icon={<MessageSquare size={32} />}
                title="Mock Interview Practice"
                description="Practice common interview questions with an AI partner and receive performance analysis."
                linkTo="/mock-interview"
                isFeatured={true} // Example of a featured tag
              />
              <FeatureCard
                icon={<Compass size={32} />}
                title="Career Path Guidance"
                description="Explore potential career paths based on your skills and get actionable advice from our AI chatbot."
                linkTo="/career-path-guidance"
              />
            </div>
          </div>

          {/* --- NEW: Tip of the Day Advanced Feature --- */}
          <TipOfTheDay />

        </div>
      </div>
    </div>
  );
};

export default CareerCoach;

