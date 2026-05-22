import os
import cv2
import numpy as np
import mediapipe as mp
import json
import math
from moviepy.video.io.ffmpeg_writer import FFMPEG_VideoWriter
from datetime import timedelta

mp_face = mp.solutions.face_mesh  # type: ignore

# Eye landmark indices for MediaPipe face mesh (468 landmarks)
# left eye and right eye landmark indices around the eye (approx)
LEFT_EYE_IDX = [33, 160, 158, 133, 153, 144]   # outer, upper, lower, inner, ...
RIGHT_EYE_IDX = [263, 387, 385, 362, 380, 373]

def eye_aspect_ratio(landmarks, eye_idx, frame_w, frame_h):
    # Convert normalized mediapipe landmarks to pixel coords
    pts = [(int(landmarks[i].x * frame_w), int(landmarks[i].y * frame_h)) for i in eye_idx]
    # Using relative vertical / horizontal distances like EAR
    # vertical distance between pt1-pt5 and pt2-pt4 (approx)
    A = math.dist(pts[1], pts[5])  # top-bottom pair approx
    B = math.dist(pts[2], pts[4])  # top-bottom pair approx
    C = math.dist(pts[0], pts[3])  # left-right
    if C == 0:
        return 0.0
    ear = (A + B) / (2.0 * C)
    return ear, pts

def process_video_for_face_and_blinks(video_path, output_dir="static/annotated_videos",
                                      ear_thresh=0.18, ear_consec_frames=3, save_annotated=True):
    """
    Processes video_path, returns JSON report and saves annotated video (if requested).
    ear_thresh, ear_consec_frames -> blink detection parameters
    """
    os.makedirs(output_dir, exist_ok=True)
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    frame_w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    duration_sec = total_frames / fps if fps else 0

    # Setup writer for annotated video
    output_video_path = None
    if save_annotated:
        basename = os.path.splitext(os.path.basename(video_path))[0]
        output_video_path = os.path.join(output_dir, f"{basename}_annotated.mp4")
        writer = FFMPEG_VideoWriter(output_video_path, (frame_w, frame_h), fps=fps)

    # Metrics
    frames_with_face = 0
    frames_with_multiple_faces = 0
    blink_count = 0
    long_eye_closure_events = 0

    # Blink detection state
    blink_frame_counter = 0
    eyes_closed = False
    long_closure_threshold_frames = int(0.5 * fps)  # 0.5 sec for long closure
    last_long_closure_frame = 0  # Track last frame where long closure was counted

    face_mesh = mp_face.FaceMesh(static_image_mode=False, max_num_faces=2,
                                 refine_landmarks=True,
                                 min_detection_confidence=0.5, min_tracking_confidence=0.5)
    frame_idx = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame_idx += 1
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(rgb)

        faces_detected = 0
        frame_has_face = False
        multi_face_flag = False

        if results.multi_face_landmarks:
            faces_detected = len(results.multi_face_landmarks)
            frame_has_face = faces_detected > 0
            if faces_detected > 1:
                multi_face_flag = True
                frames_with_multiple_faces += 1

            # We'll look at first face for blink detection (extendable)
            first_face = results.multi_face_landmarks[0]
            left_ear, left_pts = eye_aspect_ratio(first_face.landmark, LEFT_EYE_IDX, frame_w, frame_h)
            right_ear, right_pts = eye_aspect_ratio(first_face.landmark, RIGHT_EYE_IDX, frame_w, frame_h)
            avg_ear = (left_ear + right_ear) / 2.0

            # Draw face landmarks bounding box
            # compute bounding box from landmarks
            xs = [lm.x for lm in first_face.landmark]
            ys = [lm.y for lm in first_face.landmark]
            minx = int(min(xs) * frame_w); maxx = int(max(xs) * frame_w)
            miny = int(min(ys) * frame_h); maxy = int(max(ys) * frame_h)
            cv2.rectangle(frame, (minx, miny), (maxx, maxy), (0,255,0), 2)
            cv2.putText(frame, f"EAR:{avg_ear:.2f}", (minx, miny-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255,255,255),2)

            # Draw eye contours
            for pt in left_pts:  # type: ignore
                cv2.circle(frame, pt, 2, (0,255,0), -1)
            for pt in right_pts:  # type: ignore
                cv2.circle(frame, pt, 2, (0,255,0), -1)

            # blink logic
            if avg_ear < ear_thresh:
                blink_frame_counter += 1
                if blink_frame_counter >= ear_consec_frames and not eyes_closed:
                    # A blink event detected
                    blink_count += 1
                    eyes_closed = True
                # long closure detection
                if blink_frame_counter >= long_closure_threshold_frames and frame_idx - last_long_closure_frame > long_closure_threshold_frames:
                    # one long closure event (count once per event)
                    long_eye_closure_events += 1
                    last_long_closure_frame = frame_idx
            else:
                # Reset counter when eyes open
                if eyes_closed and blink_frame_counter >= ear_consec_frames:
                    # ended a blink
                    pass
                # mark possible long closure event (if it lasted beyond threshold)
                if blink_frame_counter >= long_closure_threshold_frames:
                    long_eye_closure_events += 1
                blink_frame_counter = 0
                eyes_closed = False

        # Update metrics
        if frame_has_face:
            frames_with_face += 1
        if save_annotated:
            # overlay frame info
            info_text = f"Frame:{frame_idx}/{total_frames} Faces:{faces_detected} Blinks:{blink_count}"
            cv2.putText(frame, info_text, (10,30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0,200,255), 2)
            writer.write_frame(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

    # cleanup
    cap.release()
    face_mesh.close()
    if save_annotated:
        writer.close()

    face_presence_pct = (frames_with_face / total_frames * 100.0) if total_frames else 0.0

    report = {
        "video_path": video_path,
        "annotated_video": output_video_path,
        "total_frames": total_frames,
        "fps": fps,
        "duration_seconds": duration_sec,
        "face_presence_pct": face_presence_pct,
        "multiple_faces_frames": frames_with_multiple_faces,
        "blink_count": blink_count,
        "blink_rate_per_min": (blink_count / (duration_sec/60.0)) if duration_sec>0 else 0.0,
        "long_eye_closure_events": long_eye_closure_events
    }
    return report

if __name__ == "__main__":
    # test run
    import sys
    if len(sys.argv) < 2:
        print("Usage: python face_utils.py <video_path>")
        sys.exit(1)
    video = sys.argv[1]
    rep = process_video_for_face_and_blinks(video)
    out_json = os.path.splitext(video)[0] + "_analysis.json"
    with open(out_json, "w") as f:
        json.dump(rep, f, indent=2)
    print("Report saved to", out_json)
