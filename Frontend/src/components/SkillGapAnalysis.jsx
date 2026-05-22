import React, { useState } from 'react';
import { Target, Check, Briefcase, BookOpen, AlertCircle } from 'lucide-react';

// --- Mock "AI" Logic (runs in the browser, no backend needed for this demo) ---
const mockAnalysis = (jobRole, userSkillsText) => {
  const jobRequirements = {
    "Frontend Developer": ["react", "javascript", "css", "typescript", "tailwind", "vite"],
    "Backend Developer": ["node.js", "express", "sql", "mongodb", "docker", "aws"],
    "Data Scientist": ["python", "pandas", "sql", "tensorflow", "scikit-learn", "tableau"],
  };
  const required = jobRequirements[jobRole] || [];
  const userSkills = userSkillsText.toLowerCase().split(/[\s,]+/).filter(Boolean);
  
  const hasSkills = required.filter(skill => userSkills.includes(skill));
  const missingSkills = required.filter(skill => !userSkills.includes(skill));

  const resources = {
    "react": "Official React Docs, Udemy Courses",
    "typescript": "TypeScript Handbook, YouTube Tutorials",
    "node.js": "Node.js Official Guides, Fullstack Open",
    "python": "Coursera Python for Everybody",
  };
  const learningPath = missingSkills.map(skill => ({ skill, resource: resources[skill] || "Online tutorials and documentation" }));
  
  return { hasSkills, missingSkills, learningPath };
};

export default function SkillGapAnalysis() {
  const [jobRole, setJobRole] = useState("Frontend Developer");
  const [userSkills, setUserSkills] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setAnalysisResult(null);
    setTimeout(() => {
      const result = mockAnalysis(jobRole, userSkills);
      setAnalysisResult(result);
      setIsLoading(false);
    }, 1500); // Simulate API call delay
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">Dynamic Skill Gap Analysis</h1>
        <p className="text-lg text-gray-600 mb-12 text-center">Bridge the gap between your skills and your next career move.</p>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* --- Left Column: Input --- */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter Your Details</h2>
            <form onSubmit={handleAnalyze} className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center"><Briefcase size={16} className="mr-2"/> Target Job Role</label>
                <select value={jobRole} onChange={(e) => setJobRole(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Frontend Developer</option>
                  <option>Backend Developer</option>
                  <option>Data Scientist</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Skills or Resume</label>
                <textarea
                  value={userSkills}
                  onChange={(e) => setUserSkills(e.target.value)}
                  placeholder="Paste your resume summary or list your skills, e.g., React, JavaScript, CSS, Node.js..."
                  className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button type="submit" className="w-full text-white bg-blue-600 hover:bg-blue-700 font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-blue-300 flex items-center justify-center" disabled={isLoading}>
                {isLoading ? 'Analyzing...' : <><Target size={20} className="mr-2"/> Analyze My Skills</>}
              </button>
            </form>
          </div>

          {/* --- Right Column: Results --- */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Analysis Report</h2>
            {isLoading && <div className="text-center">Analyzing your profile...</div>}
            {!isLoading && !analysisResult && <div className="text-center text-gray-500">Your report will appear here.</div>}
            {analysisResult && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-green-600 flex items-center mb-3"><Check size={20} className="mr-2"/> Your Aligned Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.hasSkills.map(skill => <span key={skill} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">{skill}</span>)}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-600 flex items-center mb-3"><AlertCircle size={20} className="mr-2"/> Skills to Acquire</h3>
                   <div className="flex flex-wrap gap-2">
                    {analysisResult.missingSkills.map(skill => <span key={skill} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">{skill}</span>)}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 flex items-center mb-3"><BookOpen size={20} className="mr-2"/> Personalized Learning Path</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    {analysisResult.learningPath.map(item => <li key={item.skill}><b>{item.skill}:</b> {item.resource}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

