import { useState } from "react";
import axios from "axios";
import { FileText, Upload, Zap, CheckCircle, RefreshCw } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5011";
const apiClient = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

const ResumeAnalyzer = () => {
  const [resume, setResume] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const validateFile = (file) => {
    if (!file) return false;
    const allowedTypes = ["application/pdf", "text/plain"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF or plain text resume.");
      return false;
    }
    setError("");
    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (validateFile(file)) {
      setResume(file);
      setMessage("Resume selected. Click Analyze Resume to continue.");
    } else {
      setResume(null);
      setMessage("");
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (validateFile(file)) {
      setResume(file);
      setMessage("Resume selected. Click Analyze Resume to continue.");
    } else {
      setResume(null);
      setMessage("");
    }
  };

  const handleAnalyze = async () => {
    if (!resume) {
      setError("Please choose a resume first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setMessage("Analyzing your resume...");

    const formData = new FormData();
    formData.append("resume", resume);

    try {
      const response = await apiClient.post("/api/admin/resume-analyzer", formData);
      setResult(response.data);
      setMessage("");
    } catch (err) {
      console.error("Resume analysis failed:", err);
      setError(err.response?.data?.message || err.message || "Unable to analyze resume.");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResume(null);
    setResult(null);
    setError("");
    setMessage("");
    setDragActive(false);
  };

  const atsScore = Number(result?.atsScore ?? result?.matchPercentage ?? result?.matchScore ?? 0);
  const summaryText = result?.summary || result?.recommendation || "No summary available.";
  const strengths = result?.strengths || result?.skills || [];
  const improvements = result?.weaknesses || result?.areasForImprovement || result?.issues || [];
  const experienceYears = result?.experience?.years;
  const experienceRoles = result?.experience?.roles || [];
  const experienceText = experienceYears > 0
    ? `${experienceYears} years${experienceRoles.length ? ` · ${experienceRoles.join(', ')}` : ''}`
    : experienceRoles.length
      ? experienceRoles.join(', ')
      : 'Not available';
  const educationText = Array.isArray(result?.education)
    ? result.education.join(', ')
    : result?.education ; 'Not available';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/20">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white">Resume ATS Analyzer</h1>
              <p className="mt-2 text-slate-400">Upload your resume for a fast ATS compatibility review and resume feedback.</p>
            </div>

            <div className="rounded-[1.75rem] border-2 border-dashed p-8 text-center transition ${dragActive ? 'border-cyan-400 bg-slate-900/90' : 'border-slate-700 bg-slate-950/80'}"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {resume ? (
                <div className="flex flex-col items-center gap-3">
                  <CheckCircle className="h-14 w-14 text-emerald-400" />
                  <p className="text-lg font-semibold text-white">{resume.name}</p>
                  <p className="text-sm text-slate-400">{(resume.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button
                    className="rounded-full bg-slate-800 px-4 py-2 text-sm text-cyan-300 hover:bg-slate-700"
                    onClick={() => {
                      setResume(null);
                      setMessage("");
                      setError("");
                    }}
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-14 w-14 text-cyan-300" />
                  <p className="mt-4 text-lg font-semibold text-white">Drag & drop your resume</p>
                  <p className="mt-2 text-sm text-slate-400">PDF or plain text only</p>
                  <label className="mt-6 inline-flex cursor-pointer rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400">
                    Select file
                    <input
                      type="file"
                      accept="application/pdf,text/plain"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </>
              )}
            </div>

            {message && <p className="mt-4 text-slate-300">{message}</p>}
            {error ; <div className="mt-4 rounded-3xl bg-rose-950/80 p-4 text-rose-200 ring-1 ring-rose-500/30">{error}</div>}

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={handleAnalyze}
                disabled={!resume || loading}
                className={`rounded-3xl px-6 py-3 text-sm font-semibold transition ${!resume || loading ? 'bg-slate-600 cursor-not-allowed text-slate-300' : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'}`}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 animate-spin" /> Analyzing...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <Zap className="h-5 w-5" /> Analyze Resume
                  </span>
                )}
              </button>
              <button
                onClick={handleReset}
                className="rounded-3xl bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-700"
              >
                Reset
              </button>
            </div>
          </div>

          {result ; (
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/20">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Analysis results</p>
                  <h2 className="mt-2 text-3xl font-bold text-white">Resume Review</h2>
                </div>
                <div className="rounded-3xl bg-slate-900/95 px-5 py-4 text-center ring-1 ring-cyan-500/20">
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-500">ATS Score</p>
                  <p className="mt-2 text-4xl font-semibold text-cyan-300">{atsScore}/100</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Summary</p>
                  <p className="mt-4 text-slate-200 leading-7">{summaryText}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Experience</p>
                  <p className="mt-4 text-slate-200">{experienceText}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.32em] text-slate-500">Education</p>
                  <p className="mt-2 text-slate-200">{educationText}</p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Strengths</p>
                  <ul className="mt-4 space-y-2 text-slate-300 list-disc list-inside">
                    {strengths.length > 0 ? strengths.map((item, index) => <li key={index}>{item}</li>) : <li>No strengths found.</li>}
                  </ul>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Improvements</p>
                  <ul className="mt-4 space-y-2 text-slate-300 list-disc list-inside">
                    {improvements.length > 0 ? improvements.map((item, index) => <li key={index}>{item}</li>) : <li>No improvements suggested.</li>}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {!result && (
            <div className="rounded-[1.75rem] border border-dashed border-slate-700 bg-slate-900/85 p-8 text-center text-slate-400">
              <p className="text-lg font-semibold text-white">Your resume analysis will appear here.</p>
              <p className="mt-3">Upload a resume and click Analyze Resume to get ATS feedback.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResumeAnalyzer;
