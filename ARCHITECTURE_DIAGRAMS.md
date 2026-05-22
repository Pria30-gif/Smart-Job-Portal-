# 🎬 Real Analysis - Visual Architecture & Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              React App (Frontend)                        │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │       MockInterviewPrep Component                  │ │ │
│  │  │                                                     │ │ │
│  │  │  ✓ Records video (MediaRecorder)                  │ │ │
│  │  │  ✓ Captures audio (Web Speech API)                │ │ │
│  │  │  ✓ Collects answers (user input)                 │ │ │
│  │  │  ✓ Sends to backend (NEW!)                       │ │ │
│  │  │  ✓ Displays feedback (real, not hardcoded)       │ │ │
│  │  │                                                     │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                ┌──────────┴──────────┐
                │ HTTP POST (FormData)│
                │  - video blob      │
                │  - transcripts     │
                │  - questions       │
                │  - metadata        │
                │ Port 5011          │
                └──────────┬──────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                    BACKEND SERVER                               │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │        Flask API (interview_feedback_backend.py)         │ │
│  │  ┌──────────────────────────────────────────────────────┐│ │
│  │  │  /api/mock-interview-feedback/upload (POST)         ││ │
│  │  │  Receives video + transcripts + metadata            ││ │
│  │  └──────────────────────────────────────────────────────┘│ │
│  │                        │                                  │ │
│  │    ┌───────────────────┼────────────────────┐            │ │
│  │    │                   │                    │            │ │
│  │    ▼                   ▼                    ▼            │ │
│  │ ┌─────────┐        ┌──────────┐       ┌──────────┐    │ │
│  │ │ camera_ │        │ analyze_ │       │ Whisper  │    │ │
│  │ │analysis │        │interview │       │ Model    │    │ │
│  │ │.py      │        │.py       │       │(speech)  │    │ │
│  │ │         │        │          │       │          │    │ │
│  │ │ Input:  │        │ Input:   │       │ Input:   │    │ │
│  │ │ Video   │        │ Text +   │       │ Audio    │    │ │
│  │ │ frames  │        │ Domain   │       │ stream   │    │ │
│  │ │         │        │          │       │          │    │ │
│  │ │ Process │        │ Process: │       │ Output:  │    │ │
│  │ │ Output: │        │ - Keyword│       │ - Trans- │    │ │
│  │ │ - Eye   │        │   match  │       │   cription   │ │
│  │ │   contact        │ - Relevance    │ - Tone   │    │ │
│  │ │ - Posture        │ - Clarity      │ - Speech │    │ │
│  │ │ - Face pres.     │ - Keywords     │   rate   │    │ │
│  │ └─────────┘        └──────────┘       └──────────┘    │ │
│  │    │                   │                    │            │ │
│  │    └───────────────────┼────────────────────┘            │ │
│  │                        │                                  │ │
│  │  ┌──────────────────────────────────────────────────────┐│ │
│  │  │  Optional: DeepFace (emotion detection)             ││ │
│  │  │  Optional: Ollama (AI feedback generation)          ││ │
│  │  └──────────────────────────────────────────────────────┘│ │
│  │                        │                                  │ │
│  │  ┌──────────────────────────────────────────────────────┐│ │
│  │  │  Calculate Overall Score (weighted)                 ││ │
│  │  │  - Body Language: 25%                               ││ │
│  │  │  - Semantic: 35%                                    ││ │
│  │  │  - Tone: 40%                                        ││ │
│  │  │  Result: 0-100                                      ││ │
│  │  └──────────────────────────────────────────────────────┘│ │
│  │                        │                                  │ │
│  │  ┌──────────────────────────────────────────────────────┐│ │
│  │  │  Return JSON Response with:                         ││ │
│  │  │  - overall_score (0-100)                            ││ │
│  │  │  - body_language metrics                            ││ │
│  │  │  - semantic_analysis scores                         ││ │
│  │  │  - tone_confidence metrics                          ││ │
│  │  │  - ai_feedback (personalized)                       ││ │
│  │  │  - detected_emotions                                ││ │
│  │  └──────────────────────────────────────────────────────┘│ │
│  └────────────────────────┬───────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                           │
                ┌──────────┴──────────┐
                │ HTTP Response (JSON)│
                │ Analysis results   │
                └──────────┬──────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│                    BROWSER (Frontend)                           │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │         Feedback Display Component                       │ │
