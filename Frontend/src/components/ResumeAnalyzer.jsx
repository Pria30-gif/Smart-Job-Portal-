<<<<<<< HEAD
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
  const keywords = result?.keywordsMatched || result?.extractedSkills || result?.skills || [];
  const parsedKeywordsText = keywords.length ? keywords.join(', ') : 'No keywords detected.';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="max-w-4xl mx-auto px-4 py-10">
        <div className="space-y-6">
          <section className="rounded-[1.75rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/20">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white">Resume ATS Analyzer</h1>
              <p className="mt-2 text-slate-400">Upload your resume for a fast ATS compatibility review and clear resume feedback.</p>
            </div>

            <div
              className={`rounded-[1.75rem] border-2 border-dashed p-8 text-center transition ${dragActive ? 'border-cyan-400 bg-slate-900/90' : resume ? 'border-emerald-400 bg-slate-900/90' : 'border-slate-700 bg-slate-950/80 hover:border-cyan-400 hover:bg-slate-900/90'}`}
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
                    onClick={() => {
                      setResume(null);
                      setMessage("");
                      setError("");
                    }}
                    className="rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-slate-700"
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
            {error && <div className="mt-4 rounded-3xl bg-rose-950/80 p-4 text-rose-200 ring-1 ring-rose-500/30">{error}</div>}

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
          </section>

          {result ? (
            <section className="rounded-[1.75rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/20">
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
                  <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Keyword parsing</p>
                  <p className="mt-4 text-slate-200">{parsedKeywordsText}</p>
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
            </section>
          ) : (
            <section className="rounded-[1.75rem] border border-dashed border-slate-700 bg-slate-900/85 p-8 text-center text-slate-400">
              <p className="text-lg font-semibold text-white">Your resume analysis will appear here.</p>
              <p className="mt-3">Upload a resume and click Analyze Resume to get ATS feedback.</p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResumeAnalyzer;
=======
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { FileText, Upload, BarChart3, Loader2 } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Corrected way to set the worker source using a reliable CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

const ResumeAnalyzer = () => {
    const [file, setFile] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);

    // Function to extract text from a PDF file
    const extractTextFromPDF = async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            text += textContent.items.map(item => item.str).join(' ') + '\n';
        }
        return text;
    };
    
    // Function to handle different file types
    const extractTextFromFile = async (file) => {
        if (file.type === 'application/pdf') {
            return await extractTextFromPDF(file);
        } else if (file.type === 'text/plain') {
            return await file.text();
        } else {
            toast.error('Unsupported file type. Please upload a PDF or TXT file.');
            throw new Error('Unsupported file type.');
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setAnalysis(null); // Reset analysis when a new file is chosen
        }
    };

    const handleAnalyze = async () => {
        if (!file) {
            toast.error('Please upload a resume file first.');
            return;
        }

        setLoading(true);
        try {
            const resumeText = await extractTextFromFile(file);

            // Send the extracted text to your new backend endpoint
            const res = await axios.post('/api/resume-analyze', 
                { resumeText },
                { withCredentials: true }
            );

            setAnalysis(res.data.analysis);
            toast.success('Resume analyzed successfully!');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to analyze resume.');
            console.error("Analysis Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
                <header className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-800">Instant Resume Analyzer</h1>
                    <p className="text-lg text-gray-500 mt-2">Get AI-powered feedback to elevate your resume and land your dream job.</p>
                </header>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Input Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <label 
                                htmlFor="resume-upload" 
                                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer flex flex-col items-center justify-center h-64"
                            >
                                <Upload size={48} className="mb-4 text-gray-400" />
                                <p className="font-semibold text-gray-700">
                                    {file ? file.name : 'Click to upload your resume'}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Supports PDF and text files
                                </p>
                            </label>
                            <input
                                type="file"
                                accept=".pdf,.txt"
                                onChange={handleFileChange}
                                className="hidden"
                                id="resume-upload"
                            />
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !file}
                            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <BarChart3 size={20} />
                                    Analyze Resume
                                </>
                            )}
                        </button>
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-3 bg-gray-50 p-6 rounded-lg border">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Analysis Results</h2>
                        {analysis ? (
                            <div 
                                className="prose prose-sm max-w-none text-gray-700" 
                                dangerouslySetInnerHTML={{ __html: analysis.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
                            />
                        ) : (
                            <div className="text-center text-gray-500 py-16 flex flex-col items-center justify-center h-full">
                                <FileText size={48} className="mx-auto mb-4 opacity-40" />
                                <p className="font-medium">Your resume feedback will appear here.</p>
                                <p className="text-sm">Upload a file and click "Analyze" to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeAnalyzer;

>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
