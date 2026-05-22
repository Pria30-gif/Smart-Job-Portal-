import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const API = 'http://localhost:5011';

async function testInterviewFlow() {
  console.log('🚀 Testing full interview flow...\n');
  
  const userId = 'test_user_' + Date.now();
  const domain = 'Frontend';
  const questions = [
    "What is the difference between let and const in JavaScript?",
    "Explain the CSS box model."
  ];
  const transcripts = [
    "Let is block-scoped and can be reassigned. Const is block-scoped but cannot be reassigned. Both are better than var.",
    "The box model consists of content, padding, border, and margin. Content is the innermost part with the actual element."
  ];

  // 1. Submit interview
  console.log('1️⃣  Submitting interview...');
  const form = new FormData();
  form.append('userId', userId);
  form.append('domain', domain);
  form.append('questions', JSON.stringify(questions));
  form.append('transcripts', JSON.stringify(transcripts));
  
  // Create dummy video
  const dummyVideo = 'test_interview.webm';
  fs.writeFileSync(dummyVideo, Buffer.from('DUMMY_VIDEO_DATA'));
  form.append('file', fs.createReadStream(dummyVideo), {
    filename: 'test_interview.webm',
    contentType: 'video/webm'
  });

  try {
    const uploadRes = await axios.post(`${API}/api/mock-interview-feedback/upload`, form, {
      headers: form.getHeaders(),
      timeout: 15000
    });

    console.log('✅ Upload successful!\n');
    console.log('📊 Response structure:');
    console.log('  - success:', uploadRes.data.success);
    console.log('  - feedback exists:', !!uploadRes.data.feedback);
    
    if (uploadRes.data.feedback) {
      const fb = uploadRes.data.feedback;
      console.log('  - overall_score:', fb.overall_score || 'N/A');
      console.log('  - analysis exists:', !!fb.analysis);
      if (fb.analysis) {
        console.log('    - semantic_analysis:', !!fb.analysis.semantic_analysis);
        console.log('    - camera_analysis:', !!fb.analysis.camera_analysis);
        console.log('    - ai_feedback:', !!fb.analysis.ai_feedback);
      }
      console.log('  - ai_feedback exists:', !!fb.ai_feedback);
      if (fb.ai_feedback) {
        console.log('    - summary:', !!fb.ai_feedback.summary);
        console.log('    - strengths:', Array.isArray(fb.ai_feedback.strengths) ? fb.ai_feedback.strengths.length : 0);
        console.log('    - improvements:', Array.isArray(fb.ai_feedback.improvements) ? fb.ai_feedback.improvements.length : 0);
      }
    }

    // 2. Fetch feedback (what dashboard will see)
    console.log('\n2️⃣  Fetching feedback (dashboard view)...');
    await new Promise(r => setTimeout(r, 1000)); // Wait a moment
    
    const fetchRes = await axios.get(`${API}/api/mock-interview-feedback/${userId}`, {
      withCredentials: true,
      timeout: 10000
    });

    console.log('✅ Fetch successful!\n');
    const feedback = fetchRes.data.feedback;
    
    console.log('📋 DASHBOARD WILL RENDER:\n');
    console.log('Overall Score:', feedback.overall_score || 0);
    console.log('Analysis keys:', Object.keys(feedback.analysis || {}));
    
    if (feedback.analysis) {
      const a = feedback.analysis;
      console.log('\nSemantic Analysis:');
      console.log('  - Relevance array:', a.semantic_analysis?.relevance);
      console.log('  - Clarity array:', a.semantic_analysis?.clarity);
      console.log('  - Avg relevance:', a.semantic_analysis?.avg_relevance);
      
      console.log('\nCamera/Body Language:');
      console.log('  - Eye contact %:', a.camera_analysis?.overall_eye_contact_percentage);
      console.log('  - Engagement score:', a.camera_analysis?.overall_engagement_score);
      console.log('  - Posture score:', a.camera_analysis?.overall_posture_score);
      console.log('  - Blink rate:', a.face_behavior?.blink_rate_per_min);
      
      console.log('\nTone & Confidence:');
      console.log('  - Confidence array:', a.tone_analysis?.confidence);
      console.log('  - Tone array:', a.tone_analysis?.tone);
    }

    if (feedback.ai_feedback) {
      console.log('\n🤖 AI Feedback:');
      console.log('  - Summary:', feedback.ai_feedback.summary);
      console.log('  - Strengths:', feedback.ai_feedback.strengths);
      console.log('  - Improvements:', feedback.ai_feedback.improvements);
      console.log('  - Recommendations:', feedback.ai_feedback.recommendations);
    }

    console.log('\n🎉 RESULT: Dashboard should now show non-zero, dynamic values!');

  } catch (err) {
    console.error('❌ Error:', err.message);
    if (err.response) console.error('Response:', err.response.data);
  } finally {
    try { fs.unlinkSync(dummyVideo); } catch (e) {}
  }
}

testInterviewFlow();