│  │                                                           │ │
│  │  📊 Your Score: 78/100                                  │ │
│  │                                                           │ │
│  │  👁️  Body Language:                                     │ │
│  │     • Eye Contact: 7.5/10                               │ │
│  │     • Posture: 8.0/10                                   │ │
│  │     • Face Presence: 95%                                │ │
│  │     • Emotions: Neutral 40%, Confident 35%              │ │
│  │                                                           │ │
│  │  📝 Semantic Analysis:                                  │ │
│  │     • Relevance: 8.0/10                                 │ │
│  │     • Clarity: 7.5/10                                   │ │
│  │                                                           │ │
│  │  🗣️  Tone & Confidence:                                │ │
│  │     • Tone: 8.0/10                                      │ │
│  │     • Confidence: 7.5/10                                │ │
│  │     • Speech Rate: 7.0/10                               │ │
│  │                                                           │ │
│  │  🤖 AI Feedback:                                        │ │
│  │     "Your answer was well-structured. Consider          │ │
│  │      providing more examples..."                         │ │
│  │                                                           │ │
│  │  📚 Your Answers:                                       │ │
│  │     Q: What is a hook?                                  │ │
│  │     A: "React hooks are functions that..."              │ │
│  │     Score: 9/10 ✓                                       │ │
│  │     Expected keywords: useState, useEffect, ...         │ │
│  │                                                           │ │
│  └───────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

---

## Interview Submission Flow

```
┌────────────────────────────────────────────────────────────────┐
│  User Clicks "End Interview"                                   │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│  stopInterview() Function Executes                             │
│  ✓ Stop speech recognition                                    │
│  ✓ Collect all transcripts                                    │
│  ✓ Calculate keyword-based score                              │
│  ✓ Stop camera & microphone                                   │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│  MediaRecorder.stop() Triggered                                │
│  ✓ Stop recording                                             │
│  ✓ Collect video chunks from buffer                           │
│  ✓ Wait 100ms for completion                                  │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│  Create FormData Package                                       │
│  ├─ file: WebM video blob                                     │
│  ├─ userId: "test_user_001"                                   │
│  ├─ domain: "Frontend"                                        │
│  ├─ questions: ["Q1", "Q2", ...]                              │
│  └─ transcripts: ["A1", "A2", ...]                            │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────────┐
│  Send POST Request                                             │
│  URL: http://localhost:5011/api/.../upload                    │
│  Body: FormData (multipart/form-data)                          │
│  Status: Set analyzing = true                                  │
└────────────────────────┬─────────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
┌──────────────────┐           ┌──────────────────┐
│  Success Path    │           │  Error Path      │
│  response.ok     │           │  Catch error /   │
│                  │           │  !response.ok    │
└────────┬─────────┘           └────────┬─────────┘
         │                              │
         ▼                              ▼
┌────────────────────────┐    ┌─────────────────────┐
│ Parse JSON response    │    │ Log error to console│
│ Extract analysis data  │    │ Continue anyway     │
│ setAiFeedback(data)    │    │ (graceful degrade)  │
└────────┬───────────────┘    └────────┬────────────┘
         │                             │
         └─────────────────┬───────────┘
                           │
                           ▼
                    ┌──────────────────┐
                    │ setAnalyzing(false)
                    │ setInterviewComplete(true)
                    └──────────┬───────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Feedback Page Renders│
                    │ aiFeedback state set │
                    │ Shows real metrics   │
                    └──────────────────────┘
```

---

## Data Transformation Pipeline

