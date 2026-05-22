import { useState } from "react";
import axios from "axios";
import {
  FileText,
  Upload,
  Zap,
  CheckCircle,
  AlertTriangle,
  Target,
  RefreshCw,
} from "lucide-react";

// Backend API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5011";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const ResumeScreeningAI = () => {
  const [jobDesc, setJobDesc] = useState("");
  const [resume, setResume] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [isValidResume, setIsValidResume] = useState(false);

  // Handle file drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      const fileName = file.name.toLowerCase();
      const hasResumeInName = fileName.includes('resume');

      if (hasResumeInName) {
        setResume(file);
        setValidationMessage("✅ Resume PDF uploaded successfully! Add job description and click analyze.");
        setIsValidResume(true);
        setError("");
      } else {
        setError("Please upload a file with 'resume' in the filename. This helps ensure you're uploading an actual resume document.");
        setResume(null);
        setValidationMessage("");
        setIsValidResume(false);
      }
    } else {
      setError("Please upload a PDF file only");
      setResume(null);
      setValidationMessage("");
      setIsValidResume(false);
    }
  };

  // Handle file selection via input
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      const fileName = file.name.toLowerCase();
      const hasResumeInName = fileName.includes('resume');

      if (hasResumeInName) {
        setResume(file);
        setValidationMessage("✅ Resume PDF uploaded successfully! Add job description and click analyze.");
        setIsValidResume(true);
        setError("");
      } else {
        setError("Please upload a file with 'resume' in the filename. This helps ensure you're uploading an actual resume document.");
        setResume(null);
        setValidationMessage("");
        setIsValidResume(false);
      }
    } else {
      setError("Please upload a PDF file only");
      setResume(null);
      setValidationMessage("");
      setIsValidResume(false);
    }
  };

  // Handle resume analysis
  const handleAnalyze = async () => {
    if (!resume || !jobDesc.trim()) {
      alert("Please upload resume and enter job description");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    setValidationMessage("Analyzing document...");

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobDescription", jobDesc);

    try {
      const res = await apiClient.post("/api/admin/resume-analyzer", formData);
      setResult(res.data);
      setValidationMessage("✅ Analysis completed successfully!");
    } catch (err) {
      console.error("Analysis Error:", err);
      if (err.response?.data?.isResume === false) {
        setValidationMessage("❌ " + err.response.data.message);
        setError("Document validation failed");
        setResult(null);
      } else {
        setError("Resume screening failed: " + (err.response?.data?.message || err.message));
        setValidationMessage("❌ Analysis failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const matchPercentageValue = Number(result?.matchPercentage ?? result?.matchScore ?? 0);
  const experienceYears = result?.experience?.years;
  const experienceRoles = result?.experience?.roles || [];
  const experienceText = experienceYears > 0
    ? `${experienceYears} years${experienceRoles.length ? ` · ${experienceRoles.join(', ')}` : ''}`
    : experienceRoles.length
      ? experienceRoles.join(', ')
      : 'Not available';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-600" />
                AI Resume Screening
              </h1>
              <p className="text-gray-600 mt-1">
                Evaluate candidates using advanced AI analysis
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Inputs */}
          <div className="space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Job Description</h2>
              </div>
              <textarea
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter the job description, requirements, and key skills..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                rows={8}
              />
            </div>

            {/* Resume Upload */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <Upload className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Resume Upload</h2>
              </div>

              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : resume
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {resume ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                    <p className="text-lg font-medium text-gray-900">{resume.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {(resume.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <button
                      onClick={() => setResume(null)}
                      className="mt-4 text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <FileText className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Drop your resume here, or click to browse
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Supports PDF files with 'resume' in the filename (e.g., MyResume.pdf, john_doe_resume.pdf)
                    </p>
                    <label className="cursor-pointer">
                      <span className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                        Choose File
                      </span>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {validationMessage && (
                <p className="mt-4 text-center text-gray-700">{validationMessage}</p>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                    <p className="text-red-800">{error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !resume || !isValidResume}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-colors flex items-center justify-center gap-3 ${
                loading || !resume || !isValidResume
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5" />
                  🚀 {jobDesc.trim() ? "Evaluate Against Job" : "Dynamic Resume Analysis"}
                </>
              )}
            </button>
          </div>

          {/* Right Column: Results */}
          <div className="space-y-6">
            {result && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Resume Analysis Results
                </h2>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800">Match Percentage</h3>
                  <p className={`text-2xl font-bold ${matchPercentageValue >= 80 ? 'text-green-600' : matchPercentageValue >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {matchPercentageValue}%
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {matchPercentageValue >= 80 ? 'Excellent match!' : matchPercentageValue >= 60 ? 'Good match with room for improvement' : 'Low match - significant improvements needed'}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800">ATS Score</h3>
                  <p className="text-2xl font-bold text-blue-600">{result?.atsScore ?? 'N/A'}/100</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800">Skills</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {result.skills?.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800">Experience</h3>
                  <p>{experienceText}</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800">Education</h3>
                  <p>{result.education || 'Not available'}</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800">Strengths</h3>
                  <ul className="list-disc list-inside">
                    {result.strengths?.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800">Weaknesses</h3>
                  <ul className="list-disc list-inside">
                    {result.weaknesses?.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800">Keywords Matched</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {result.keywordsMatched?.map((keyword, i) => (
                      <span
                        key={i}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800">Suggestions</h3>
                  <ul className="list-disc list-inside">
                    {result.suggestions?.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800">Summary</h3>
                  <p>{result.summary}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeScreeningAI;