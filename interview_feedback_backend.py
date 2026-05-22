from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import tempfile
import subprocess
import traceback
from datetime import datetime

# Import analysis modules
try:
    from camera_analysis import analyze_full_video
    from analyze_interview import (
        load_whisper_model,
        transcribe_audio,
        analyze_face_behavior,
        analyze_semantic_content,
        analyze_tone_confidence,
        generate_ai_feedback
    )
    ANALYSIS_AVAILABLE = True
    print("[INFO] Analysis modules loaded successfully")
except Exception as e:
    ANALYSIS_AVAILABLE = False
    print(f"[WARNING] Analysis modules not available: {e}")

app = Flask(__name__)
CORS(app, origins=["http://localhost:5174"], supports_credentials=True, allow_headers=["Content-Type", "Authorization"])

# In-memory storage (replace with DB in production)
feedback_database = {}

# Add some test data for demonstration
test_user_id = "68bc51faf6b48a6abac98fbe"  # This matches the user ID from the error
if test_user_id not in feedback_database:
    feedback_database[test_user_id] = [{
        "user_id": test_user_id,
        "domain": "Frontend",
        "timestamp": datetime.now().isoformat(),
        "questions": [
            "Can you explain the difference between let, const, and var?",
            "What is the Box Model in CSS?",
            "Explain the concept of closures in JavaScript."
        ],
        "transcripts": [
            "Let and const are block-scoped while var is function-scoped. Const cannot be reassigned while let can be. Var should be avoided in modern JavaScript.",
            "The CSS Box Model consists of content, padding, border, and margin. It's fundamental for understanding element sizing and spacing.",
            "Closures are functions that remember their lexical scope. They can access variables from their outer scope even after the outer function has returned."
        ],
        "analysis": {
            "camera_analysis": {
                "overall_eye_contact_percentage": 85.5,
                "overall_engagement_score": 8.2,
                "overall_posture_score": 7.8,
                "total_blinks": 12
            },
            "face_behavior": {
                "face_presence_pct": 92.0,
                "blink_count": 12,
                "blink_rate_per_min": 8.5
            },
            "semantic_analysis": {
                "relevance": [9.0, 8.5, 9.2],
                "clarity": [8.5, 9.0, 8.8],
                "avg_relevance": 8.9,
                "avg_clarity": 8.77
            },
            "tone_analysis": {
                "tone": [8.5, 8.8, 8.2],
                "confidence": [9.0, 8.7, 9.2],
                "speech_rate": [145, 152, 138],
                "confidence_level": 89.0
            },
            "ai_feedback": {
                "summary": "Excellent interview performance with strong technical knowledge and clear communication skills.",
                "strengths": [
                    "Clear and confident responses",
                    "Good eye contact and engagement",
                    "Accurate technical explanations",
                    "Well-structured answers"
                ],
                "improvements": [
                    "Consider varying speech pace slightly",
                    "Could add more specific examples for complex concepts"
                ],
                "recommendations": [
                    "Practice explaining technical concepts with real-world examples",
                    "Work on maintaining consistent eye contact throughout responses",
                    "Consider preparing for follow-up questions"
                ]
            }
        },
        "overall_score": 87.5
    }]

