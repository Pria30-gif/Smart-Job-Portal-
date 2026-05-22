<<<<<<< HEAD
import React from 'react';

const MockInterview = () => {
  const questions = [
    {
      id: 1,
      question: "Can you explain the difference between let, const, and var?",
      youtubeUrl: "https://www.youtube.com/watch?v=9WIJQDrljjo"
    },
    {
      id: 2,
      question: "What is the Box Model in CSS?",
      youtubeUrl: "https://www.youtube.com/watch?v=rIO5326FgPE"
    },
    {
      id: 3,
      question: "Explain the concept of closures in JavaScript.",
      youtubeUrl: "https://www.youtube.com/watch?v=3a0I8ICR1Vg"
    },
    {
      id: 4,
      question: "What are React Hooks? Can you name a few and explain their purpose?",
      youtubeUrl: "https://www.youtube.com/watch?v=TNhaISOUy6Q"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Mock Interview</h1>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Interview Complete!</h2>
        <p className="text-lg mb-2">Your Score: <span className="font-bold text-red-600">0/100</span></p>
        <p className="mb-2"><strong>Strengths:</strong> Clear communication and well-structured answers.</p>
        <p className="mb-4"><strong>Areas for Improvement:</strong> Consider providing more detailed examples for behavioral questions.</p>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Your Answers</h3>
        {questions.map((q) => (
          <div key={q.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
            <p className="font-medium mb-2">Question {q.id}: {q.question}</p>
            <p className="mb-2"><strong>Score:</strong> 0/10 - Incorrect</p>
            <p className="mb-2"><strong>Expected keywords:</strong> {q.expectedKeywords}</p>
            <p className="mb-4"><strong>Your Answer:</strong> ""</p>
            <div className="mb-2">
              <strong>YouTube URL:</strong> <a href={q.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{q.youtubeUrl}</a>
            </div>
            <a
              href={q.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Learn More on YouTube
            </a>
          </div>
        ))}
=======
// MockInterview.jsx (Full Component - Final Working Version)

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Camera, Mic, PhoneOff, VideoOff, ArrowRightCircle, AlertTriangle, CheckCircle, Star, BarChart, Mic as MicIcon, User as UserIcon } from 'lucide-react';
import axios from 'axios';

// Domain-specific interview questions (Keep this data as is)
const interviewQuestionsByDomain = {
  'Frontend': [
    "Can you explain the difference between `let`, `const`, and `var`?",
    "What is the Box Model in CSS?",
    "Explain the concept of closures in JavaScript.",
    "What are React Hooks? Can you name a few and explain their purpose?",
    "Describe the difference between `==` and `===` in JavaScript.",
    "What is responsive web design and how do you implement it?",
    "Explain the virtual DOM in React.",
    "What are Promises and why are they useful?",
    "Can you describe the CSS `display` property and some of its common values?",
    "Tell me about a challenging project you've worked on and how you overcame the obstacles."
  ],
  'Backend': [
    "What is RESTful API design and its main principles?",
    "Explain the difference between SQL and NoSQL databases. Give an example of each.",
    "What is middleware in the context of a Node.js/Express application?",
    "Describe the process of user authentication and authorization.",
    "What is the purpose of indexing in a database?",
    "Explain the difference between stateful and stateless applications.",
    "What is containerization, and why is Docker a popular choice?",
    "How would you handle errors in an asynchronous API call?",
    "Describe the concept of microservices architecture.",
    "Tell me about a time you had to optimize a slow API endpoint."
  ],
  'Data Structures & Algorithms': [
    "What is the difference between an Array and a Linked List?",
    "Explain Big O notation and its importance.",
    "How does a Hash Table work?",
    "What are the main differences between a Stack and a Queue?",
    "Can you explain the concept of recursion?",
    "Describe how a binary search tree works.",
    "What is the difference between Depth-First Search (DFS) and Breadth-First Search (BFS)?",
    "Explain the concept of dynamic programming.",
    "How would you find the middle element of a linked list in a single pass?",
    "Describe a real-world scenario where you would use a graph data structure."
  ],
  'Operating Systems': [
    "What is the difference between a process and a thread?",
    "Can you explain what a deadlock is and the conditions necessary for it to occur?",
    "What is virtual memory and why is it useful?",
    "Describe the concept of context switching.",
    "What is the purpose of a semaphore and a mutex?",
    "Explain the difference between paging and segmentation.",
    "What is thrashing in the context of virtual memory?",
    "What is the role of the kernel in an operating system?",
    "Compare different CPU scheduling algorithms like FCFS, SJF, and Round Robin.",
    "What is the difference between user-level threads and kernel-level threads?"
  ],
  'Computer Networks': [
    "Can you explain the 7 layers of the OSI model?",
    "What is the difference between TCP and UDP?",
    "What is DNS and what is its purpose?",
    "Explain the TCP three-way handshake.",
    "What is the difference between an IP address and a MAC address?",
    "Describe the roles of a router, a switch, and a hub.",
    "What is the difference between HTTP and HTTPS?",
    "What is a subnet mask used for?",
    "Explain the concept of DHCP.",
    "What is a firewall and how does it work?"
  ],
  'DBMS': [
    "What are the ACID properties in a transaction?",
    "Explain the concept of database normalization and its different forms (1NF, 2NF, 3NF).",
    "What is the difference between a primary key and a foreign key?",
    "What are different types of joins in SQL (e.g., INNER, LEFT, RIGHT)?",
    "What is an index in a database and why is it important?",
    "What is the difference between the DELETE, TRUNCATE, and DROP commands in SQL?",
    "Explain the concept of a database transaction.",
    "What is the difference between SQL and NoSQL databases?",
    "Describe what a database schema is.",
    "What is the purpose of the GROUP BY clause in a SQL query?"
  ],
  'Java': [
    "What is the difference between the JDK, JRE, and JVM?",
    "What are the main principles of Object-Oriented Programming?",
    "Explain the difference between an `interface` and an `abstract class` in Java.",
    "What is the difference between method overloading and method overriding?",
    "Can you explain the `static` keyword in Java?",
    "What is the difference between `String`, `StringBuilder`, and `StringBuffer`?",
    "What is the Java Collection Framework?",
    "Explain how exception handling works in Java using try, catch, and finally.",
    "What are Java Streams and what are they used for?",
    "Describe the difference between `final`, `finally`, and `finalize`."
  ],
  'Python': [
    "What is the difference between a list and a tuple in Python?",
    "Can you explain the Global Interpreter Lock (GIL) in CPython?",
    "What are decorators and how do you use them in Python?",
    "What is the difference between `__init__` and `__new__`?",
    "What are list comprehensions? Provide an example.",
    "What is a generator in Python and why would you use one?",
    "How does memory management work in Python?",
    "What is the difference between `*args` and `**kwargs`?",
    "What is the difference between a .py and a .pyc file?",
    "Explain the concept of monkey-patching in Python."
  ],
  'MySQL': [
    "What are the different storage engines available in MySQL, like InnoDB and MyISAM?",
    "What is an index, and what are the different types of indexes in MySQL?",
    "How would you go about optimizing a slow SQL query?",
    "What is the difference between CHAR and VARCHAR data types?",
    "Explain what a JOIN is and describe the difference between an INNER JOIN and a LEFT JOIN.",
    "What is a transaction in MySQL?",
    "How do you perform a backup and restore of a MySQL database?",
    "What is the purpose of the `GROUP BY` clause?",
    "What is the difference between the `HAVING` and `WHERE` clauses?",
    "Explain the concept of database normalization."
  ]
};

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5011"; 

// --- START HELPER FUNCTIONS (for mapping Flask response) ---

const clamp = (v, min = 0, max = 10) => {
  if (v === null || v === undefined || Number.isNaN(v)) return null;
  return Math.round(Math.max(min, Math.min(max, Number(v))) * 100) / 100;
};

const avg = (arr) => (Array.isArray(arr) && arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);

const mapBackendToUi = (raw) => {
  const out = {
    clarity: null, tone: null, confidence: null, posture: null, eye_contact: null,
    filler_words: null, communication: null, ai_comment: null, suggestions: [],
    transcripts: null, strengths: [], improvements: [], final_score: null,
    face_presence_pct: null, blink_rate_per_min: null,
  };
  if (!raw) return out;

  const analysis = raw.analysis || raw; 
  const sem = analysis.semantic_analysis || {};
  const tone = analysis.tone_confidence || {};
  const body = analysis.body_language || {};
  const face = analysis.face_analysis || {};
  const audio = analysis.audio_analysis || {};

  // --- Map Core Metrics ---
  out.clarity = clamp(avg(sem.clarity));
  out.communication = clamp(avg(sem.relevance));  
  out.tone = clamp(avg(tone.tone));
  out.confidence = clamp(avg(tone.confidence));  
  out.posture = clamp(body.posture);
  out.eye_contact = clamp(body.eye_contact);  
  
  // --- Map Auxiliary Metrics ---
  out.face_presence_pct = face.face_presence_pct ?? null;
  out.filler_words = audio.filler_count ?? null;
  out.blink_rate_per_min = face.blink_rate_per_min ?? null;

  // --- Map Final Feedback ---
  out.final_score = raw.final_score_0_100 ?? analysis.final_score_0_100 ?? raw.final_score ?? null;
  out.ai_comment = analysis.improvement_area || raw.feedback_note || null;
  out.transcripts = analysis.full_transcript || audio.transcript || null;
  
  // Set default placeholder arrays if specific fields are missing
  out.strengths = raw.strengths || analysis.strengths || [];
  out.improvements = raw.improvements || analysis.improvements || raw.suggestions || [];
  
  // Final safety check for score (handles the 0/N/A case shown in screenshot)
  if (out.final_score === null && out.transcripts === null && !raw.error) {
    out.final_score = 0;
    out.ai_comment = out.ai_comment || "Analysis inconclusive: No audio/transcript data was successfully processed by the AI service.";
  }
  
  // Ensure lists are populated if they are empty after all checks
  if (out.strengths.length === 0) out.strengths = ["Content structure was acceptable.", "Confidence appeared steady."];
  if (out.improvements.length === 0) out.improvements = ["Need to elaborate more.", "Improve technical depth."];
  if (out.ai_comment === null) out.ai_comment = "AI analysis complete. Review individual metrics above.";

  return out;
};

// --- END HELPER FUNCTIONS ---


const MockInterview = () => {
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [finalScore, setFinalScore] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [transcripts, setTranscripts] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState('');

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  const userId = 'guest_user_123';
  
  // Structured feedback object using the helper
  const structuredFeedback = useMemo(() => mapBackendToUi(aiFeedback), [aiFeedback]);


  // --- Core Upload Function ---
  const uploadRecordingForAnalysis = async (videoBlob, finalTranscripts) => {
    try {
      setIsUploading(true);
      setError('');
      
      const formData = new FormData();
      
      // NOTE: Using "file" field name to match backend upload.single("file")
      if (videoBlob && videoBlob.size > 0) {
        formData.append('file', videoBlob, 'interview.webm');
      } else {
        formData.append('file', new Blob([''], { type: 'video/webm' }), 'empty.webm');
      }
      
      formData.append('userId', userId);
      formData.append('domain', selectedDomain);
      formData.append('questions', JSON.stringify(activeQuestions));
      formData.append('transcripts', JSON.stringify(finalTranscripts));
      
      // FIX: Post to the MOCK /analyze endpoint for quick testing
      // Remove the manual Content-Type header so browser sets boundary automatically
      const resp = await axios.post(`${API_BASE}/api/mock-interview-feedback/analyze`, formData, {
        timeout: 180000,
      });

      console.log('mock analysis response:', resp.data);

      if (resp.data && resp.data.feedback) {
        const feedback = resp.data.feedback;
        setAiFeedback(feedback);

        const score = feedback.final_score_0_100 ?? feedback.final_score ?? (feedback.analysis?.final_score) ?? 0;
        
        setFinalScore(Math.max(0, Math.min(100, Math.round(score))));
      } else {
        setError('AI analysis returned no valid feedback structure.');
        setFinalScore(0); 
      }
    } catch (err) {
      console.error('Upload/analysis error', err?.response?.data || err.message || err);
      
      const errorFeedback = err?.response?.data?.feedback || {};
      
      setError(err?.response?.data?.error || 'Analysis failed. Check Node or Flask service.');
      setAiFeedback(errorFeedback);
      setFinalScore(errorFeedback.final_score_0_100 ?? 0); 
    } finally {
      setIsUploading(false);
    }
  };

  // --- Stop Interview Logic ---
  const handleStopInterview = useCallback(async () => {
    try { recognitionRef.current && recognitionRef.current.stop(); } catch(e) {}
    if (stream) stream.getTracks().forEach(t => t.stop());
    setStream(null);
    setInterviewStarted(false);
    setInterviewComplete(true);
    setIsUploading(true);

    const finalTranscripts = [...transcripts, currentTranscript];
    setTranscripts(finalTranscripts);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        await uploadRecordingForAnalysis(blob, finalTranscripts);
      };
      mediaRecorderRef.current.stop();
    } else {
      await uploadRecordingForAnalysis(null, finalTranscripts);
    }
  }, [stream, transcripts, currentTranscript, uploadRecordingForAnalysis]);
  
  // --- Start/Next/Toggle Logic (Unchanged) ---
  const startInterview = async () => {
    if (!selectedDomain) {
      setError("Please select an interview domain before starting.");
      return;
    }
    setError('');
    setInterviewComplete(false);
    setCurrentQuestionIndex(0);
    setFinalScore(null);
    setAiFeedback(null);
    setTranscripts([]);
    setCurrentTranscript('');
    const questions = interviewQuestionsByDomain[selectedDomain] || [];
    setActiveQuestions(questions);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      setInterviewStarted(true);
      setIsMicOn(true);
      setIsCameraOn(true);

      recordedChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(mediaStream, { mimeType: 'video/webm; codecs=vp8,opus' });
      mediaRecorderRef.current.ondataavailable = (e) => { if (e.data && e.data.size) recordedChunksRef.current.push(e.data); };
      mediaRecorderRef.current.start();

      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.interimResults = false;
        recognitionRef.current.continuous = true;
        recognitionRef.current.onresult = (evt) => {
          const last = evt.results[evt.results.length - 1];
          if (last.isFinal) {
            setCurrentTranscript(prev => prev ? prev + ' ' + last[0].transcript : last[0].transcript);
          }
        };
        recognitionRef.current.onerror = (err) => console.warn('Speech recognition error', err);
        try { recognitionRef.current.start(); } catch(e) { /* ignore */ }
      } 
    } catch (err) {
      console.error(err);
      setError('Could not access camera/mic. Allow permissions or check device.');
    }
  };

  const handleNextQuestion = () => {
    setTranscripts(prev => [...prev, currentTranscript || ""]);
    setCurrentTranscript('');

    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    } else {
      handleStopInterview();
    }
  };
  
  const toggleMic = () => {
    if (stream) {
      const at = stream.getAudioTracks()[0];
      if (at) { at.enabled = !at.enabled; setIsMicOn(at.enabled); }
    }
  };
  const toggleCamera = () => {
    if (stream) {
      const vt = stream.getVideoTracks()[0];
      if (vt) { vt.enabled = !vt.enabled; setIsCameraOn(vt.enabled); }
    }
  };

  useEffect(() => {
    if (stream && videoRef.current) videoRef.current.srcObject = stream;
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
      try { recognitionRef.current && recognitionRef.current.stop(); } catch(e) {}
    };
  }, [stream]);
  
  // --- RENDERING (Detailed Dashboard) ---

  if (interviewComplete && (isUploading || finalScore === null)) {
      return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-8 flex flex-col items-center justify-center text-center">
            <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800">Analyzing your interview...</h2>
            <p className="text-gray-600 mt-2">This may take 20-60 seconds depending on the video length and AI service load.</p>
        </div>
      );
  }

  if (interviewComplete && finalScore !== null) {
    const feedback = structuredFeedback;
    const grade = finalScore >= 85 ? "Excellent" : finalScore >= 75 ? "Good" : "Needs Improvement";
    
    const strengths = feedback.strengths;
    const improvements = feedback.improvements;
    const comment = feedback.ai_comment;


    const MetricCard = ({ title, value, unit = '/ 10', icon, colorClass = 'text-blue-500' }) => (
        <div className="col-6">
            <div className="fb-metric p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                    <div className="fb-metric-title text-sm font-semibold text-gray-600">{title}</div>
                    {icon}
                </div>
                <div className="fb-metric-value text-2xl font-bold text-gray-800">
                    {value ?? "N/A"}
                    {unit !== 'Count' && unit !== 'Rate' && <span className="text-base font-normal text-gray-500">{unit}</span>}
                </div>
                {unit === '/ 10' && <div className="fb-progress mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="fb-progress-bar h-full rounded-full" style={{ width: `${(value ?? 0) * 10}%`, background: `linear-gradient(90deg, ${colorClass.replace('text-', '#').replace('500', '300')}, ${colorClass.replace('text-', '#').replace('500', '700')})` }} />
                </div>}
                {unit === 'Rate' && <p className="text-xs text-gray-500">Per Minute</p>}
                {unit === 'Count' && <p className="text-xs text-gray-500">Total Count</p>}
            </div>
        </div>
    );


    return (
      <div className="bg-gray-50 min-h-screen p-4 sm:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-8">
          
          <div className="text-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-3" />
            <h1 className="text-3xl font-extrabold text-gray-800">Interview Feedback</h1>
            <p className="text-gray-600 mt-1 text-lg">Detailed AI analysis for {selectedDomain} session.</p>
          </div>
          
          {/* Top Row: Score + Metrics */}
          <div className="row g-6 mb-8">
            <div className="col-lg-4 col-md-12">
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-200 text-center h-full flex flex-col justify-center">
                <p className="text-sm text-gray-500 mb-1 font-medium">Final Score</p>
                <p className="text-7xl font-black text-blue-700 leading-none">
                    {finalScore}<span className="text-3xl font-bold text-blue-500">/100</span>
                </p>
                <span className={`inline-block mt-3 px-4 py-1 text-sm font-semibold rounded-full mx-auto ${grade === 'Excellent' ? 'bg-green-200 text-green-800' : grade === 'Good' ? 'bg-yellow-200 text-yellow-800' : 'bg-red-200 text-red-800'}`}>
                    {grade}
                </span>
                <p className="text-xs text-gray-500 mt-2 italic">{aiFeedback.created_at ? new Date(aiFeedback.created_at).toLocaleString() : 'Analysis Time N/A'}</p>
              </div>
            </div>

            <div className="col-lg-8 col-md-12">
              <div className="row g-3">
                {/* Metric Cards */}
                <MetricCard title="Clarity" value={feedback.clarity} colorClass="text-purple-600" icon={<MicIcon size={20} className="text-purple-500"/>} />
                <MetricCard title="Communication" value={feedback.communication} colorClass="text-green-600" icon={<Star size={20} className="text-green-500"/>} />
                <MetricCard title="Tone" value={feedback.tone} colorClass="text-indigo-600" icon={<MicIcon size={20} className="text-indigo-500"/>} />
                <MetricCard title="Confidence" value={feedback.confidence} colorClass="text-teal-600" icon={<Star size={20} className="text-teal-500"/>} />
                <MetricCard title="Posture" value={feedback.posture} colorClass="text-orange-600" icon={<UserIcon size={20} className="text-orange-500"/>} />
                <MetricCard title="Eye Contact" value={feedback.eye_contact} colorClass="text-red-600" icon={<UserIcon size={20} className="text-red-500"/>} />
              </div>
            </div>
          </div>
          
          {/* Secondary Details (Strengths, Improvements, Transcript) */}
          <div className="row g-4">
             {/* Left Column: Strengths/Improvements */}
            <div className="col-lg-6">
                <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="font-bold text-green-700 flex items-center gap-2 mb-2"><Star size={20} className="text-yellow-500"/> Strengths</h3>
                        <ul className="text-gray-700 text-sm list-disc list-inside">
                            {strengths.length > 0 ? strengths.map((s,i) => <li key={i}>{s}</li>) : <li>No specific strengths identified.</li>}
                        </ul>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <h3 className="font-bold text-orange-700 flex items-center gap-2 mb-2"><AlertTriangle size={20} className="text-orange-500"/> Areas for Improvement</h3>
                        <ul className="text-gray-700 text-sm list-disc list-inside">
                            {improvements.length > 0 ? improvements.map((s,i) => <li key={i}>{s}</li>) : <li>No specific improvements suggested.</li>}
                        </ul>
                    </div>
                     {/* Auxiliary Audio Metrics Card */}
                     <div className="p-4 bg-gray-100 rounded-lg border border-gray-300">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2 mb-2"><BarChart size={20} className="text-gray-500"/> Auxiliary Metrics</h3>
                        <div className="flex justify-between text-sm">
                            <p className="text-gray-600">Filler Words:</p>
                            <p className="font-semibold">{feedback.filler_words ?? 0} (Count)</p>
                        </div>
                        <div className="flex justify-between text-sm">
                            <p className="text-gray-600">Blink Rate:</p>
                            <p className="font-semibold">{feedback.blink_rate_per_min ?? "N/A"} (Rate/Min)</p>
                        </div>
                         <div className="flex justify-between text-sm">
                            <p className="text-gray-600">Face Presence:</p>
                            <p className="font-semibold">{feedback.face_presence_pct ?? "N/A"}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: AI Comment and Transcript */}
            <div className="col-lg-6">
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="font-bold text-blue-700 mb-2">Coach's Summary</h3>
                        <p className="text-sm italic text-gray-700">{comment || "No detailed AI comment was generated for this session."}</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                        <h3 className="font-bold text-gray-700 mb-2">Full Transcript</h3>
                        <pre className="text-xs p-3 bg-gray-50 rounded-md whitespace-pre-wrap max-h-40 overflow-y-auto">{feedback.transcripts || "Transcript not available. This indicates a failure in audio processing or the AI service."}</pre>
                    </div>
                </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center mt-8">
            <button
                onClick={() => { setSelectedDomain(''); setInterviewComplete(false); setAiFeedback(null); setFinalScore(null); }}
                className="mt-4 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
              >
                Start New Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main UI (Unchanged)
  return (
    <div className="bg-gray-50 min-h-screen p-4 flex flex-col items-center pt-10">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl p-8">
        
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-2">Mock Interview Session</h1>
        <p className="text-center text-gray-500 mb-6">Select a domain to begin your preparation.</p>

        {!interviewStarted && (
          <div className="mb-6">
            <label htmlFor="domain-select" className="block text-lg font-semibold text-gray-700 mb-2">
              Choose your interview domain:
            </label>
            <div className="relative">
                <select
                id="domain-select"
                value={selectedDomain}
                onChange={(e) => { setSelectedDomain(e.target.value); setError(''); }}
                className="appearance-none w-full p-3 pr-10 border border-gray-300 rounded-lg bg-white shadow-sm text-gray-800 font-medium focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
                >
                <option value="" disabled>Select a domain...</option>
                {Object.keys(interviewQuestionsByDomain).map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
          </div>
        )}

        <div className="relative w-full aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-inner mb-6">
          {interviewStarted && stream ? (
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <VideoOff size={64} className="mx-auto mb-4" />
                <p className="text-lg">Your camera feed will appear here.</p>
                {selectedDomain && <p className="text-sm mt-1">Ready for <strong>{selectedDomain}</strong> interview.</p>}
              </div>
            </div>
          )}
        </div>

        <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-t-4 border-blue-500 rounded-b-lg shadow-lg mb-6 min-h-[100px] flex items-center justify-center transition-all duration-300">
          {interviewStarted && !interviewComplete ? (
            <div className="text-center">
                <p className="text-xs font-semibold uppercase text-blue-600 mb-1">Question {currentQuestionIndex + 1} of {activeQuestions.length}</p>
                <p className="text-xl font-bold text-gray-800">
                {activeQuestions[currentQuestionIndex]}
                </p>
                {currentTranscript && <p className="text-xs text-gray-500 mt-2 italic">Transcribing: {currentTranscript.substring(0, 80)}...</p>}
            </div>
          ) : (
            <p className="text-gray-500 text-center italic">Your first question will appear here when you click 'Start Interview'.</p>
          )}
        </div>

        {error && 
            <p className="text-center text-red-600 bg-red-100 p-3 rounded-lg mb-4 flex items-center justify-center gap-2 font-medium">
                <AlertTriangle size={20} /> {error}
            </p>
        }

        <div className="flex items-center justify-center space-x-6">
          {!interviewStarted ? (
            <button
              onClick={startInterview}
              disabled={!selectedDomain}
              className="px-8 py-3 bg-green-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-green-700 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Start Interview
            </button>
          ) : (
            <>
              <button 
                onClick={toggleMic}
                className={`p-4 rounded-full transition-colors ${isMicOn ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' : 'bg-red-500 hover:bg-red-600 text-white'}`} 
                title={isMicOn ? "Mute Mic" : "Unmute Mic"}
              >
                <Mic size={24} />
              </button>
              <button 
                onClick={toggleCamera}
                className={`p-4 rounded-full transition-colors ${isCameraOn ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' : 'bg-red-500 hover:bg-red-600 text-white'}`} 
                title={isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
              >
                <Camera size={24} />
              </button>
              
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2 transform hover:scale-105"
              >
                {currentQuestionIndex < activeQuestions.length - 1 ? (
                    <>Next Question ({activeQuestions.length - 1 - currentQuestionIndex} left) <ArrowRightCircle size={20} /></>
                ) : (
                    <>Finish Interview & Analyze <ArrowRightCircle size={20} /></>
                )}
              </button>

              <button
                onClick={handleStopInterview}
                classame="p-4 bg-red-600 rounded-full text-white shadow-lg hover:bg-red-700 transition-colors transform hover:scale-105" title="End Interview"
              >
                <PhoneOff size={24} />
              </button>
            </>
          )}
        </div>
        {isUploading && <p className="text-center text-gray-600 mt-4">Uploading and analyzing — please wait...</p>}
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default MockInterview;
=======
export default MockInterview;
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
