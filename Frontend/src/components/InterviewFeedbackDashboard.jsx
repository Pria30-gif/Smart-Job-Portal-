<<<<<<< HEAD
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// YouTube URLs for each domain (learning resources)
const youtubeUrlsByDomain = {
  'Cloud Computing': [
    { title: 'Cloud Computing Basics', url: 'https://www.youtube.com/watch?v=JIUwRGW8F-w' },
    { title: 'Virtualization Explained', url: 'https://www.youtube.com/watch?v=FOWvHPwZA4c' },
    { title: 'Cloud Benefits', url: 'https://www.youtube.com/watch?v=0QXeJtGN1uw' },
    { title: 'Public vs Private vs Hybrid Clouds', url: 'https://www.youtube.com/watch?v=Wc_8D3KqHcw' },
    { title: 'Cloud Security Best Practices', url: 'https://www.youtube.com/watch?v=9h_Gd-AaZnU' },
  ],
  'Frontend': [
    { title: 'let vs const vs var', url: 'https://www.youtube.com/watch?v=9ooYYRLdg_g' },
    { title: 'CSS Box Model', url: 'https://www.youtube.com/watch?v=rIO5326FgPE' },
    { title: 'JavaScript Closures', url: 'https://www.youtube.com/watch?v=3a0I8ICR1Vg' },
    { title: 'React Hooks Explained', url: 'https://www.youtube.com/watch?v=TNhaISOUy6Q' },
    { title: '== vs === in JavaScript', url: 'https://www.youtube.com/watch?v=CxgOKJh4zWE' },
  ],
  'Backend': [
    { title: 'RESTful API Design', url: 'https://www.youtube.com/watch?v=lsMQRaeKNDk' },
    { title: 'SQL vs NoSQL Databases', url: 'https://www.youtube.com/watch?v=cQP8WJjvwAg' },
    { title: 'Middleware in Node.js', url: 'https://www.youtube.com/watch?v=lY6icfhap2o' },
    { title: 'Authentication & Authorization', url: 'https://www.youtube.com/watch?v=7Q17ubqLfaM' },
    { title: 'Database Indexing', url: 'https://www.youtube.com/watch?v=HXV3zeQKqGY' },
  ],
  'Data Structures & Algorithms': [
    { title: 'Big O Notation', url: 'https://www.youtube.com/watch?v=v4cd1O4zkGw' },
    { title: 'Linked Lists', url: 'https://www.youtube.com/watch?v=qpp8SSycDxo' },
    { title: 'Binary Search Trees', url: 'https://www.youtube.com/watch?v=41DcAP-DzjE' },
    { title: 'Graph Data Structures', url: 'https://www.youtube.com/watch?v=gXgEDyodOJU' },
    { title: 'Dynamic Programming', url: 'https://www.youtube.com/watch?v=oBt53YbR9Kk' },
  ]
};

const CircleGauge = ({ value, max = 10, label, color = 'bg-purple-500' }) => {
    const percentage = (value / max) * 100;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className={`${color} text-purple-600 transition-all duration-500`}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">{value.toFixed(1)}</span>
                    <span className="text-xs text-gray-500">/ {max}</span>
                </div>
            </div>
            <p className="text-center font-semibold text-gray-700">{label}</p>
        </div>
    );
};

