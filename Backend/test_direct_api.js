import axios from 'axios';

const testBackendDirectly = async () => {
  try {
    console.log('🔄 Testing backend fix with direct API call...\n');
    
    // Test data matching MockInterviewPrep submission
    const testData = {
      userId: 'test-user-'  + Date.now(),
      domain: 'Software Development',
      questions: JSON.stringify(['What is your experience?', 'Tell us about a project']),
      transcripts: JSON.stringify([
        'I have 5 years experience developing React applications and Node.js backend. I led a team of engineers and implemented optimizations that improved performance by 40%. I design scalable solutions and thoroughly test every feature.',
        'I worked on a real-time project using MongoDB. We delivered a collaboration platform and hit all deadlines. I managed the backend and ensured stability for 100+ concurrent users.'
      ])
    };

    console.log('📤 Submitting test data...');
    console.log('  Questions:', testData.questions);
    console.log('  Transcripts count:', JSON.parse(testData.transcripts).length);
    
    const response = await axios.post(
      'http://localhost:5011/api/mock-interview-feedback/upload',
      testData,
      { timeout: 10000 }
    );

    console.log('\n✅ SUCCESS - Feedback generated!\n');
    console.log('Response structure:');
    console.log(JSON.stringify(response.data, null, 2));
    
    if (response.data.feedback) {
      const fb = response.data.feedback;
      console.log('\n🎯 KEY METRICS (Should be non-zero):');
      console.log(`  Overall Score: ${fb.overall_score}/100`);
      console.log(`  Avg Relevance: ${fb.analysis?.semantic_analysis?.avg_relevance}/10`);
      console.log(`  Avg Clarity: ${fb.analysis?.semantic_analysis?.avg_clarity}/10`);
      console.log(`  Eye Contact: ${fb.analysis?.camera_analysis?.overall_eye_contact_percentage}%`);
      console.log(`  Strengths: ${fb.ai_feedback?.strengths?.length || 0} found`);
      
      if (fb.overall_score > 0 && fb.analysis?.semantic_analysis?.avg_relevance > 0) {
        console.log('\n✅ PASS: Backend is returning real, non-zero feedback!');
      } else {
        console.log('\n❌ FAIL: Metrics are still zero!');
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testBackendDirectly();