```
INPUT: Raw Interview Data
├─ Video frames (30fps × duration)
├─ Audio stream (mono/stereo)
├─ Transcribed text (real-time)
├─ Questions array
├─ User metadata

PROCESSING STAGE 1: Video Analysis
├─ Extract frames from video
├─ Run MediaPipe on each frame
│  └─ Face detection
│  └─ Landmarks (iris, head pose)
│  └─ Calculate eye aspect ratio
│  └─ Estimate gaze direction
├─ Calculate eye contact percentage
├─ Analyze posture metrics
└─ Output: video_metrics = {...eye_contact, posture, ...}

PROCESSING STAGE 2: Emotion Detection
├─ Run DeepFace on video frames
├─ Detect emotions per frame
│  ├─ angry
│  ├─ disgust
│  ├─ fear
│  ├─ happy
│  ├─ neutral
│  ├─ sad
│  └─ surprise
├─ Aggregate emotions over time
└─ Output: emotions = {neutral: 40%, confident: 35%, ...}

PROCESSING STAGE 3: Speech Analysis
├─ Use Whisper to transcribe audio
├─ Analyze tone/prosody
├─ Measure speech rate
├─ Detect confidence level
├─ Calculate clarity score
└─ Output: speech_metrics = {tone, confidence, speech_rate, ...}

PROCESSING STAGE 4: Semantic Analysis
├─ Extract keywords from transcripts
├─ Compare against expected keywords for domain
├─ Calculate keyword match percentage
├─ Analyze sentence structure
├─ Evaluate answer relevance
├─ Check coverage of topic
└─ Output: semantic_score = {relevance, clarity, keyword_matches}

PROCESSING STAGE 5: AI Feedback
├─ Prepare prompt with:
│  ├─ All metrics collected
│  ├─ Transcript text
│  ├─ Domain context
│  └─ Expected competencies
├─ Send to Ollama/LLM
├─ Generate personalized feedback
└─ Output: ai_feedback = "Your answer was..."

SCORING STAGE: Calculate Overall Score
├─ Weight components:
│  ├─ Body Language (eye_contact, posture): 25%
│  ├─ Semantic (relevance, clarity): 35%
│  └─ Tone (confidence, speech_rate): 40%
├─ Normalize each to 0-10 scale
├─ Multiply by weights
├─ Sum: overall_score = 0-100
└─ Output: overall_score = 78

OUTPUT: Complete Analysis JSON
{
  overall_score: 78,
  body_language: {...},
  semantic_analysis: {...},
  tone_confidence: {...},
  detected_emotions: {...},
  ai_feedback: "...",
  timestamp: "2024-01-15T10:30:00Z"
}
```

---

## State Management Flow

```
START: Form Submission
       └─► userDetails = {name, email, domain, userId}
           selectedDomain = "Frontend"

RECORDING: Interview Started
       └─► interviewStarted = true
           stream = MediaStream
           mediaRecorder = recording

DURING: Answering Questions
       ├─► currentTranscript = "user's speech"
       ├─► transcripts = ["answer1", "answer2", ...]
       └─► currentQuestionIndex = 0,1,2,...

END: User Clicks "End Interview"
       ├─► setAnalyzing(true)
       ├─► setFinalScore(calculated)
       ├─► setQuestionScores([])
       ├─► submit to backend (FormData)
       │   (wait for response)
       ├─► setAiFeedback(response.analysis)
       ├─► setAnalyzing(false)
       └─► setInterviewComplete(true)

DISPLAY: Feedback Page Rendered
       ├─► Show finalScore (from calculation)
       ├─► Show aiFeedback.body_language
       ├─► Show aiFeedback.semantic_analysis
       ├─► Show aiFeedback.tone_confidence
       └─► Show aiFeedback.ai_feedback
```

---

## Component Interaction

