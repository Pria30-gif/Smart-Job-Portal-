# 🎥 Real Analysis Feature - Setup Guide

## Overview
Real Analysis for Mock Interviews provides **comprehensive real-time feedback** using:
- ✅ **Video Analysis**: Eye contact, posture, engagement, blinks
- ✅ **Speech Analysis**: Audio transcription (Whisper), semantic relevance
- ✅ **Tone Analysis**: Confidence, clarity, speaking quality
- ✅ **AI Feedback**: Smart recommendations using Ollama/Groq
- ✅ **Emotion Detection**: Face expressions and emotional state

---

## 🛠️ Installation Steps (IN ORDER)

### Step 1: Install Ollama (For AI Feedback)
**Download & Install:**
👉 https://ollama.com/download

**After installation, open a NEW terminal and run:**
```bash
ollama run gemma:3b
```
**Keep this terminal running** - it keeps Ollama server alive

---

### Step 2: Install Python 3.10.11 (64-bit)
**Required for compatibility with all packages**
👉 https://www.python.org/downloads/

---

### Step 3: Activate Python Environment
```bash
# Navigate to project root
cd C:\Projectspriya\SMART-JOB-PORTAL

# Activate venv
venv\Scripts\activate
```

---

### Step 4: Download Spacy English Model
```bash
python -m spacy download en_core_web_sm
```

---

### Step 5: Install Real Analysis Packages
```bash
pip install -r real_analysis_requirements.txt
```

**If you encounter issues with specific packages:**
```bash
# MediaPipe
pip install mediapipe==0.8.11.1

# DeepFace (emotion detection)
pip install deepface

# Whisper (speech recognition)
pip install openai-whisper

# Sentence Transformers
pip install sentence-transformers
```

---

## 🚀 Running Real Analysis Backend

### Terminal 1: Keep Ollama Running
```bash
ollama run gemma:3b
```
⚠️ **Keep this running!** Backend AI feedback needs it

---

### Terminal 2: Start Backend Server
```bash
cd C:\Projectspriya\SMART-JOB-PORTAL

# Activate venv
venv\Scripts\activate

# Run the backend
python interview_feedback_backend.py
```

**Expected Output:**
```
 * Running on http://0.0.0.0:5011
 * Press CTRL+C to quit
```

---

### Terminal 3: Start Frontend (React)
```bash
cd C:\Projectspriya\SMART-JOB-PORTAL\Frontend

npm run dev
```

---

## 📋 Files Created/Updated

### New Backend Files
| File | Purpose |
|------|---------|
| `interview_feedback_backend.py` | Flask API for interview analysis |
| `camera_analysis.py` | Video analysis (eye contact, posture) |
| `real_analysis_requirements.txt` | Python dependencies |

### Updated Files
| File | Changes |
|------|---------|
| `analyze_interview.py` | Already exists with analysis functions |
| `MockInterviewPrep.jsx` | Frontend component (ready to use) |

---

## 🔌 API Endpoints

### 1. Upload Interview & Get Feedback
**POST** `/api/mock-interview-feedback/upload`

**Request:**
```json
{
  "file": <video_file>,
  "userId": "user_123",
  "domain": "Frontend",
  "questions": ["Question 1", "Question 2"],
  "transcripts": ["Answer 1", "Answer 2"]  // Optional
}
```

**Response:**
```json
{
  "success": true,
  "feedback": {
    "user_id": "user_123",
    "domain": "Frontend",
    "analysis": {
      "camera_analysis": {
        "overall_eye_contact_percentage": 75.5,
        "overall_engagement_score": 82.3,
        "overall_posture_score": 78.9
      },
      "face_behavior": {
        "face_presence_pct": 92.5,
        "blink_count": 45,
        "emotions": {"neutral": 60, "happy": 40}
      },
      "semantic_analysis": {
        "avg_relevance": 8.5
      },
      "ai_feedback": ["Point 1", "Point 2"]
    },
    "overall_score": 78.9
  }
}
```

---

### 2. Get All Feedback for User
**GET** `/api/mock-interview-feedback/all/<user_id>`

---

### 3. Get User Statistics
**GET** `/api/mock-interview-feedback/stats/<user_id>`

---

## ⚙️ Configuration

### Video Analysis Settings (camera_analysis.py)
```python
LEFT_EYE = [33, 160, 158, 133, 153, 144]  # MediaPipe face mesh points
RIGHT_EYE = [362, 385, 387, 263, 373, 380]

# Blink detection threshold
blink_threshold = 0.15

# Eye contact detection zone
eye_contact_x_range = (0.3, 0.7)
eye_contact_y_range = (0.2, 0.6)
```

### Scoring Weights (interview_feedback_backend.py)
```python
weights = {
    "face": 0.25,        # Face behavior
    "semantic": 0.35,    # Answer quality
    "tone": 0.40,        # Confidence/clarity
}
```

---

## ✅ Testing

### Test if Ollama is Working
```bash
python test_ollama.py
```

### Test Backend API
```bash
curl -X GET http://localhost:5011/health
```

**Expected Response:**
```json
{"status": "healthy"}
```

---

## 🔧 Troubleshooting

### Issue: "ffprobe not found"
**Solution:** Install FFmpeg
```bash
pip install ffmpeg-python
# Or download from: https://ffmpeg.org/download.html
```

### Issue: "CUDA not available" (DeepFace)
**Solution:** CPU will be used automatically (slower but works)

### Issue: "Ollama connection refused"
**Solution:** Make sure Terminal 1 with `ollama run gemma:3b` is still running

### Issue: "MediaPipe initialization failed"
**Solution:**
```bash
pip uninstall mediapipe -y
pip install mediapipe==0.8.11.1
```

### Issue: "No module named 'spacy'"
**Solution:**
```bash
python -m spacy download en_core_web_sm
```

---

## 📊 Understanding Scores

### Overall Score (0-100)
- **80-100**: Excellent performance
- **60-79**: Good, room for improvement
- **40-59**: Needs practice
- **0-39**: Significant improvement needed

### Eye Contact (%)
- **80%+**: Excellent engagement
- **60-79%**: Good eye contact
- **40-59%**: Acceptable
- **<40%**: Needs improvement

### Engagement Score
Measures posture, head position, and body language

### Sentiment/Emotion
Detected emotions: Happy, Neutral, Sad, Angry, Surprised, Disgusted

---

## 🚀 Production Deployment

For production, replace:
```python
feedback_database = {}  # ❌ In-memory (data lost on restart)
```

With:
```python
# MongoDB example
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['interview_db']
feedback_collection = db['feedbacks']
```

---

## 📞 Support

For issues:
1. Check troubleshooting section
2. Ensure all 3 terminals are running
3. Check Ollama is still running
4. Verify Python 3.10.11 is installed
5. Try reinstalling packages: `pip install -r real_analysis_requirements.txt --force-reinstall`

---

**Status**: ✅ Ready for development and testing!