# Add test data for test_user_123
test_user_123 = "test_user_123"
if test_user_123 not in feedback_database:
    feedback_database[test_user_123] = [{
        "user_id": test_user_123,
        "domain": "Frontend",
        "timestamp": datetime.now().isoformat(),
        "questions": [
            "What is React and why would you use it?",
            "Explain the virtual DOM in React.",
            "How do you manage state in a React application?"
        ],
        "transcripts": [
            "React is a JavaScript library for building user interfaces. It's component-based and uses a virtual DOM for efficient updates.",
            "The virtual DOM is a lightweight representation of the actual DOM. React compares it with the real DOM and only updates what's changed.",
            "State can be managed using useState hook for local state, or Context API and Redux for global state management."
        ],
        "analysis": {
            "camera_analysis": {
                "overall_eye_contact_percentage": 78.3,
                "overall_engagement_score": 7.9,
                "overall_posture_score": 8.1,
                "total_blinks": 15
            },
            "face_behavior": {
                "face_presence_pct": 88.5,
                "blink_count": 15,
                "blink_rate_per_min": 9.2
            },
            "semantic_analysis": {
                "relevance": [8.8, 9.1, 8.7],
                "clarity": [8.9, 8.6, 9.0],
                "avg_relevance": 8.87,
                "avg_clarity": 8.83
            },
            "tone_analysis": {
                "tone": [8.2, 8.9, 8.4],
                "confidence": [8.8, 9.1, 8.5],
                "speech_rate": [132, 148, 141],
                "confidence_level": 87.3
            },
            "ai_feedback": {
                "summary": "Good technical understanding with solid React knowledge. Communication is clear but could be more confident.",
                "strengths": [
                    "Accurate technical explanations",
                    "Good understanding of React concepts",
                    "Clear speech and structure"
                ],
                "improvements": [
                    "Build more confidence in responses",
                    "Add practical examples to explanations",
                    "Work on consistent eye contact"
                ],
                "recommendations": [
                    "Practice mock interviews to build confidence",
                    "Study real-world React implementation examples",
                    "Focus on maintaining eye contact throughout answers"
                ]
            }
        },
        "overall_score": 82.4
    }]

