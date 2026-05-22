import React, { useState } from 'react';
import { Upload, FileText, Bot, Zap, Sparkles } from 'lucide-react';

const ResumeReview = () => {
    const [resumeFile, setResumeFile] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const handleAnalyzeClick = async () => {
        if (!resumeFile) {
            alert("Please upload a resume first.");
            return;
        }
        setIsLoading(true);
        // Simulate an AI feedback generation process
        setTimeout(() => {
            const exampleFeedback = `
                <h3 class="text-xl font-bold text-gray-800 mb-2">AI Feedback Summary:</h3>
                <ul class="list-disc list-inside space-y-2 text-gray-600">
                    <li><strong class="font-semibold text-green-600">Strengths:</strong> Clear, concise summary section. Good use of action verbs like "developed" and "managed".</li>
                    <li><strong class="font-semibold text-orange-500">Areas for Improvement:</strong> Consider quantifying your achievements. For example, instead of "Increased efficiency," try "Increased efficiency by 15%".</li>
                    <li><strong class="font-semibold text-blue-500">Keyword Optimization:</strong> Your resume scores well for keywords like "React" and "Node.js". To better match the "Senior Frontend Developer" role, consider adding "TypeScript" and "GraphQL".</li>
                </ul>
            `;
            setFeedback(exampleFeedback);
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <Sparkles className="mx-auto h-12 w-12 text-blue-600" />
                    <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-gray-900">
                        Instant Resume Review
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        Upload your resume to get instant, AI-powered feedback.
                    </p>

                    <div className="mt-8 bg-white p-8 rounded-lg shadow-md border border-gray-200">
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                    {resumeFile ? (
                                        <p className="font-semibold text-blue-600">{resumeFile.name}</p>
                                    ) : (
                                        <>
                                            <p className="mb-2 text-sm text-gray-500">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">PDF, DOC, or DOCX (MAX. 5MB)</p>
                                        </>
                                    )}
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                            </label>
                        </div>
                        <button
                            onClick={handleAnalyzeClick}
                            disabled={isLoading || !resumeFile}
                            className="mt-6 w-full inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Zap className="mr-2 h-5 w-5" />
                                    Analyze My Resume
                                </>
                            )}
                        </button>
                    </div>

                    {feedback && (
                        <div className="mt-8 bg-white p-8 rounded-lg shadow-md border border-gray-200 text-left">
                            <div className="flex items-center gap-3">
                                <Bot className="h-8 w-8 text-blue-600" />
                                <h2 className="text-2xl font-bold text-gray-900">AI Feedback Report</h2>
                            </div>
                            <div className="mt-4 prose" dangerouslySetInnerHTML={{ __html: feedback }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeReview;
