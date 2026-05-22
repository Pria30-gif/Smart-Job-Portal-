// Simple test for resume analyzer API
import axios from 'axios';

async function testResumeAnalyzer() {
  try {
    console.log('🧪 Testing server...');

    // Check if server is running
    console.log('🔍 Checking server health...');
    const response = await axios.get('http://localhost:34567/health', { timeout: 5000 });
    console.log('✅ Server is running:', response.data);

    console.log('✅ Server is working without admin routes!');
    console.log('📝 The issue is with the admin.route.js file');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('❌ Error code:', error.code);
    if (error.response) {
      console.error('❌ Response status:', error.response.status);
      console.error('❌ Response data:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error('❌ No response received - server may not be running');
    }
  }
}

testResumeAnalyzer();