const ScoreBar = ({ label, score, max = 100, color = 'bg-blue-500' }) => {
    const percentage = (score / max) * 100;
    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <span className="text-sm font-bold text-gray-900">{score.toFixed(1)}/{max}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={`${color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
            </div>
        </div>
    );
};

const InterviewFeedbackDashboard = () => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const location = useLocation();
    const routeFeedback = location.state?.feedback || null;
    const routeDomain = location.state?.domain || null;
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Removed manualUserId state - will always use test user or logged in user

    const fetchFeedback = async () => {
        try {
            setLoading(true);
            setError(null);
            // First, prefer route state feedback when navigated from the interview page
            if (routeFeedback) {
                console.log('✅ [DASHBOARD] Using route state feedback from navigation');
                setFeedback(routeFeedback);
                setLoading(false);
                return;
            }

            // Always try to fetch fresh data from backend first
            let userId = user?._id; // Try Redux user first
            
            // If no Redux user, use test user ID (no manual input needed)
            if (!userId) {
                userId = '68bc51faf6b48a6abac98fbe'; // Test user for demo - always available
                console.log('🧪 [DASHBOARD] Using test user ID for demo:', userId);
            }

            console.log('🔌 [DASHBOARD] Fetching fresh feedback for user:', userId);
            const backendUrl = import.meta.env.VITE_API_URL || '';
            const response = await axios.get(`${backendUrl}/api/mock-interview-feedback/${userId}`, {
                withCredentials: true,
                timeout: 5000 // 5 second timeout
            });
            
            if (response.data && response.data.feedback) {
                console.log('✅ [DASHBOARD] Fresh feedback fetched successfully');
                console.log('📦 [DASHBOARD] Response structure:', {
                    has_analysis: !!response.data.feedback.analysis,
                    has_ai_feedback: !!response.data.feedback.analysis?.ai_feedback,
                    analysis_keys: Object.keys(response.data.feedback.analysis || {}),
                    ai_feedback_keys: Object.keys(response.data.feedback.analysis?.ai_feedback || {})
                });
                setFeedback(response.data.feedback);
                // Update cache with fresh data
                localStorage.setItem('latestInterviewFeedback', JSON.stringify(response.data.feedback));
                setError(null);
            } else {
                // No fresh data, try cache as fallback
                console.log('🔍 [DASHBOARD] No fresh feedback, checking localStorage cache...');
                const cachedFeedback = localStorage.getItem('latestInterviewFeedback');
                if (cachedFeedback) {
                    console.log('✅ [DASHBOARD] Using cached feedback as fallback');
                    const parsedFeedback = JSON.parse(cachedFeedback);
                    console.log('📦 [DASHBOARD] Cached feedback structure:', {
                        has_analysis: !!parsedFeedback.analysis,
                        has_ai_feedback: !!parsedFeedback.analysis?.ai_feedback,
                        analysis_keys: Object.keys(parsedFeedback.analysis || {}),
                        ai_feedback_keys: Object.keys(parsedFeedback.analysis?.ai_feedback || {})
                    });
                    setFeedback(parsedFeedback);
                    setError('⚠️ Showing cached feedback. Complete a new interview for fresh analysis.');
                } else {
                    setError('📋 No interview feedback available yet. Please complete an interview first.');
                    setFeedback(null);
                }
            }
        } catch (err) {
            console.error('❌ [DASHBOARD] Error fetching feedback:', err);
            if (err.response?.status === 404) {
                // Backend has no data, try cache as fallback
                console.log('🔍 [DASHBOARD] Backend returned 404, checking localStorage cache...');
                const cachedFeedback = localStorage.getItem('latestInterviewFeedback');
                if (cachedFeedback) {
                    console.log('✅ [DASHBOARD] Using cached feedback as fallback');
                    const parsedFeedback = JSON.parse(cachedFeedback);
                    setFeedback(parsedFeedback);
                    setError('⚠️ Showing cached feedback from previous session. Complete a new interview for fresh analysis.');
                } else {
                    setError('📋 No interview feedback available yet. Please complete an interview first.');
                }
            } else if (err.message === 'timeout of 5000ms exceeded') {
                // Backend timeout, try cache as fallback
                console.log('🔍 [DASHBOARD] Backend timeout, checking localStorage cache...');
                const cachedFeedback = localStorage.getItem('latestInterviewFeedback');
                if (cachedFeedback) {
                    console.log('✅ [DASHBOARD] Using cached feedback as fallback');
                    const parsedFeedback = JSON.parse(cachedFeedback);
                    setFeedback(parsedFeedback);
                    setError('⚠️ Backend not responding. Showing cached feedback. Make sure backend is running: python interview_feedback_backend.py on port 5011');
                } else {
                    setError('⚠️ Server is not responding. Make sure the backend is running: python interview_feedback_backend.py on port 5011');
                }
            } else {
                // Other error, try cache as fallback
                console.log('🔍 [DASHBOARD] Backend error, checking localStorage cache...');
                const cachedFeedback = localStorage.getItem('latestInterviewFeedback');
                if (cachedFeedback) {
                    console.log('✅ [DASHBOARD] Using cached feedback as fallback');
                    const parsedFeedback = JSON.parse(cachedFeedback);
                    setFeedback(parsedFeedback);
                    setError(`⚠️ Error loading fresh feedback: ${err.message}. Showing cached data.`);
                } else {
                    setError(`Error loading feedback: ${err.message}`);
                }
            }
            setFeedback(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch immediately (don't wait 500ms)
        fetchFeedback();
    }, [user]); // Removed manualUserId from dependencies

    const handleRetakeInterview = () => {
        navigate('/mock-interview');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-300 border-t-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-700 font-semibold mb-2">Loading your interview feedback...</p>
                    <p className="text-gray-500 text-sm">Hang tight! We're analyzing your performance</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center mb-6">
                            <div className="text-5xl mb-4">⚠️</div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Feedback</h1>
                            <p className="text-gray-600 text-lg">{error}</p>
                        </div>

                        <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-6">
                            <h2 className="font-bold text-blue-900 mb-2">🔧 Troubleshooting Steps:</h2>
                            <ol className="list-decimal list-inside text-blue-800 space-y-1 text-sm">
                                <li>Make sure backend is running: <code className="bg-blue-100 px-2 py-1 rounded">python interview_feedback_backend.py</code></li>
                                <li>Check that port 5011 is accessible: <code className="bg-blue-100 px-2 py-1 rounded">http://localhost:5011/health</code></li>
                                <li>Try completing a new interview from scratch</li>
                                <li>Check browser console (F12) for error details</li>
                            </ol>
                        </div>

                        <div className="flex gap-3 justify-center flex-wrap">
                            <button
                                onClick={handleRetakeInterview}
                                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold flex items-center gap-2"
                            >
                                ← Back to Interview
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-semibold"
                            >
                                🔄 Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!feedback) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6 flex items-center justify-center">
                <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
                    <p className="text-gray-600 mb-4">No feedback data loaded.</p>
                    <button
                        onClick={handleRetakeInterview}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                    >
                        Go Back to Interview
                    </button>
                </div>
            </div>
        );
    }

    // ========== FIXED DATA EXTRACTION - Handles BOTH with and without "analysis" wrapper ==========
    const resolvedDomain = routeDomain || feedback.domain || feedback.analysis?.domain || feedback?.domain || '';
    
    // Detect structure type - handle both new (with analysis wrapper) and old (flat) formats
    // New format: feedback.analysis.semantic_analysis
    // Old format: feedback.semantic_analysis
    const semantic = feedback.analysis?.semantic_analysis || feedback.semantic_analysis || {}; 
    const tone = feedback.analysis?.tone_analysis || feedback.tone_confidence || {};
    const body = feedback.analysis?.camera_analysis || feedback.body_language || {};
    const face = feedback.analysis?.face_behavior || {};
    
    // ---- Semantic averages ----
    const relevanceArr = semantic.relevance || [];
    const avgRelevance = relevanceArr.length > 0 
        ? relevanceArr.reduce((a, b) => a + b, 0) / relevanceArr.length 
        : semantic.avg_relevance || 0;

    const clarityArr = semantic.clarity || [];
    const avgClarity = clarityArr.length > 0 
        ? clarityArr.reduce((a, b) => a + b, 0) / clarityArr.length 
        : semantic.avg_clarity || 0;

    // ---- Tone and confidence averages ----
    const toneArr = tone.tone || [];
    const avgTone = toneArr.length > 0 
        ? toneArr.reduce((a, b) => a + b, 0) / toneArr.length 
        : 0;

    const confidenceArr = tone.confidence || [];
    const avgConfidence = confidenceArr.length > 0 
        ? confidenceArr.reduce((a, b) => a + b, 0) / confidenceArr.length 
        : 0;
    
    const confidenceLevel = tone.confidence_level || Math.round(avgConfidence * 10);
    
    // ---- Body language ----
    const eyeContact = body.overall_eye_contact_percentage || body.eye_contact || face.face_presence_pct || 0;
    const postureScore = body.overall_posture_score || body.posture || 0;
    const engagementScore = body.overall_engagement_score || body.engagement || 0;
    const blinkCount = body.total_blinks || face.blink_count || 0;
    const blinkRate = face.blink_rate_per_min || body.blink_rate_per_min || 0;
    
    // ---- Overall Score (calculated manually if not present) ----
    let overallScore = feedback.overall_score || 0;
    if (overallScore === 0) {
        // Calculate from averages if not present
        overallScore = Math.round(
            ((avgRelevance * 10) + (avgClarity * 10) + avgTone + avgConfidence) / 4
        );
    }
    
    // ---- AI Feedback Handling - Support multiple formats ----
    // Format 1: feedback.analysis.ai_feedback (object with summary, strengths, improvements)
    // Format 2: feedback.ai_feedback (object with summary, strengths, improvements)  
    // Format 3: feedback.ai_feedback (string only)
    // Format 4: feedback.strengths/improvements at root level
    let aiFeedback = {};
    
    // Try nested location first (new format)
    if (feedback.analysis?.ai_feedback) {
        if (typeof feedback.analysis.ai_feedback === 'object') {
            aiFeedback = feedback.analysis.ai_feedback;
        } else if (typeof feedback.analysis.ai_feedback === 'string') {
            aiFeedback = {
                summary: feedback.analysis.ai_feedback,
                strengths: feedback.strengths || [],
                improvements: feedback.improvements || [],
                recommendations: []
            };
        }
    }
    // Try top-level location
    else if (feedback.ai_feedback) {
        if (typeof feedback.ai_feedback === 'object') {
            aiFeedback = feedback.ai_feedback;
        } else if (typeof feedback.ai_feedback === 'string') {
            aiFeedback = {
                summary: feedback.ai_feedback,
                strengths: feedback.strengths || [],
                improvements: feedback.improvements || [],
                recommendations: []
            };
        }
    }
    
    // Fallback: if still empty, check root-level strengths/improvements (old flat format)
    if (!aiFeedback.summary) {
        aiFeedback = {
            summary: feedback.ai_feedback?.summary || "",
            strengths: feedback.ai_feedback?.strengths || feedback.strengths || [],
            improvements: feedback.ai_feedback?.improvements || feedback.improvements || [],
            recommendations: feedback.ai_feedback?.recommendations || []
        };
    }
    
    // Debug logging
    console.log('=== FEEDBACK DEBUG ===');
    console.log('Full feedback keys:', Object.keys(feedback));
    console.log('Has analysis wrapper:', !!feedback.analysis);
    console.log('Semantic:', semantic);
    console.log('Tone:', tone);
    console.log('Body:', body);
    console.log('Overall Score:', overallScore);
    console.log('AI Feedback:', aiFeedback);
    console.log('Strengths:', aiFeedback.strengths);
    console.log('Improvements:', aiFeedback.improvements);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 AI-Powered Interview Feedback Dashboard</h1>
                    <p className="text-gray-600 mb-6">Detailed AI-powered feedback on your interview</p>
                </div>

                {/* Overall Score Card */}
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg shadow-lg p-8 mb-8 text-white text-center">
                    <h2 className="text-2xl font-bold mb-4">Overall Performance Score</h2>
                    <div className="text-6xl font-bold mb-4">{overallScore.toFixed(1)}/100</div>
                    <p className="text-gray-100">
                        {overallScore >= 80 ? "Excellent performance! 🎉" :
                         overallScore >= 60 ? "Good job! Keep improving 📈" :
                         "Keep practicing! You'll improve 💪"}
                    </p>
                </div>

                {/* Speaking Confidence Gauge */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Overall Confidence Level</h2>
                    <div className="flex justify-center">
                        <CircleGauge
                            value={avgConfidence}
                            max={10}
                            label="Confidence Score"
                            color="text-purple-600"
                        />
                    </div>
                </div>

                {/* Performance Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Relevance, Clarity, Confidence */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Semantic Analysis</h2>
                        <ScoreBar
                            label="Relevance to Questions"
                            score={avgRelevance * 10}
                            max={100}
                            color="bg-blue-500"
                        />
                        <ScoreBar
                            label="Clarity of Answers"
                            score={avgClarity * 10}
                            max={100}
                            color="bg-green-500"
                        />
                        <ScoreBar
                            label="Tone Quality"
                            score={avgTone}
                            max={100}
                            color="bg-yellow-500"
                        />
                    </div>

                    {/* Body Language Metrics */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Body Language Analysis</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                <span className="font-medium text-gray-700">👁️ Eye Contact</span>
                                <span className="text-lg font-bold text-blue-600">{eyeContact.toFixed(1)}%</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                                <span className="font-medium text-gray-700">👀 Blink Rate</span>
                                <span className="text-lg font-bold text-green-600">{blinkRate.toFixed(1)}/min</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                                <span className="font-medium text-gray-700">🎯 Engagement Score</span>
                                <span className="text-lg font-bold text-purple-600">{engagementScore.toFixed(1)}/10</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
                                <span className="font-medium text-gray-700">📏 Posture Score</span>
                                <span className="text-lg font-bold text-indigo-600">{postureScore.toFixed(1)}/10</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Interviewer Feedback */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Interviewer Feedback</h2>
                    
                    {/* Summary */}
                    {aiFeedback.summary && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                            <p className="text-gray-700 text-lg">{aiFeedback.summary}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Strengths */}
                        <div>
                            <h3 className="text-lg font-bold text-green-600 mb-4 flex items-center">
                                <span className="text-2xl mr-2">✅</span>
                                Strengths
                            </h3>
                            <ul className="space-y-2">
                                {aiFeedback.strengths && Array.isArray(aiFeedback.strengths) ? (
                                    aiFeedback.strengths.map((strength, idx) => (
                                        <li key={idx} className="flex items-start text-gray-700">
                                            <span className="text-green-500 mr-3 mt-1">•</span>
                                            <span>{strength}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500 italic">No strengths identified yet</li>
                                )}
                            </ul>
                        </div>

                        {/* Weaknesses / Areas for Improvement */}
                        <div>
                            <h3 className="text-lg font-bold text-orange-600 mb-4 flex items-center">
                                <span className="text-2xl mr-2">⚠️</span>
                                Areas for Improvement
                            </h3>
                            <ul className="space-y-2">
                                {aiFeedback.improvements && Array.isArray(aiFeedback.improvements) ? (
                                    aiFeedback.improvements.map((improvement, idx) => (
                                        <li key={idx} className="flex items-start text-gray-700">
                                            <span className="text-orange-500 mr-3 mt-1">•</span>
                                            <span>{improvement}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500 italic">No improvements suggested yet</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Recommendations */}
                    {aiFeedback.recommendations && (
                        <div className="mt-6 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                            <h4 className="font-bold text-purple-900 mb-2 flex items-center">
                                <span className="text-2xl mr-2">💡</span>
                                Recommendations
                            </h4>
                            <ul className="space-y-2">
                                {Array.isArray(aiFeedback.recommendations) ? (
                                    aiFeedback.recommendations.map((rec, idx) => (
                                        <li key={idx} className="flex items-start text-gray-700">
                                            <span className="text-purple-500 mr-3 mt-1">•</span>
                                            <span>{rec}</span>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-gray-700">{aiFeedback.recommendations}</p>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Questions and Answers Section */}
                {feedback.questions && feedback.transcripts && (
                    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions & Your Answers</h2>
                        <div className="space-y-4">
                            {feedback.questions.map((question, idx) => (
                                <div key={idx} className="border-l-4 border-purple-500 pl-4 py-2">
                                    <h4 className="font-bold text-gray-800 mb-2">
                                        Q{idx + 1}: {question}
                                    </h4>
                                    <p className="text-gray-600 italic">
                                        {feedback.transcripts[idx] || "No answer recorded"}
                                    </p>
                                    {feedback.analysis?.semantic_analysis?.relevance?.[idx] && (
                                        <p className="text-sm text-green-600 mt-1">
                                            ✓ Relevance: {(feedback.analysis.semantic_analysis.relevance[idx] * 10).toFixed(1)}/100
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Learning Resources Section */}
                {resolvedDomain && youtubeUrlsByDomain[resolvedDomain] && (
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg shadow-lg p-8 mb-8 border-l-4 border-red-500">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="text-3xl mr-3">🎓</span>
                            Learning Resources for {resolvedDomain || 'your selected domain'}
                        </h2>
                        
                        <p className="text-gray-600 mb-6">
                            Based on your interview domain, here are some recommended videos to enhance your knowledge:
                        </p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {youtubeUrlsByDomain[feedback.domain].map((video, idx) => (
                                <a
                                    key={idx}
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 bg-white rounded-lg hover:shadow-lg transition-all hover:translate-y-[-2px] border border-gray-200"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center w-12 h-12 bg-red-500 rounded-lg">
                                            <span className="text-xl">▶</span>
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-semibold text-gray-900 hover:text-red-600 transition-colors">
                                            {video.title}
                                        </h4>
                                        <p className="text-sm text-gray-500">YouTube</p>
                                    </div>
                                    <div className="text-gray-400 text-xl">→</div>
                                </a>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-white rounded-lg border-l-4 border-yellow-400">
                            <p className="text-sm text-gray-700">
                                <span className="font-semibold text-yellow-600">💡 Tip:</span> Watch these videos to strengthen your understanding of {feedback.domain} concepts and improve for your next interview!
                            </p>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center mb-8">
                    <button
                        onClick={handleRetakeInterview}
                        className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold flex items-center gap-2"
                    >
                        <span>🔄</span>
                        Retake Interview
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all font-semibold"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InterviewFeedbackDashboard;
=======
// InterviewFeedbackDashboard.jsx (Updated to handle nested array averages)

import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Radar, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
// import "./Feedback.css"; // Assuming this handles styling

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

/* ----- Helper: map different backend responses to UI fields (Updated for app.py structure) ----- */
const clamp = (v, min = 0, max = 10) => {
  if (v === null || v === undefined || Number.isNaN(v)) return null;
  return Math.round(Math.max(min, Math.min(max, Number(v))) * 100) / 100;
};

// Helper to safely calculate average of an array
const avg = (arr) => (Array.isArray(arr) && arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);

const mapBackendToUi = (raw) => {
  const out = {
    clarity: null,
    tone: null,
    confidence: null,
    posture: null,
    eye_contact: null,
    filler_words: null,
    communication: null, // Proxy for Relevance
    ai_comment: null,
    suggestions: [],
    transcripts: null,
    strengths: [],
    improvements: [],
    final_score: null,
    face_presence_pct: null,
    blink_rate_per_min: null, // NEW DETAIL
  };
  if (!raw) return out;

  // Assume the structure returned by /api/mock-interview-feedback/<user_id> is the 'analysis' object
  const analysis = raw.analysis || raw; 
  
  // Extract nested objects
  const sem = analysis.semantic_analysis || {};
  const tone = analysis.tone_confidence || {};
  const body = analysis.body_language || {};
  const face = analysis.face_analysis || {};
  const audio = analysis.audio_analysis || {};

  // --- Map Core Metrics ---
  
  // Clarity: Average of the clarity scores array
  out.clarity = clamp(avg(sem.clarity));
  
  // Communication (Relevance): Average of the relevance scores array
  out.communication = clamp(avg(sem.relevance)); 
  
  // Tone: Average of the tone scores array
  out.tone = clamp(avg(tone.tone));
  
  // Confidence: Average of the confidence scores array (as requested)
  out.confidence = clamp(avg(tone.confidence)); 
  
  // Posture: Direct value from body_language
  out.posture = clamp(body.posture);
  
  // Eye Contact: Direct value from body_language
  out.eye_contact = clamp(body.eye_contact); 
  
  // --- Map Auxiliary Metrics ---
  out.face_presence_pct = face.face_presence_pct ?? null;
  out.filler_words = audio.filler_count ?? null;
  out.blink_rate_per_min = face.blink_rate_per_min ?? null;

  // --- Map Final Feedback ---
  
  // Final Score: Calculated in the Flask simulation
  out.final_score = raw.final_score_0_100 ?? null;
  
  // General Comment/Suggestion
  out.ai_comment = analysis.improvement_area || null;
  
  // Transcripts
  out.transcripts = analysis.full_transcript || audio.transcript || null;
  
  // Strengths/Improvements (Using heuristics from the comment for now, as they aren't arrays in the mock)
  if (out.ai_comment) {
      out.improvements = [out.ai_comment];
      out.strengths = ["Content was relevant", "Confidence appeared steady"]; // Placeholder suggestions
  }

  // Fallback if final score is not top-level but inside analysis
  if (out.final_score === null) {
      out.final_score = analysis.final_score_0_100 ?? null;
  }
  
  return out;
};

/* ----- Component ----- */
const FeedbackDashboard = () => {
  const { user } = useSelector((s) => s.auth || {});
  const [rawFeedback, setRawFeedback] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001";

  useEffect(() => {
    let mounted = true;
    const fetchFeedback = async () => {
      setLoading(true);
      const guestId = 'guest_user_123';
      const fetchUserId = user?._id || guestId; 

      try {
        // NOTE: Fetching the LAST saved analysis (using the get_feedback route)
        const res = await axios.get(`${API_BASE}/api/mock-interview-feedback/${fetchUserId}`);
        const raw = res.data && res.data.feedback ? res.data.feedback : res.data;
        if (!mounted) return;
        setRawFeedback(raw);
        setFeedback(mapBackendToUi(raw));
      } catch (err) {
        // Fallback to session storage if direct fetch fails (e.g., if you came from MockInterview.jsx)
        const sessionData = sessionStorage.getItem("latestInterviewFeedback");
        if(sessionData) {
            const raw = JSON.parse(sessionData);
            setRawFeedback(raw);
            setFeedback(mapBackendToUi(raw));
            setError(null);
        } else {
            setError("No feedback available yet. Please complete an interview first.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchFeedback();
    return () => (mounted = false);
  }, [user]);

  const radarData = useMemo(() => {
    if (!feedback) return null;
    return {
      // UPDATED Labels
      labels: ["Clarity", "Tone", "Confidence", "Posture", "Eye Contact", "Communication"], 
      datasets: [
        {
          label: "Score (0 - 10)",
          data: [
            feedback.clarity ?? 0,
            feedback.tone ?? 0,
            feedback.confidence ?? 0, // NEW
            feedback.posture ?? 0,    // NEW
            feedback.eye_contact ?? 0, // NEW
            feedback.communication ?? 0,
          ],
          backgroundColor: "rgba(111,66,193,0.12)",
          borderColor: "rgba(111,66,193,0.95)",
          pointBackgroundColor: "rgba(111,66,193,0.95)",
        },
      ],
    };
  }, [feedback]);

  const barData = useMemo(() => {
    if (!feedback) return null;
    const filler = feedback.filler_words ?? 0;
    const finalScore = feedback.final_score ?? 0;
    return {
      labels: ["Filler words", "Final score (%)"],
      datasets: [
        {
          label: "Count / %",
          data: [filler, finalScore],
          backgroundColor: ["rgba(168,85,247,0.9)", "rgba(99,102,241,0.9)"],
        },
      ],
    };
  }, [feedback]);

  const handleRetry = () => {
    window.location.href = "/mock-interview";
  };

  if (loading) {
    return (
      <div className="fb-container">
        <div className="fb-card fb-loading">
          <div className="spinner-border text-secondary" role="status"><span className="sr-only" /></div>
          <div>Loading feedback...</div>
        </div>
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div className="fb-container">
        <div className="fb-card">
          <div className="alert alert-warning mb-0">{error || "No feedback available."}</div>
        </div>
      </div>
    );
  }

  // --- Main Render (Dashboard) ---
  return (
    <div className="fb-container">
      <div className="fb-card">
        <div className="fb-header d-flex justify-content-between align-items-center">
          <div>
            <h3 className="mb-0">Interview Feedback</h3>
            <small className="text-muted">Detailed AI analysis — user: <strong>{user?._id || "guest"}</strong></small>
          </div>
          <div>
            <button className="btn btn-outline-primary me-2" onClick={handleRetry}>Retry Interview</button>
          </div>
        </div>

        <div className="fb-top row align-items-center">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <div className="fb-score-card">
              <div className="fb-score-circle">
                <div className="fb-score-num">{feedback.final_score !== null ? Math.round(feedback.final_score) : "—"}</div>
                <div className="fb-score-sub">/ 100</div>
              </div>
              <div className="mt-3 text-center">
                <div className="fb-ai-comment">{feedback.ai_comment || "Comprehensive feedback is shown below."}</div>
                <div className="text-muted small mt-1">Clarity, Tone, Body & QA evaluated</div>
              </div>
            </div>
          </div>

          <div className="col-lg-8 col-md-6 col-sm-12">
            <div className="row g-3">
              {/* Row 1: Content/Tone */}
              <div className="col-6">
                <div className="fb-metric">
                  <div className="fb-metric-title">Clarity (Verbal)</div>
                  <div className="fb-metric-value">{feedback.clarity ?? "N/A"} / 10</div>
                  <div className="fb-progress">
                    <div className="fb-progress-bar" style={{ width: `${(feedback.clarity ?? 0) * 10}%`, background: "linear-gradient(90deg,#8b5cf6,#7c3aed)" }} />
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="fb-metric">
                  <div className="fb-metric-title">Communication (Relevance)</div>
                  <div className="fb-metric-value">{feedback.communication ?? "N/A"} / 10</div>
                  <div className="fb-progress">
                    <div className="fb-progress-bar" style={{ width: `${(feedback.communication ?? 0) * 10}%`, background: "linear-gradient(90deg,#8b5cf6,#7c3aed)" }} />
                  </div>
                </div>
              </div>

              {/* Row 2: Voice/Confidence */}
              <div className="col-6">
                <div className="fb-metric">
                  <div className="fb-metric-title">Tone (Vocal)</div>
                  <div className="fb-metric-value">{feedback.tone ?? "N/A"} / 10</div>
                  <div className="fb-progress">
                    <div className="fb-progress-bar" style={{ width: `${(feedback.tone ?? 0) * 10}%`, background: "linear-gradient(90deg,#6d28d9,#8b5cf6)" }} />
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="fb-metric">
                  <div className="fb-metric-title">Confidence (Vocal)</div>
                  <div className="fb-metric-value">{feedback.confidence ?? "N/A"} / 10</div>
                  <div className="fb-progress">
                    <div className="fb-progress-bar" style={{ width: `${(feedback.confidence ?? 0) * 10}%`, background: "linear-gradient(90deg,#7c3aed,#a78bfa)" }} />
                  </div>
                </div>
              </div>

              {/* Row 3: Body Language */}
              <div className="col-6">
                <div className="fb-metric">
                  <div className="fb-metric-title">Posture (Body)</div>
                  <div className="fb-metric-value">{feedback.posture ?? "N/A"} / 10</div>
                  <div className="fb-progress">
                    <div className="fb-progress-bar" style={{ width: `${(feedback.posture ?? 0) * 10}%`, background: "linear-gradient(90deg,#8b5cf6,#7c3aed)" }} />
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="fb-metric">
                  <div className="fb-metric-title">Eye Contact (Body)</div>
                  <div className="fb-metric-value">{feedback.eye_contact ?? "N/A"} / 10</div>
                  <div className="fb-progress">
                    <div className="fb-progress-bar" style={{ width: `${(feedback.eye_contact ?? 0) * 10}%`, background: "linear-gradient(90deg,#8b5cf6,#7c3aed)" }} />
                  </div>
                </div>
              </div>
              
              {/* Row 4: Auxiliary Metrics */}
              <div className="col-6">
                <div className="fb-metric">
                  <div className="fb-metric-title">Filler Words</div>
                  <div className="fb-metric-value">{feedback.filler_words ?? 0}</div>
                  <div className="text-muted small">Total Count</div>
                </div>
              </div>
              <div className="col-6">
                <div className="fb-metric">
                  <div className="fb-metric-title">Blink Rate</div>
                  <div className="fb-metric-value">{feedback.blink_rate_per_min ?? "N/A"}</div>
                  <div className="text-muted small">Per Minute</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="fb-charts row mt-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h6>Radar overview</h6>
                {radarData ? <Radar data={radarData} options={{ scales: { r: { beginAtZero: true, max: 10 } }, plugins: { legend: { display: false } } }} /> : <div className="text-muted">No data</div>}
              </div>
            </div>
          </div>

          <div className="col-md-6 mt-3 mt-md-0">
            <div className="card">
              <div className="card-body">
                <h6>Filler words & Final Score</h6>
                {barData ? <Bar data={barData} options={{ indexAxis: "y", scales: { x: { beginAtZero: true, max: 100 } }, plugins: { legend: { display: false } } }} /> : <div className="text-muted">No data</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Transcript & suggestions */}
        <div className="fb-details row mt-4">
          <div className="col-md-8">
            <div className="card mb-3">
              <div className="card-body">
                <h6>AI Comment</h6>
                <p className="text-sm italic text-gray-700">{feedback.ai_comment || "No detailed AI comment was generated for this session."}</p>
              </div>
            </div>
            
            <div className="card mb-3">
              <div className="card-body">
                <h6>Transcript</h6>
                <pre className="fb-transcript">{feedback.transcripts || "Transcript not available."}</pre>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card mb-3">
              <div className="card-body">
                <h6>Suggestions</h6>
                {feedback.improvements && feedback.improvements.length ? (
                  <ul>
                    {feedback.improvements.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                ) : <p className="text-muted">No specific suggestions provided.</p>}
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h6>Strengths</h6>
                {feedback.strengths && feedback.strengths.length ? (
                  <ul>
                    {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                ) : <p className="text-muted">Strengths not automatically identified.</p>}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDashboard;
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
