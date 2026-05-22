# 🎯 Real Analysis Integration - Data Flow Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     SMART JOB PORTAL                             │
│              Mock Interview Real Analysis System                 │
└─────────────────────────────────────────────────────────────────┘

                        FRONTEND (React)
                        ════════════════

    ┌────────────────────────────────────────────────────────┐
    │              MockInterviewPrep.jsx                     │
    │  ┌──────────────────────────────────────────────────┐  │
    │  │  1. Select Domain (Frontend/Backend/etc)         │  │
    │  │  2. Answer 10 Questions                          │  │
    │  │  3. Record Video + Transcripts                   │  │
    │  │  4. Calculate Local Score                        │  │
    │  │  5. Show Results Screen                          │  │
    │  └──────────────────────────────────────────────────┘  │
    │                      │                                  │
    │                      ▼                                  │
    │  ┌──────────────────────────────────────────────────┐  │
    │  │  POST /api/mock-interview-feedback/upload        │  │
    │  │  ┌────────────────────────────────────────────┐  │  │
    │  │  │ FormData:                                  │  │  │
    │  │  │ • file (video blob)                        │  │  │
    │  │  │ • userId                                   │  │  │
    │  │  │ • domain                                   │  │  │
    │  │  │ • questions                                │  │  │
    │  │  │ • transcripts                              │  │  │
    │  │  └────────────────────────────────────────────┘  │  │
    │  │                                                    │  │
    │  │      ✨ "View Detailed AI Analysis" Button        │  │
    │  │         (Uses useNavigate to /interview-feedback) │  │
    │  │                                                    │  │
    │  │      🎯 navigate('/interview-feedback')           │  │
    │  │         (React Router navigation)                 │  │
    │  └──────────────────────────────────────────────────┘  │
    │                      │                                  │
    │                      ▼                                  │
    │  ┌──────────────────────────────────────────────────┐  │
    │  │     InterviewFeedbackDashboard.jsx               │  │
    │  │  GET /api/mock-interview-feedback/{userId}       │  │
    │  │  ┌────────────────────────────────────────────┐  │  │
    │  │  │ Display:                                   │  │  │
    │  │  │ • 📊 Speaking Confidence Gauge (0-10)      │  │  │
    │  │  │ • 📈 Performance Breakdown Bars            │  │  │
    │  │  │ • 🧍 Body Language Metrics                 │  │  │
    │  │  │ • 💡 AI Feedback (Strengths/Improve)       │  │  │
    │  │  │ • 📝 Full Transcript                       │  │  │
    │  │  │ • 🔄 Retake Interview Button               │  │  │
    │  │  └────────────────────────────────────────────┘  │  │
    │  └──────────────────────────────────────────────────┘  │
    └────────────────────────────────────────────────────────┘
                           ▲          │
                           │          │
                    ┌──────┴──────────┴──────────┐
                    │     HTTP Requests          │
                    │     JSON Responses         │
                    │     React Router Nav       │
                    └──────────┬──────┬──────────┘
                               │      │
                               ▼      ▼
                        BACKEND & DATABASE
                        ═══════════════════

    ┌────────────────────────────────────────────────────────┐
    │         Express.js Server (Port 5011)                  │
    │  ┌──────────────────────────────────────────────────┐  │
    │  │          mockInterviewFeedback Routes            │  │
    │  │  POST /upload  →  uploadInterviewVideo()         │  │
    │  │  GET /:userId  →  getFeedback()                 │  │
    │  └──────────────────────────────────────────────────┘  │
    │                      │                                  │
    │                      ▼                                  │
    │  ┌──────────────────────────────────────────────────┐  │
    │  │     mockInterviewFeedback.controller.js           │  │
    │  │  ┌────────────────────────────────────────────┐  │  │
    │  │  │ uploadInterviewVideo() {                   │  │  │
    │  │  │   1. Receive FormData                      │  │  │
    │  │  │   2. Write temp_data.json                  │  │  │
    │  │  │   3. Spawn Python process ─────────┐       │  │  │
    │  │  │   4. Parse output                  │       │  │  │
    │  │  │   5. Save to MongoDB                │       │  │  │
    │  │  │   6. Return feedback                │       │  │  │
    │  │  │ }                                   │       │  │  │
    │  │  │                                     │       │  │  │
    │  │  │ getFeedback() {                     │       │  │  │
    │  │  │   1. Query MongoDB by userId        │       │  │  │
    │  │  │   2. Get latest feedback            │       │  │  │
    │  │  │   3. Return to Frontend             │       │  │  │
    │  │  │ }                                   │       │  │  │
    │  │  └────────────────────────────────────┼────┐  │  │
    │  └──────────────────────────────────┬───────┤  │  │  │
    │                      │              │       │  │  │  │
    │                      ▼              │       │  │  │  │
    │  ┌──────────────────────────────┐   │       │  │  │  │
    │  │  analyze_interview.py        │◄──┘       │  │  │  │
    │  │  ┌──────────────────────────┐│   Python  │  │  │  │
    │  │  │ 1. Load video file       ││   Script  │  │  │  │
    │  │  │ 2. Extract audio         ││           │  │  │  │
    │  │  │ 3. Transcribe (Whisper)  ││           │  │  │  │
    │  │  │ 4. Analyze face/body     ││           │  │  │  │
    │  │  │ 5. Calculate metrics     ││           │  │  │  │
    │  │  │ 6. Generate AI feedback  ││           │  │  │  │
    │  │  │ 7. Return JSON output    ││           │  │  │  │
    │  │  └──────────────────────────┘│           │  │  │  │
    │  │                                │           │  │  │  │
    │  │  Output: {                     │           │  │  │  │
    │  │    semantic_analysis: {...}    │           │  │  │  │
    │  │    body_language: {...}        │           │  │  │  │
    │  │    tone_confidence: {...}      │           │  │  │  │
    │  │    strengths: [...]            │           │  │  │  │
    │  │    improvements: [...]         │           │  │  │  │
    │  │  }                             │           │  │  │  │
    │  └────────────┬────────────────────           │  │  │  │
    │               │◄──────────────────────────────┘  │  │  │
    │               ▼                                  │  │  │
    │  ┌──────────────────────────────────────────┐   │  │  │
    │  │         MongoDB (Document DB)            │   │  │  │
    │  │  ┌────────────────────────────────────┐  │   │  │  │
    │  │  │ mockinterviewfeedbacks Collection  │  │   │  │  │
    │  │  │ {                                  │  │   │  │  │
    │  │  │   _id: ObjectId,                   │  │   │  │  │
    │  │  │   userId: "user123",  ◄────────────┼───┼──┘  │  │
    │  │  │   domain: "Frontend",              │  │      │  │
    │  │  │   questions: [...]                 │  │      │  │
    │  │  │   transcripts: [...]               │  │      │  │
    │  │  │   feedback: {                      │  │      │  │
    │  │  │     semantic_analysis: {...},      │  │      │  │
    │  │  │     body_language: {...},          │  │      │  │
    │  │  │     tone_confidence: {...},        │  │      │  │
    │  │  │     strengths: [...],              │  │      │  │
    │  │  │     improvements: [...],           │  │      │  │
    │  │  │     suggestions: "..."             │  │      │  │
    │  │  │   },                               │  │      │  │
    │  │  │   createdAt: <timestamp>,          │  │      │  │
    │  │  │   updatedAt: <timestamp>           │  │      │  │
    │  │  │ }                                  │  │◄─────┼──┘
    │  │  └────────────────────────────────────┘  │      │
    │  │                         ▲                │      │
    │  │                         │                │      │
    │  │                    GET by userId         │      │
    │  │                         │                │      │
    │  │                         └────────────────┘      │
    │  └──────────────────────────────────────────┘      │
    └────────────────────────────────────────────────────┘
                            │
                            │ (Feedback JSON)
                            │
                            ▼
                   ┌─────────────────┐
                   │  Frontend Gets  │
                   │  Feedback Data  │
                   │  Displays in    │
                   │  Dashboard ✨   │
                   └─────────────────┘
