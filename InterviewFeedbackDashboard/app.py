import streamlit as st
import json
import pandas as pd
import matplotlib.pyplot as plt
import requests

st.title("AI-Powered Interview Feedback Dashboard")

API_BASE_URL = "http://localhost:5011"

# Function to fetch feedback from API
def fetch_feedback(user_id):
    try:
        response = requests.get(f"{API_BASE_URL}/api/mock-interview-feedback/all/{user_id}")
        if response.status_code == 200:
            return response.json().get('feedback', [])
        else:
            return []
    except Exception as e:
        st.error(f"Error fetching feedback: {e}")
        return []

# Use default test user ID (no manual input needed)
user_id = "68bc51faf6b48a6abac98fbe"  # Default test user
st.info(f"📋 Loading feedback for all sessions...")

feedbacks = fetch_feedback(user_id)
if feedbacks:
    st.success(f"✅ Found {len(feedbacks)} feedback session(s)")

    for i, fb in enumerate(feedbacks):
        st.header(f"Session {i+1} - {fb.get('created_at', 'No date')}")

        col1, col2 = st.columns(2)

        with col1:
            st.subheader("📝 Questions & Answers")
            transcripts = fb.get('transcripts', [])
            if transcripts:
                for j, transcript in enumerate(transcripts):
                    st.write(f"**Q{j+1}:** {transcript}")
            else:
                st.write("No transcripts available")

        with col2:
            st.subheader("📊 Semantic Analysis")
            semantic = fb.get('analysis', {}).get('semantic_analysis', {})
            if semantic:
                relevance_scores = semantic.get('relevance', [])
                clarity_scores = semantic.get('clarity', [])
                
                avg_relevance = sum(relevance_scores) / len(relevance_scores) if relevance_scores else 0
                avg_clarity = sum(clarity_scores) / len(clarity_scores) if clarity_scores else 0
                
                st.write(f"Average Relevance: {avg_relevance:.2f}/10")
                st.write(f"Average Clarity: {avg_clarity:.2f}/10")

                # Chart
                fig, ax = plt.subplots()
                ax.bar(['Relevance', 'Clarity'], [avg_relevance, avg_clarity])
                ax.set_ylim(0, 10)
                st.pyplot(fig)
            else:
                st.write("No semantic analysis available")

        st.subheader("💪 Body Language")
        body = fb.get('analysis', {}).get('body_language', {})
        if body:
            st.write(f"👁️ Eye Contact: {body.get('eye_contact', 0):.2f}/10")
            st.write(f"🧍 Posture: {body.get('posture', 0):.2f}/10")
        else:
            st.write("No body language data available")

        st.subheader("🎤 Tone & Confidence")
        tone = fb.get('analysis', {}).get('tone_confidence', {})
        if tone:
            tone_scores = tone.get('tone', [])
            confidence_scores = tone.get('confidence', [])
            speech_rates = tone.get('speech_rate', [])
            
            avg_tone = sum(tone_scores) / len(tone_scores) if tone_scores else 0
            avg_confidence = sum(confidence_scores) / len(confidence_scores) if confidence_scores else 0
            avg_speech_rate = sum(speech_rates) / len(speech_rates) if speech_rates else 0
            
            st.write(f"🗣️ Tone: {avg_tone:.2f}/10")
            st.write(f"😊 Confidence: {avg_confidence:.2f}/10")
            st.write(f"⏱️ Speech Rate: {avg_speech_rate:.2f}/10")
        else:
            st.write("No tone/confidence data available")

        # New: Face Analysis
        if 'face_analysis' in fb.get('analysis', {}):
            st.subheader("👤 Face Analysis")
            face = fb['analysis']['face_analysis']
            st.write(f"🎯 Face Presence: {face.get('face_presence_pct', 0):.1f}%")
            st.write(f"👁️ Blink Count: {face.get('blink_count', 0)}")
            st.write(f"👁️ Blink Rate: {face.get('blink_rate_per_min', 0):.1f}/min")
            st.write(f"⏸️ Long Eye Closures: {face.get('long_eye_closure_events', 0)}")

        st.divider()
else:
    st.warning("❌ No feedback found. Please complete an interview first.")
