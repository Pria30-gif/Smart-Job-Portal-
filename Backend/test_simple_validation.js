import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

async function testSimpleFilenameValidation() {
  try {
    console.log('🧪 Testing Simple Filename Validation...');

    // Test with a resume file (should work)
    console.log('\n📄 Testing resume file...');
    const uploadsDir = path.join(process.cwd(), 'uploads');
    const resumeFiles = fs.readdirSync(uploadsDir).filter(file => file.includes('resume') && file.endsWith('.pdf'));

    if (resumeFiles.length > 0) {
      const resumeFile = resumeFiles[0];
      console.log(`Found resume file: ${resumeFile}`);
      console.log('✅ This should be accepted (contains "resume" in filename)');
    } else {
      console.log('❌ No resume files found');
    }

    // Test with non-resume files (should be rejected)
    console.log('\n📄 Testing non-resume files...');
    const nonResumeFiles = fs.readdirSync(uploadsDir).filter(file => !file.includes('resume') && file.endsWith('.pdf') && !file.startsWith('temp_'));

    if (nonResumeFiles.length > 0) {
      nonResumeFiles.forEach(file => {
        console.log(`Found non-resume file: ${file}`);
        console.log('❌ This should be rejected (no "resume" in filename)');
      });
    } else {
      console.log('No non-resume files found');
    }

    // Test with temp files (should be rejected)
    console.log('\n📄 Testing temp files...');
    const tempFiles = fs.readdirSync(uploadsDir).filter(file => file.startsWith('temp_') && file.endsWith('.pdf'));

    if (tempFiles.length > 0) {
      tempFiles.forEach(file => {
        console.log(`Found temp file: ${file}`);
        console.log('❌ This should be rejected (no "resume" in filename)');
      });
    } else {
      console.log('No temp files found');
    }

    console.log('\n📋 Summary:');
    console.log('- Only files with "resume" in the filename should be analyzed');
    console.log('- All other PDF files should be rejected with filename-based validation');

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testSimpleFilenameValidation();