import React, { useState } from 'react';
import { FileText, Clipboard, ClipboardCheck } from 'lucide-react';

// --- Mock "AI" Logic (runs in the browser, no backend needed for this demo) ---
const mockGenerator = (userSkills, jobDesc) => {
  return `Dear Hiring Manager,

I am writing to express my keen interest in the position advertised. With a strong background in my key skills, including ${userSkills.slice(0, 50)}..., I am confident that I possess the abilities to excel in this role.

The job description's emphasis on ${jobDesc.slice(0, 50)}... aligns perfectly with my experience. I am particularly adept at [mention a specific skill] and have a proven track record of success in [mention an achievement].

I am eager to learn more about this opportunity and discuss how my qualifications can benefit your team. Thank you for your time and consideration.

Sincerely,
[Your Name]`;
};

export default function CoverLetterGenerator() {
  const [userSkills, setUserSkills] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneratedLetter("");
    setIsCopied(false);
    setTimeout(() => {
      const result = mockGenerator(userSkills, jobDesc);
      setGeneratedLetter(result);
      setIsLoading(false);
    }, 1500);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">AI Cover Letter Generator</h1>
        <p className="text-lg text-gray-600 mb-12 text-center">Create a professional cover letter tailored to your dream job in seconds.</p>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* --- Left Column: Input --- */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Provide the Details</h2>
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Key Skills & Experience</label>
                <textarea
                  value={userSkills}
                  onChange={(e) => setUserSkills(e.target.value)}
                  placeholder="Paste key points from your resume, e.g., '5 years of experience in React and Node.js, led a team of 3 developers...'"
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description</label>
                <textarea
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Paste the full job description here..."
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <button type="submit" className="w-full text-white bg-green-600 hover:bg-green-700 font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-green-300 flex items-center justify-center" disabled={isLoading}>
                {isLoading ? 'Generating...' : <><FileText size={20} className="mr-2"/> Generate Letter</>}
              </button>
            </form>
          </div>

          {/* --- Right Column: Results --- */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Generated Letter</h2>
              {generatedLetter && (
                <button onClick={handleCopy} className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200">
                  {isCopied ? <><ClipboardCheck size={16} className="mr-2 text-green-500"/> Copied!</> : <><Clipboard size={16} className="mr-2"/> Copy</>}
                </button>
              )}
            </div>
            {isLoading && <div className="text-center">Generating your cover letter...</div>}
            {!isLoading && !generatedLetter && <div className="text-center text-gray-500">Your letter will appear here.</div>}
            {generatedLetter && (
              <div className="p-4 bg-gray-50 border rounded-lg h-80 overflow-y-auto whitespace-pre-wrap text-gray-800">
                {generatedLetter}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