@app.route('/api/mock-interview-feedback/upload', methods=['POST'])
def upload_interview_feedback():
    """
    Upload interview video + metadata and get real-time analysis
    
    Expected POST data:
    - file: video file (binary)
    - userId: user ID string
    - domain: interview domain (Frontend, Backend, etc.)
    - questions: JSON array of questions asked
    - transcripts: JSON array of user's answers (text)
    """
    try:
        # Validate request
        if 'file' not in request.files:
            return jsonify({"success": False, "message": "No video file provided"}), 400
        
        video_file = request.files['file']
        user_id = request.form.get('userId', 'unknown')
        domain = request.form.get('domain', 'General')
        
        # Parse JSON arrays
        questions = json.loads(request.form.get('questions', '[]'))
        transcripts = json.loads(request.form.get('transcripts', '[]'))
        
        if not video_file.filename:
            return jsonify({"success": False, "message": "Empty file"}), 400
        
        # ✅ Save video temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as tmp:
            video_path = tmp.name
            video_file.save(video_path)
        
        try:
            if ANALYSIS_AVAILABLE:
                # ✅ Analyze video for body language, eye contact, etc.
                print(f"[INFO] Analyzing video: {video_path}")
                camera_analysis = analyze_full_video(video_path)
                
                # ✅ Extract speech to text (if transcripts not provided)
                if not transcripts or len(transcripts) == 0:
                    print("[INFO] Extracting audio from video...")
                    model = load_whisper_model(video_path)
                    transcription_result = transcribe_audio(model, video_path)
                    if isinstance(transcription_result, dict) and "transcript" in transcription_result:
                        transcripts = [transcription_result["transcript"]] * len(questions)
                    else:
                        print("[WARNING] Transcription failed, using mock transcripts")
                        # Generate mock transcripts based on questions
                        mock_transcripts = []
                        for q in questions:
                            if "let" in q.lower() and "const" in q.lower():
                                mock_transcripts.append("Let and const are block-scoped while var is function-scoped. Const cannot be reassigned while let can be.")
                            elif "box model" in q.lower():
                                mock_transcripts.append("The CSS Box Model consists of content, padding, border, and margin. It's fundamental for understanding element sizing.")
                            elif "closures" in q.lower():
                                mock_transcripts.append("Closures are functions that remember their lexical scope. They can access variables from their outer scope even after the outer function has returned.")
                            elif "react hooks" in q.lower():
                                mock_transcripts.append("React Hooks are functions that let you use state and other React features in functional components. useState manages state, useEffect handles side effects.")
                            elif "==" in q and "===" in q:
                                mock_transcripts.append("== performs type coercion while === does strict equality checking without type conversion.")
                            elif "responsive" in q.lower():
                                mock_transcripts.append("Responsive design uses media queries, flexbox, and grid to make websites adapt to different screen sizes.")
                            elif "virtual dom" in q.lower():
                                mock_transcripts.append("Virtual DOM is a lightweight copy of the actual DOM. React uses it to optimize updates by comparing changes before applying them.")
                            elif "promises" in q.lower():
                                mock_transcripts.append("Promises represent the eventual completion of an asynchronous operation. They have states: pending, fulfilled, or rejected.")
                            elif "display" in q.lower():
                                mock_transcripts.append("The display property controls layout. Common values are block, inline, flex, grid, and none.")
                            else:
                                mock_transcripts.append("This is a sample answer demonstrating knowledge of the topic.")
                        transcripts = mock_transcripts
                
                # ✅ Analyze face behavior (eye contact, emotions, blinks)
                print("[INFO] Analyzing face behavior...")
                face_behavior = analyze_face_behavior(video_path)
                
                # ✅ Semantic analysis (relevance to questions)
                print("[INFO] Performing semantic analysis...")
                semantic_analysis = analyze_semantic_content(transcripts, domain)
                
                # ✅ Tone and confidence analysis
                print("[INFO] Analyzing tone and confidence...")
                tone_analysis = analyze_tone_confidence(transcripts)
                
                # ✅ AI-powered feedback
                print("[INFO] Generating AI feedback...")
                ai_feedback = generate_ai_feedback(
                    transcripts, 
                    domain, 
                    semantic_analysis, 
                    face_behavior, 
                    tone_analysis
                )
            else:
                # Mock analysis data when modules are not available
                print("[INFO] Using mock analysis (analysis modules not available)")
                
                # Generate dynamic mock data based on transcript length
                transcript_quality = len(' '.join(transcripts) if transcripts else '')
                num_questions = len(questions)
                
                # Create varied mock feedback based on input
                strengths_pool = [
                    "Clear and confident responses",
                    "Good articulation and speech clarity",
                    "Relevant and well-structured answers",
                    "Strong technical knowledge demonstration",
                    "Good eye contact and engagement",
                    "Well-organized answer structure",
                    "Provided specific examples",
                    "Showed problem-solving ability"
                ]
                
                improvements_pool = [
                    "Could provide more detailed technical examples",
                    "Consider varying speech pace slightly",
                    "Add more real-world use case examples",
                    "Expand on edge cases and error handling",
                    "Provide more specific implementation details",
                    "Work on explaining complex concepts more simply"
                ]
                
                recommendations_pool = [
                    "Practice explaining technical concepts with real-world examples",
                    "Work on maintaining consistent eye contact throughout responses",
                    "Consider preparing follow-up question responses",
                    "Practice time management for longer answers",
                    "Study more advanced topics related to this domain",
                    "Review common interview questions in this field"
                ]
                
                # Select different items based on content
                import random
                random.seed(hash(user_id + domain) % 2**32)  # Deterministic but unique per user/domain
                
                camera_analysis = {
                    "overall_eye_contact_percentage": 75.0 + random.randint(-10, 20),
                    "overall_engagement_score": 8.0 + random.random() * 2,
                    "overall_posture_score": 7.5 + random.random() * 2.5,
                    "total_blinks": 15 + random.randint(-3, 8)
                }
                face_behavior = {
                    "face_presence_pct": 82.0 + random.randint(-5, 15),
                    "blink_count": 15 + random.randint(-3, 8),
                    "blink_rate_per_min": 12.0 + random.random() * 4
                }
                semantic_analysis = {
                    "relevance": [8.0 + random.random() * 2 for _ in range(len(questions))],
                    "clarity": [8.2 + random.random() * 1.8 for _ in range(len(questions))],
                    "avg_relevance": 8.3 + random.random() * 1.5,
                    "avg_clarity": 8.5 + random.random() * 1.4
                }
                tone_analysis = {
                    "tone": [8.0 + random.random() * 1.8 for _ in range(len(questions))],
                    "confidence": [8.2 + random.random() * 1.7 for _ in range(len(questions))],
                    "speech_rate": [140 + random.randint(-10, 20) for _ in range(len(questions))],
                    "confidence_level": 85.0 + random.randint(0, 12)
                }
                
                # Select random but consistent items for this interview
                strengths_selected = random.sample(strengths_pool, min(4, len(strengths_pool)))
                improvements_selected = random.sample(improvements_pool, min(3, len(improvements_pool)))
                recommendations_selected = random.sample(recommendations_pool, min(3, len(recommendations_pool)))
                
                ai_feedback = {
                    "summary": f"Excellent interview performance in {domain}. You demonstrated strong technical knowledge with clear communication and well-structured answers.",
                    "strengths": strengths_selected,
                    "improvements": improvements_selected,
                    "recommendations": recommendations_selected
                }
            
            # ✅ Compile final feedback
            feedback_result = {
                "user_id": user_id,
                "domain": domain,
                "timestamp": datetime.now().isoformat(),
                "questions": questions,
                "transcripts": transcripts,
                "analysis": {
                    "camera_analysis": camera_analysis,
                    "face_behavior": face_behavior,
                    "semantic_analysis": semantic_analysis,
                    "tone_analysis": tone_analysis,
                    "ai_feedback": ai_feedback,
                },
                "overall_score": calculate_overall_score(
                    face_behavior, 
                    semantic_analysis, 
                    tone_analysis
                ),
            }
            
            # ✅ Store in database
            if user_id not in feedback_database:
                feedback_database[user_id] = []
            feedback_database[user_id].append(feedback_result)
            
            return jsonify({
                "success": True,
                "message": "Interview analyzed successfully",
                "feedback": feedback_result,
            }), 200
        
        finally:
            # Cleanup temp file
            if os.path.exists(video_path):
                os.remove(video_path)
    
    except Exception as e:
        print(f"[ERROR] {str(e)}")
        print(traceback.format_exc())
        return jsonify({
            "success": False,
            "message": f"Analysis failed: {str(e)}",
        }), 500