```

---

## Request-Response Flow

### 1️⃣ INTERVIEW SUBMISSION
```
Frontend → Backend
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

POST /api/mock-interview-feedback/upload

Headers:
  Content-Type: multipart/form-data

Body:
  ├─ file: <video blob (webm)>
  ├─ userId: "507f1f77bcf86cd799439011"
  ├─ domain: "Frontend"
  ├─ questions: "[\"Q1\", \"Q2\", ...]"
  └─ transcripts: "[\"A1\", \"A2\", ...]"

Processing (Backend):
  1. Receive FormData
  2. Parse uploaded video file
  3. Write temp_data.json with metadata
  4. Call: python analyze_interview.py temp_data.json
  5. Wait for Python output
  6. Save to MongoDB
  7. Return feedback object

Response (200 OK):
  {
    "success": true,
    "feedback": {
      "semantic_analysis": {
        "relevance": [8, 7, 9, 8, 7, 8, 9, 8, 7, 8],
        "clarity": [8, 8, 7, 8, 8, 9, 8, 8, 7, 8],
        "confidence": [7, 7, 8, 7, 8, 8, 7, 8, 8, 7]
      },
      "body_language": {
        "eye_contact": 4.2,
        "posture": 7.5,
        "face_presence": 95.3,
        "emotions": {
          "neutral": 45.2,
          "confident": 35.1,
          "focused": 19.7
        }
      },
      "tone_confidence": {
        "tone": 7.8,
        "confidence": 6.8,
        "speech_rate": 7.2
      },
      "full_transcript": "Complete interview text...",
      "strengths": [
        "Clear communication",
        "Good examples",
        "Professional tone",
        "Structured responses",
        "Technical knowledge"
      ],
      "improvements": [
        "Speak more slowly",
        "Provide more detail",
        "Better eye contact",
        "More confident tone",
        "Use concrete examples"
      ],
      "suggestions": "Overall strong interview..."
    }
  }