```
┌──────────────────────────────────────────────────────┐
│         MockInterviewPrep Component                  │
│                                                      │
│  ┌─────────────────────────────────────────────────┐│
│  │  State Management (React Hooks)                 ││
│  │                                                 ││
│  │  ✓ interviewStarted                            ││
│  │  ✓ stream                                       ││
│  │  ✓ selectedDomain                              ││
│  │  ✓ activeQuestions                             ││
│  │  ✓ finalScore                                  ││
│  │  ✓ transcripts                                 ││
│  │  ✓ aiFeedback (← Backend response)             ││
│  │  ✓ analyzing (← Shows loading state)           ││
│  │  ✓ userDetails                                 ││
│  │                                                 ││
│  └─────────────────────────────────────────────────┘│
│                        │                             │
│  ┌──────────────────────┴──────────────────────────┐│
│  │  Render Logic                                   ││
│  │                                                 ││
│  │  IF showUserForm                               ││
│  │    └─ Render user details form                 ││
│  │                                                 ││
│  │  ELSE IF interviewStarted                      ││
│  │    └─ Render recording interface               ││
│  │       ├─ Video feed (camera)                   ││
│  │       ├─ Question display                      ││
│  │       ├─ Transcript display                    ││
│  │       └─ Control buttons                       ││
│  │                                                 ││
│  │  ELSE IF interviewComplete                     ││
│  │    └─ Render feedback interface                ││
│  │       ├─ Score display                         ││
│  │       ├─ Body language metrics                 ││
│  │       ├─ AI feedback section                   ││
│  │       └─ Answer review section                 ││
│  │                                                 ││
│  └─────────────────────────────────────────────────┘│
│                                                      │
│  ┌─────────────────────────────────────────────────┐│
│  │  Event Handlers                                 ││
│  │                                                 ││
│  │  ✓ startInterview() → start recording          ││
│  │  ✓ stopInterview() → submit to backend (NEW!)  ││
│  │  ✓ handleNextQuestion() → next Q              ││
│  │  ✓ recognitionRef → speech-to-text            ││
│  │  ✓ mediaRecorderRef → video recording         ││
│  │                                                 ││
│  └─────────────────────────────────────────────────┘│
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Data Size Estimates

```
Interview Recording (5 minutes)

Audio Stream:
  Mono, 16kHz, 16-bit = 5 min × 60s × 16,000 Hz × 2 bytes
  = 9.6 MB

Video Stream (when available):
  1280×720, 30fps, WebM codec
  Bitrate: ~1.5 Mbps (depends on quality settings)
  = 5 min × 60s × (1.5 Mbit/s ÷ 8)
  = 56 MB

Total per interview:
  ~60-70 MB WebM video file

Network bandwidth:
  Upload time at 10 Mbps: ~7 seconds
  Upload time at 5 Mbps: ~14 seconds
  Upload time at 1 Mbps: ~70 seconds

Storage (backend):
  Per interview: ~60 MB
  For 100 users × 50 interviews: ~300 GB
```

---

## Error Handling Flowchart

```
POST to Backend
       │
       ├─ Connection Error
       │  └─► try/catch catches
       │      └─► Log error
       │          └─► Still show interview complete
       │
       ├─ Network Timeout
       │  └─► Wait indefinitely or set timeout
       │      └─► Show "Still analyzing..."
       │
       ├─ Backend Error (500)
       │  └─► response.ok = false
       │      └─► Check response.status
       │          └─► Log error, continue anyway
       │
       ├─ Parse Error (invalid JSON)
       │  └─► response.json() throws
       │      └─► try/catch catches
       │          └─► Log error
       │
       ├─ No video blob
       │  └─► Blob() may be empty
       │      └─► Backend returns 400
       │          └─► User gets generic error
       │
       └─ Success (200)
          └─► response.ok = true
              └─► Parse JSON
                  └─► Extract analysis
                      └─► setAiFeedback(data)
                          └─► Display feedback
```

---

These diagrams show:
- **System Architecture**: How frontend, backend, and services connect
- **Submission Flow**: What happens when you end an interview
- **Data Pipeline**: How video/audio becomes analysis scores
- **State Management**: React component state flow
- **Interactions**: Component communication
- **Performance**: Data size and network estimates
- **Error Handling**: What happens if something fails

Use these to understand the complete system!
