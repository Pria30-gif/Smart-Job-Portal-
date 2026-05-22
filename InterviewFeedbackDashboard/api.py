from flask import Flask, request, jsonify
import json as json_lib
import subprocess
import os
import time

app = Flask(__name__)

feedback_data = {
    "test_user_123": [
        {
            "created_at": "2024-12-19 10:30:00",
            "domain": "Software Engineering",
            "questions": [
                "Tell me about yourself",
                "What are your strengths?",
                "Where do you see yourself in 5 years?"
            ],
            "transcripts": [
                "Hello, my name is Priya Bugade. I am a software engineer with 3 years of experience.",
                "My strengths include problem-solving, teamwork, and continuous learning.",
                "In 5 years, I see myself as a senior developer leading projects."
            ],
            "analysis": {
                "semantic_analysis": {
                    "relevance": [8.5, 7.2, 9.1],
                    "clarity": [8.8, 7.9, 8.5]
                },
                "body_language": {
                    "eye_contact": 8.2,
                    "posture": 7.5,
                    "face_presence": 85.0
                },
                "tone_confidence": {
                    "tone": [7.8, 8.1, 7.9],
                    "confidence": [8.5, 8.2, 8.7],
                    "speech_rate": [7.5, 8.0, 7.8]
                },
                "face_analysis": {
                    "faces_detected": True,
                    "face_presence_pct": 85.0,
                    "blink_count": 12,
                    "blink_rate_per_min": 8.5,
                    "long_eye_closure_events": 0,
                    "annotated_video": "static/annotated_videos/annotated_test.mp4"
                },
                "full_transcript": "Hello, my name is Priya Bugade. I am a software engineer with 3 years of experience. My strengths include problem-solving, teamwork, and continuous learning. In 5 years, I see myself as a senior developer leading projects.",
                "audio_analysis": {
                    "transcript": "Hello, my name is Priya Bugade. I am a software engineer with 3 years of experience. My strengths include problem-solving, teamwork, and continuous learning. In 5 years, I see myself as a senior developer leading projects."
                }
            }
        },
        {
            "created_at": "2024-01-16 14:20:00",
            "domain": "Data Science",
            "questions": [
                "Explain machine learning",
                "What is your experience with Python?",
                "How do you handle missing data?"
            ],
            "transcripts": [
                "Machine learning is a subset of AI that enables systems to learn from data.",
                "I have extensive experience with Python, using libraries like pandas, numpy, and scikit-learn.",
                "For missing data, I typically use imputation techniques or remove incomplete records depending on the context."
            ],
            "analysis": {
                "semantic_analysis": {
                    "relevance": [9.2, 8.7, 8.9],
                    "clarity": [9.1, 8.8, 9.0]
                },
                "body_language": {
                    "eye_contact": 8.8,
                    "posture": 8.2,
                    "face_presence": 92.0
                },
                "tone_confidence": {
                    "tone": [8.5, 8.7, 8.9],
                    "confidence": [9.1, 8.8, 9.0],
                    "speech_rate": [8.2, 8.5, 8.1]
                },
                "face_analysis": {
                    "faces_detected": True,
                    "face_presence_pct": 92.0,
                    "blink_count": 8,
                    "blink_rate_per_min": 6.2,
                    "long_eye_closure_events": 1,
                    "annotated_video": "static/annotated_videos/annotated_test2.mp4"
                },
                "full_transcript": "Machine learning is a subset of AI that enables systems to learn from data. I have extensive experience with Python, using libraries like pandas, numpy, and scikit-learn. For missing data, I typically use imputation techniques or remove incomplete records depending on the context.",
                "audio_analysis": {
                    "transcript": "Machine learning is a subset of AI that enables systems to learn from data. I have extensive experience with Python, using libraries like pandas, numpy, and scikit-learn. For missing data, I typically use imputation techniques or remove incomplete records depending on the context."
                }
            }
        }
    ],
    "sample_user": [
        {
            "created_at": "2025",
            "domain": "Frontend Development",
            "questions": [
                "What is React?",
                "Explain state management",
                "How do you optimize React apps?"
            ],
            "transcripts": [
                "React is a JavaScript library for building user interfaces.",
                "State management can be done using useState hook or Redux for complex apps.",
                "Optimization involves code splitting, lazy loading, and memoization."
            ],
            "analysis": {
                "semantic_analysis": {
                    "relevance": [9.5, 8.9, 9.2],
                    "clarity": [9.3, 8.7, 9.1]
                },
                "body_language": {
                    "eye_contact": 9.1,
                    "posture": 8.8,
                    "face_presence": 95.0
                },
                "tone_confidence": {
                    "tone": [9.0, 8.9, 9.2],
                    "confidence": [9.3, 9.0, 9.1],
                    "speech_rate": [8.8, 9.1, 8.9]
                },
                "face_analysis": {
                    "faces_detected": True,
                    "face_presence_pct": 95.0,
                    "blink_count": 6,
                    "blink_rate_per_min": 4.8,
                    "long_eye_closure_events": 0,
                    "annotated_video": "static/annotated_videos/annotated_sample.mp4"
                },
                "full_transcript": "React is a JavaScript library for building user interfaces. State management can be done using useState hook or Redux for complex apps. Optimization involves code splitting, lazy loading, and memoization.",
                "audio_analysis": {
                    "transcript": "React is a JavaScript library for building user interfaces. State management can be done using useState hook or Redux for complex apps. Optimization involves code splitting, lazy loading, and memoization."
                }
            }
        }
    ]
}

@app.route('/api/mock-interview-feedback/upload', methods=['POST'])
def upload_feedback():
    try:
        file = request.files['file']
        user_id = request.form['userId']
        domain = request.form['domain']
        questions = json_lib.loads(request.form['questions'])
        transcripts = json_lib.loads(request.form['transcripts'])

        # Save file temporarily
        file_path = f"temp_{user_id}.webm"
        file.save(file_path)

        # Analyze video using the Python script
        # Prepare data for Python script
        temp_data = {
            "userId": user_id,
            "domain": domain,
            "questions": questions,
            "transcripts": transcripts,
            "videoPath": file_path
        }

        # Write to temp file
        temp_file = "temp_data.json"
        with open(temp_file, "w") as f:
            json_lib.dump(temp_data, f)

        # Call Python analysis script
        result = subprocess.run(['python', '../analyze_interview.py', temp_file],
                                capture_output=True, text=True, cwd='.')

        if result.returncode == 0:
            analysis_result = json_lib.loads(result.stdout)
        else:
            analysis_result = {
                "error": "Analysis failed",
                "details": result.stderr
            }

        # Clean up temp file
        if os.path.exists(temp_file):
            os.remove(temp_file)
        if os.path.exists(file_path):
            os.remove(file_path)

        # Store feedback
        if user_id not in feedback_data:
            feedback_data[user_id] = []
        feedback_data[user_id].append({
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "domain": domain,
            "questions": questions,
            "transcripts": transcripts,
            "analysis": analysis_result
        })

        return jsonify({"success": True, "feedback": analysis_result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/mock-interview-feedback/<user_id>', methods=['GET'])
def get_feedback(user_id):
    if user_id in feedback_data:
        return jsonify({"feedback": feedback_data[user_id][-1]["analysis"]})
    else:
        return jsonify({"feedback": None}), 404

@app.route('/api/mock-interview-feedback/all/<user_id>', methods=['GET'])
def get_all_feedback(user_id):
    if user_id in feedback_data:
        return jsonify({"feedback": feedback_data[user_id]})
    else:
        return jsonify({"feedback": []}), 404

if __name__ == '__main__':
    app.run(port=5011, debug=True)
