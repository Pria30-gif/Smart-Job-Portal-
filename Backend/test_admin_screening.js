import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

async function testAdminResumeScreening() {
  try {
    console.log('🧪 Testing Admin Resume Screening API...');

    // Test health endpoint first
    console.log('Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5011/health');
    console.log('✅ Health check:', healthResponse.data);

    // Find a resume file for testing
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const resumeFiles = fs.readdirSync(uploadsDir).filter(file => file.includes('resume') && file.endsWith('.pdf'));

    if (resumeFiles.length === 0) {
      console.log('❌ No resume files found for testing');
      return;
    }

    const resumeFile = resumeFiles[0];
    const resumePath = path.join(uploadsDir, resumeFile);
    console.log(`📄 Using resume file: ${resumeFile}`);

    // Read the resume file
    const pdfBuffer = fs.readFileSync(resumePath);

    // Test 1: Resume validation (should pass filename check)
    console.log('\n📋 Test 1: Resume validation');
    const formData1 = new FormData();
    formData1.append('resume', pdfBuffer, {
      filename: resumeFile,
      contentType: 'application/pdf'
    });

    try {
      const response1 = await axios.post('http://localhost:5011/api/resume/analyze', formData1, {
        headers: { ...formData1.getHeaders() },
        timeout: 30000,
      });
      console.log('✅ Resume validation passed - file accepted for analysis');
      console.log('ATS Score:', response1.data.atsScore);
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.isResume === false) {
        console.log('❌ Resume validation failed:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.response?.data?.message || error.message);
      }
    }

    // Test 2: Non-resume file (should be rejected)
    console.log('\n📋 Test 2: Non-resume file rejection');
    const tempFiles = fs.readdirSync(uploadsDir).filter(file => file.startsWith('temp_') && file.endsWith('.pdf'));

    if (tempFiles.length > 0) {
      const tempFile = tempFiles[0];
      const tempPath = path.join(uploadsDir, tempFile);
      const tempBuffer = fs.readFileSync(tempPath);

      const formData2 = new FormData();
      formData2.append('resume', tempBuffer, {
        filename: tempFile,
        contentType: 'application/pdf'
      });

      try {
        const response2 = await axios.post('http://localhost:5011/api/resume/analyze', formData2, {
          headers: { ...formData2.getHeaders() },
          timeout: 10000,
        });
        console.log('❌ Non-resume file was unexpectedly accepted');
      } catch (error) {
        if (error.response?.status === 400 && error.response.data.isResume === false) {
          console.log('✅ Non-resume file correctly rejected');
          console.log('Error message:', error.response.data.message);
        } else {
          console.log('❌ Unexpected error:', error.response?.data?.message || error.message);
        }
      }
    }

    console.log('\n🎉 Admin Resume Screening API test completed!');
    console.log('✅ Admin should now be able to call: http://localhost:5011/api/resume/analyze');

  } catch (error) {
    console.log('❌ Test setup failed:', error.message);
  }
}

testAdminResumeScreening();