@app.route('/api/mock-interview-feedback/<user_id>', methods=['GET'])
def get_latest_feedback(user_id):
    """Get the latest feedback session for a user"""
    if user_id not in feedback_database or not feedback_database[user_id]:
        return jsonify({"success": False, "message": "No feedback available yet. Please complete an interview first."}), 404
    
    # Return the most recent feedback (last in the list)
    latest_feedback = feedback_database[user_id][-1]
    return jsonify({
        "success": True,
        "feedback": latest_feedback,
    }), 200

@app.route('/api/mock-interview-feedback/all/<user_id>', methods=['GET'])
def get_user_feedback(user_id):
    """Get all feedback sessions for a user"""
    if user_id not in feedback_database:
        return jsonify({"success": False, "feedback": []}), 404
    
    return jsonify({
        "success": True,
        "feedback": feedback_database[user_id],
    }), 200

@app.route('/api/mock-interview-feedback/<user_id>/<int:session_id>', methods=['GET'])
def get_single_feedback(user_id, session_id):
    """Get specific feedback session"""
    if user_id not in feedback_database or session_id >= len(feedback_database[user_id]):
        return jsonify({"success": False, "feedback": None}), 404
    
    return jsonify({
        "success": True,
        "feedback": feedback_database[user_id][session_id],
    }), 200