```

### 2️⃣ FEEDBACK RETRIEVAL
```
Frontend → Backend
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GET /api/mock-interview-feedback/507f1f77bcf86cd799439011

Processing (Backend):
  1. Get userId from URL parameters
  2. Query MongoDB: MockInterviewFeedback.findOne({ userId })
  3. Sort by createdAt descending (get latest)
  4. Extract feedback.feedback field
  5. Return to Frontend

Response (200 OK):
  {
    "feedback": {
      ... (same structure as above)
    }
  }

Response if No Feedback (404):
  {
    "error": "No feedback available yet. Please complete an interview first."
  }
```

---

## Component Communication

```
MockInterviewPrep (Interview Interface)
           │
           ├─ useState hooks store:
           │  ├─ selectedDomain
           │  ├─ activeQuestions
           │  ├─ transcripts
           │  ├─ stream (camera)
           │  ├─ interviewComplete
           │  ├─ finalScore
           │  ├─ aiFeedback ◄── From Backend Response
           │  └─ analyzing
           │
           └─ useEffect hooks trigger:
              ├─ Auto-start interview when domain selected
              ├─ Setup camera/microphone
              └─ Submit video when interview finishes
                                │
                                ▼
                    [Backend Analysis Process]
                                │
                                ▼
                    [Returns feedback object]
                                │
                                ▼
                 InterviewFeedbackDashboard
                           │
                           ├─ Fetches feedback from Backend
                           ├─ Displays metrics (gauges, bars, etc)
                           ├─ Shows AI feedback
                           └─ Offers Retake button
```

---

## Error Handling Flow

```
Interview Video Upload
         │
         ▼
   Python Script Runs
         │
    ┌────┴────┐
    │ Success? │
    └────┬────┘
         │
    ┌────┴─────────────────────┐
    │                          │
   YES                        NO
    │                          │
    ▼                          ▼
 ┌────────────────┐  ┌──────────────────┐
 │ Return detailed │  │ Return FALLBACK  │
 │ AI Feedback     │  │ Basic Feedback   │
 │ (Full metrics)  │  │ (Safe defaults)  │
 └────────────────┘  └──────────────────┘
    │                          │
    │                          │
    └──────────────┬───────────┘
                   │
                   ▼
         [Always Save to DB]
                   │
                   ▼
         [Return to Frontend]
                   │
                   ▼
      [Display Dashboard]
         (with whatever
          feedback is available)
