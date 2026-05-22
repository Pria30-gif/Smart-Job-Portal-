import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

async function testAdminScreeningWithFlexibleValidation() {
  try {
    console.log('🧪 Testing Admin Resume Screening with Flexible Validation...');

    // Test health endpoint first
    console.log('Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5011/health');
    console.log('✅ Health check:', healthResponse.data);

    const uploadsDir = path.join(process.cwd(), 'uploads');

    // Test 1: File with "resume" in name (should work)
    console.log('\n📋 Test 1: File with "resume" in filename');
    const resumeFiles = fs.readdirSync(uploadsDir).filter(file => file.includes('resume') && file.endsWith('.pdf'));
    if (resumeFiles.length > 0) {
      const resumeFile = resumeFiles[0];
      const resumePath = path.join(uploadsDir, resumeFile);
      const resumeBuffer = fs.readFileSync(resumePath);

      const formData1 = new FormData();
      formData1.append('resume', resumeBuffer, { filename: resumeFile, contentType: 'application/pdf' });
      formData1.append('jobDesc', 'Looking for a software developer with React and Node.js experience');

      try {
        const response1 = await axios.post('http://localhost:5011/api/resume/analyze', formData1, {
          headers: { ...formData1.getHeaders() },
          timeout: 30000,
        });
        console.log('✅ Resume file accepted and analyzed successfully');
        console.log('ATS Score:', response1.data.atsScore);
      } catch (error) {
        console.log('❌ Resume file rejected:', error.response?.data?.message || error.message);
      }
    }

    // Test 2: File without "resume" in name but with resume content (should work with flexible validation)
    console.log('\n📋 Test 2: File without "resume" in name but with content');
    const otherFiles = fs.readdirSync(uploadsDir).filter(file => !file.includes('resume') && file.endsWith('.pdf') && !file.startsWith('temp_'));
    if (otherFiles.length > 0) {
      const otherFile = otherFiles[0];
      const otherPath = path.join(uploadsDir, otherFile);
      const otherBuffer = fs.readFileSync(otherPath);

      const formData2 = new FormData();
      formData2.append('resume', otherBuffer, { filename: otherFile, contentType: 'application/pdf' });
      formData2.append('jobDesc', 'Looking for a software developer with React and Node.js experience');

      try {
        const response2 = await axios.post('http://localhost:5011/api/resume/analyze', formData2, {
          headers: { ...formData2.getHeaders() },
          timeout: 30000,
        });
        console.log('✅ Non-resume filename accepted due to content validation');
        console.log('ATS Score:', response2.data.atsScore);
      } catch (error) {
        console.log('❌ File rejected:', error.response?.data?.message || error.message);
      }
    }

    // Test 3: Temp file with no resume content (should be rejected)
    console.log('\n📋 Test 3: Temp file with no resume content');
    const tempFiles = fs.readdirSync(uploadsDir).filter(file => file.startsWith('temp_') && file.endsWith('.pdf'));
    if (tempFiles.length > 0) {
      const tempFile = tempFiles[0];
      const tempPath = path.join(uploadsDir, tempFile);
      const tempBuffer = fs.readFileSync(tempPath);

      const formData3 = new FormData();
      formData3.append('resume', tempBuffer, { filename: tempFile, contentType: 'application/pdf' });
      formData3.append('jobDesc', 'Looking for a software developer with React and Node.js experience');

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

    console.log('\n🎉 Admin Resume Screening validation test completed!');
    console.log('✅ Flexible validation: Accepts files with "resume" in name OR resume-like content');
    console.log('❌ Rejects files with neither resume filename nor content');

  } catch (error) {
    console.log('❌ Test setup failed:', error.message);
  }
}

testAdminScreeningWithFlexibleValidation();