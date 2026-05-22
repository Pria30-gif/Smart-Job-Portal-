import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

async function testFilenameValidation() {
  try {
    console.log('🧪 Testing Filename-Based Validation...');

    // Test health endpoint first
    console.log('Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5011/health');
    console.log('✅ Health check:', healthResponse.data);

    const uploadsDir = path.join(process.cwd(), 'uploads');

    // Test 1: Resume file (should be accepted)
    console.log('\n📄 Test 1: Resume file (should be accepted)');
    const resumeFiles = fs.readdirSync(uploadsDir).filter(file => file.includes('resume') && file.endsWith('.pdf'));
    if (resumeFiles.length > 0) {
      const resumeFile = resumeFiles[0];
      const resumePath = path.join(uploadsDir, resumeFile);
      const resumeBuffer = fs.readFileSync(resumePath);

      const formData1 = new FormData();
      formData1.append('resume', resumeBuffer, {
        filename: resumeFile,
        contentType: 'application/pdf'
      });

      try {
        const response1 = await axios.post('http://localhost:5011/api/resume/analyze', formData1, {
          headers: { ...formData1.getHeaders() },
          timeout: 30000,
        });
        console.log('✅ Resume file accepted and analyzed successfully');
      } catch (error) {
        console.log('❌ Resume file was rejected:', error.response?.data?.message || error.message);
      }
    }

    // Test 2: Non-resume file (should be rejected)
    console.log('\n📄 Test 2: Non-resume file (should be rejected)');
    const nonResumeFiles = fs.readdirSync(uploadsDir).filter(file => !file.includes('resume') && file.endsWith('.pdf') && !file.startsWith('temp_'));
    if (nonResumeFiles.length > 0) {
      const nonResumeFile = nonResumeFiles[0];
      const nonResumePath = path.join(uploadsDir, nonResumeFile);
      const nonResumeBuffer = fs.readFileSync(nonResumePath);

      const formData2 = new FormData();
      formData2.append('resume', nonResumeBuffer, {
        filename: nonResumeFile,
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

    // Test 3: Temp file (should be rejected)
    console.log('\n📄 Test 3: Temp file (should be rejected)');
    const tempFiles = fs.readdirSync(uploadsDir).filter(file => file.startsWith('temp_') && file.endsWith('.pdf'));
    if (tempFiles.length > 0) {
      const tempFile = tempFiles[0];
      const tempPath = path.join(uploadsDir, tempFile);
      const tempBuffer = fs.readFileSync(tempPath);

      const formData3 = new FormData();
      formData3.append('resume', tempBuffer, {
        filename: tempFile,
        contentType: 'application/pdf'
      });

      try {
        const response3 = await axios.post('http://localhost:5011/api/resume/analyze', formData3, {
          headers: { ...formData3.getHeaders() },
          timeout: 10000,
        });
        console.log('❌ Temp file was unexpectedly accepted');
      } catch (error) {
        if (error.response?.status === 400 && error.response.data.isResume === false) {
          console.log('✅ Temp file correctly rejected');
          console.log('Error message:', error.response.data.message);
        } else {
          console.log('❌ Unexpected error:', error.response?.data?.message || error.message);
        }
      }
    }

  } catch (error) {
    console.log('❌ Test setup failed:', error.message);
    console.log('Full error:', error);
  }
}

testFilenameValidation();