import cv2
import numpy as np
import math

def euclid(p1, p2):
    """Calculate Euclidean distance between two points"""
    return math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2)

def analyze_segment(video_path, start_sec, end_sec, fps_sample=2):
    """Analyze video segment for eye contact, posture, and engagement using basic OpenCV"""
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        return {"error": "Video not readable"}

    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    start_frame = int(start_sec * fps)
    end_frame = int(end_sec * fps)

    cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)

    frame_count = 0
    face_detected_count = 0
    engagement_scores = []
    posture_scores = []

    # Load Haar cascade for face detection
    import os
    cascade_path = os.path.join(os.path.dirname(cv2.__file__), 'data', 'haarcascade_frontalface_default.xml')
    face_cascade = cv2.CascadeClassifier(cascade_path)

    # Sample frames for analysis
    sample_interval = int(fps / fps_sample)

    try:
        while frame_count < (end_frame - start_frame):
            ret, frame = cap.read()
            if not ret:
                break

            frame_count += 1

            # Only analyze every sample_interval frames
            if frame_count % sample_interval != 0:
                continue

            # Convert to grayscale for face detection
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            # Detect faces
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)

            if len(faces) > 0:
                face_detected_count += 1

                # Get the largest face (assuming it's the main subject)
                largest_face = max(faces, key=lambda f: f[2] * f[3])
                x, y, w, h = largest_face

                # Calculate face position relative to frame
                frame_h, frame_w = frame.shape[:2]
                face_center_x = x + w/2
                face_center_y = y + h/2

                # Eye contact estimation (face centered in frame)
                center_x_ratio = face_center_x / frame_w
                center_y_ratio = face_center_y / frame_h

                # Simple eye contact score (face in center 60% of frame)
                eye_contact_score = 1.0 if (0.2 < center_x_ratio < 0.8 and 0.2 < center_y_ratio < 0.8) else 0.3

                # Engagement score based on face size (larger face = more engaged)
                face_area_ratio = (w * h) / (frame_w * frame_h)
                engagement_score = min(1.0, face_area_ratio * 10)  # Scale up but cap at 1.0

                # Posture score (face not tilted too much - simplified)
                aspect_ratio = w / h if h > 0 else 1
                posture_score = 1.0 if 0.7 < aspect_ratio < 1.4 else 0.5  # Normal face proportions

                engagement_scores.append(engagement_score)
                posture_scores.append(posture_score)

    finally:
        cap.release()

    # Calculate metrics
    total_sampled_frames = max(1, frame_count // sample_interval)
    eye_contact_percentage = (face_detected_count / total_sampled_frames) * 100 if total_sampled_frames > 0 else 0
    avg_engagement = np.mean(engagement_scores) if engagement_scores else 0.5
    avg_posture = np.mean(posture_scores) if posture_scores else 0.5

    return {
        "eye_contact_percentage": round(eye_contact_percentage, 2),
        "engagement_score": round(avg_engagement, 2),
        "posture_score": round(avg_posture, 2),
        "face_detected_frames": face_detected_count,
        "total_frames_analyzed": total_sampled_frames
    }

def analyze_full_video(video_path):
    """Analyze entire video for overall metrics"""
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        return {"error": "Video not readable"}

    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    total_seconds = total_frames / fps if fps > 0 else 0

    cap.release()

    if total_seconds == 0:
        return {"error": "Cannot determine video duration"}

    # Analyze in segments (every 5 seconds)
    segment_results = []
    segment_duration = 5
    current_sec = 0

    while current_sec < total_seconds:
        end_sec = min(current_sec + segment_duration, total_seconds)
        segment_result = analyze_segment(video_path, current_sec, end_sec)
        if "error" not in segment_result:
            segment_results.append(segment_result)
        current_sec = end_sec

    if not segment_results:
        return {"error": "No segments analyzed"}

    # Aggregate results
    overall_eye_contact = np.mean([s["eye_contact_percentage"] for s in segment_results])
    overall_engagement = np.mean([s["engagement_score"] for s in segment_results])
    overall_posture = np.mean([s["posture_score"] for s in segment_results])
    total_blinks = sum([s.get("blink_count", 0) for s in segment_results])

    return {
        "video_duration_seconds": round(total_seconds, 2),
        "overall_eye_contact_percentage": round(overall_eye_contact, 2),
        "overall_engagement_score": round(overall_engagement, 2),
        "overall_posture_score": round(overall_posture, 2),
        "total_blinks": total_blinks,
        "segments": segment_results,
    }