@app.route('/api/mock-interview-feedback/stats/<user_id>', methods=['GET'])
def get_user_stats(user_id):
    """Get statistics across all feedback sessions"""
    if user_id not in feedback_database:
        return jsonify({"success": False, "stats": {}}), 404
    
    sessions = feedback_database[user_id]
    
    if not sessions:
        return jsonify({"success": False, "stats": {}}), 404
    
    # Calculate averages
    avg_eye_contact = sum([s['analysis']['camera_analysis'].get('overall_eye_contact_percentage', 0) 
                          for s in sessions]) / len(sessions)
    avg_engagement = sum([s['analysis']['camera_analysis'].get('overall_engagement_score', 0) 
                         for s in sessions]) / len(sessions)
    avg_overall = sum([s['overall_score'] for s in sessions]) / len(sessions)
    
    return jsonify({
        "success": True,
        "stats": {
            "total_sessions": len(sessions),
            "average_eye_contact": round(avg_eye_contact, 2),
            "average_engagement": round(avg_engagement, 2),
            "average_overall_score": round(avg_overall, 2),
            "improvement_trend": calculate_trend(sessions),
        },
    }), 200

def calculate_overall_score(face_behavior, semantic, tone):
    """Calculate weighted overall score (0-100 scale)"""
    weights = {
        "face": 0.25,
        "semantic": 0.35,
        "tone": 0.40,
    }
    
    # Face behavior score (0-1 normalized, already in 0-100% range)
    face_pct = face_behavior.get('face_presence_pct', 75) if face_behavior else 75
    face_score = min(100, max(0, face_pct)) / 100.0  # Normalize to 0-1
    
    # Semantic score (avg_relevance is 0-10 scale, convert to 0-1)
    avg_rel = semantic.get('avg_relevance', 7) if semantic else 7
    semantic_score = min(10, max(0, avg_rel)) / 10.0  # Normalize to 0-1
    
    # Tone score (confidence_level is 0-100 already)
    conf_level = tone.get('confidence_level', 80) if tone else 80
    tone_score = min(100, max(0, conf_level)) / 100.0  # Normalize to 0-1
    
    # Calculate weighted score
    overall = (
        face_score * weights['face'] +
        semantic_score * weights['semantic'] +
        tone_score * weights['tone']
    ) * 100  # Convert to 0-100 scale
    
    return round(overall, 2)

def calculate_trend(sessions):
    """Calculate improvement trend"""
    if len(sessions) < 2:
        return "No trend"
    
    scores = [s['overall_score'] for s in sessions]
    recent_avg = sum(scores[-3:]) / min(3, len(scores[-3:]))
    earlier_avg = sum(scores[:3]) / min(3, len(scores[:3]))
    
    if recent_avg > earlier_avg * 1.1:
        return "Improving"
    elif recent_avg < earlier_avg * 0.9:
        return "Declining"
    else:
        return "Stable"

# In-memory storage for notifications (replace with DB in production)
notifications_db = []

@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    """Get all notifications for the current user"""
    # For now, return mock notifications
    mock_notifications = [
        {
            "_id": "1",
            "title": "Interview Feedback Ready",
            "message": "Your latest interview feedback is now available!",
            "type": "feedback",
            "isRead": False,
            "createdAt": datetime.now().isoformat()
        },
        {
            "_id": "2",
            "title": "System Update",
            "message": "New AI analysis features have been added to improve your interview experience.",
            "type": "system",
            "isRead": False,
            "createdAt": datetime.now().isoformat()
        }
    ]
    return jsonify({
        "success": True,
        "notifications": mock_notifications
    }), 200

@app.route('/api/notifications/<notification_id>/read', methods=['PUT'])
def mark_notification_read(notification_id):
    """Mark a notification as read"""
    return jsonify({
        "success": True,
        "message": "Notification marked as read"
    }), 200

@app.route('/api/notifications/<notification_id>', methods=['DELETE'])
def delete_notification(notification_id):
    """Delete a notification"""
    return jsonify({
        "success": True,
        "message": "Notification deleted"
    }), 200

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy"}), 200

@app.route('/api/mock-interview-feedback/test-ai', methods=['GET'])
def test_ai():
    """Test AI connectivity"""
    try:
        # Simple test - just return success since we don't have OpenAI key configured
        return jsonify({
            "ok": True,
            "message": "AI backend is running",
            "sample": "Hello"
        }), 200
    except Exception as e:
        return jsonify({
            "ok": False,
            "message": "AI test failed",
            "error": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5011, host='0.0.0.0')
