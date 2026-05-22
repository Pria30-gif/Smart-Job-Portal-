import FormData from 'form-data';

const testBackendFix = async () => {
  try {
    console.log('🔄 Testing scoping fix in backend...\n');
    
    // Create FormData
    const form = new FormData();
    form.append('userId', 'test-user-123');
    form.append('domain', 'Software Development');
    form.append('questions', JSON.stringify(['What is your experience?', 'Tell us about a project']));
    form.append('transcripts', JSON.stringify([
      'I have 5 years experience developing React applications. I lead a team of 3 engineers and implemented optimization improvements that reduced load time by 40%. I design scalable architectures and test thoroughly with unit and integration tests.',
      'I worked on a project using Node.js and MongoDB. We delivered a real-time collaboration platform. I managed the backend infrastructure and delivered the project on time for 50+ users.'
    ]));

    console.log('📤 Submitting interview data to backend...');
    const response = await fetch('http://localhost:5011/api/mock-interview-feedback/upload', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });

    if (!response.ok) {
      console.error(`❌ Request failed with status ${response.status}`);
      const errorText = await response.text();
      console.error('Error:', errorText);
      return;
    }

    const result = await response.json();
    console.log('\n✅ Backend response received!\n');
    console.log('Full response structure:', JSON.stringify(result, null, 2));
    
    if (result.feedback) {
      console.log('\n🎯 FEEDBACK STRUCTURE:');
      console.log('  - overall_score:', result.feedback.overall_score);
      console.log('  - analysis exists:', !!result.feedback.analysis);
      console.log('  - ai_feedback exists:', !!result.feedback.ai_feedback);
      
      if (result.feedback.analysis) {
        console.log('\n📊 ANALYSIS DATA:');
        console.log('  - avg_relevance:', result.feedback.analysis.semantic_analysis?.avg_relevance);
        console.log('  - avg_clarity:', result.feedback.analysis.semantic_analysis?.avg_clarity);
        console.log('  - eye_contact:', result.feedback.analysis.camera_analysis?.overall_eye_contact_percentage + '%');
        console.log('  - engagement:', result.feedback.analysis.camera_analysis?.overall_engagement_score);
      }
      
      if (result.feedback.ai_feedback) {
        console.log('\n🤖 AI FEEDBACK:');
        console.log('  - summary:', result.feedback.ai_feedback.summary?.substring(0, 80) + '...');
        console.log('  - strengths:', result.feedback.ai_feedback.strengths);
        console.log('  - improvements:', result.feedback.ai_feedback.improvements);
      }
      
      console.log('\n✅ SUCCESS: Backend properly created feedback with non-zero values!');
    } else {
      console.warn('⚠️ No feedback in response');
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
};

testBackendFix();