```

---

## Technology Stack

```
┌─────────────────────────────'────────────────────────────┐
│                  FRONTEND STACK                          │
├─────────────────────────────────────────────────────────┤
│ React 18.x          - UI Framework                       │
│ React Router 6      - Client-side routing                │
│ Tailwind CSS        - Styling & layout                   │
│ Lucide Icons        - Vue icons                          │
│ Web Speech API      - Speech recognition                 │
│ MediaRecorder API   - Video recording                    │
│ Axios               - HTTP requests                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  BACKEND STACK                           │
├─────────────────────────────────────────────────────────┤
│ Node.js 16+         - Runtime environment               │
│ Express.js          - Web framework                      │
│ MongoDB             - Document database                  │
│ Mongoose            - ODM (Object mapping)               │
│ Multer              - File upload handling               │
│ child_process       - Python script execution            │
│ Cors                - Cross-origin requests              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  AI ANALYSIS STACK                       │
├─────────────────────────────────────────────────────────┤
│ Python 3.8+         - AI script runtime                  │
│ OpenCV              - Video processing                   │
│ Whisper             - Speech-to-text transcription       │
│ DeepFace            - Face/emotion analysis              │
│ MediaPipe           - Pose and hand tracking             │
│ NumPy/Pandas        - Data processing                    │
│ JSON                - Data serialization                 │
└─────────────────────────────────────────────────────────┘
```

---

## Data Model

```
┌──────────────────────────────────────────────────────────┐
│          MockInterviewFeedback (MongoDB)                 │
├──────────────────────────────────────────────────────────┤
│ _id: ObjectId                                            │
│ userId: String (indexed)                                 │
│ domain: String (Frontend/Backend/etc)                   │
│ questions: [String]  (10 questions array)               │
│ transcripts: [String]  (10 answers array)               │
│ feedback: {                                              │
│   semantic_analysis: {                                   │
│     relevance: [Number],  (score per question)          │
│     clarity: [Number],    (score per question)          │
│     confidence: [Number]  (score per question)          │
│   },                                                     │
│   body_language: {                                       │
│     eye_contact: Number,     (percentage)                │
│     posture: Number,         (0-100 score)              │
│     face_presence: Number,   (percentage)                │
│     emotions: {              (emotion percentages)       │
│       neutral: 45.2,                                    │
│       confident: 35.1,                                  │
│       focused: 19.7                                     │
│     }                                                    │
│   },                                                     │
│   tone_confidence: {                                     │
│     tone: Number,            (0-10 or 0-100)           │
│     confidence: Number,      (0-10 or 0-100)           │
│     speech_rate: Number      (0-10 or 0-100)           │
│   },                                                     │
│   full_transcript: String,                               │
│   strengths: [String],  (5+ strength points)            │
│   improvements: [String],  (5+ improvement points)      │
│   suggestions: String   (actionable recommendations)    │
│ },                                                       │
│ score: Number,  (overall interview score)               │
│ createdAt: Date,  (ISO timestamp)                      │
│ updatedAt: Date   (ISO timestamp)                      │
└──────────────────────────────────────────────────────────┘
```

---

## Performance Metrics Target

```
┌─────────────────────────────────────────────┐
│          Performance Benchmarks              │
├─────────────────────────────────────────────┤
│ Interview submission:       < 100ms         │
│ Python analysis:            3-15 seconds    │
│ Database save:              < 500ms         │
│ Feedback retrieval:         < 500ms         │
│ Dashboard load time:        < 1 second      │
│ Total interview to display: 4-20 seconds    │
├─────────────────────────────────────────────┤
│ Factors affecting Python duration:          │
│ • Video file size (MB)                      │
│ • Interview duration (seconds)              │
│ • Python dependencies available             │
│ • System CPU performance                    │
│ • RAM available for processing              │
└─────────────────────────────────────────────┘
```

---

## Deployment Architecture

```
┌────────────────────────────────────────────┐
│          PRODUCTION DEPLOYMENT              │
├────────────────────────────────────────────┤
│                                            │
│  ┌────────────────────────────────────┐   │
│  │     Frontend (Vite Build)          │   │
│  │  • dist/ folder (static files)    │   │
│  │  • Hosted on CDN or web server    │   │
│  │  • Port: 80 / 443 (domain)        │   │
│  └────────────────────────────────────┘   │
│           │                                │
│           │ HTTPS Requests                │
│           ▼                                │
│  ┌────────────────────────────────────┐   │
│  │     Backend (Node.js)              │   │
│  │  • API server on port 5011         │   │
│  │  • Docker container (optional)     │   │
│  │  • Load balanced (optional)        │   │
│  └────────────────────────────────────┘   │
│           │                                │
│           │ Database Queries               │
│           ▼                                │
│  ┌────────────────────────────────────┐   │
│  │     MongoDB Atlas (Cloud)          │   │
│  │  • Managed MongoDB service         │   │
│  │  • Auto backups                    │   │
│  │  • Connection pooling              │   │
│  └────────────────────────────────────┘   │
│                                            │
│   Python Analysis (async):                 │
│  • Queue system (Bull/RabbitMQ)           │
│  • Worker processes (Python)              │
│  • Results cache (Redis)                  │
└────────────────────────────────────────────┘
```

---

**This architecture enables:**
✅ Seamless user experience from interview to feedback
✅ Real AI-powered analysis with graceful fallbacks
✅ Data persistence for historical tracking
✅ Scalable processing with async operations
✅ Professional UI with modern visualizations

**Ready to deploy!** 🚀
