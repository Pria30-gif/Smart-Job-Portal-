// client/src/components/profile/ResumeUpload.jsx

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const ResumeUpload = () => {
  const [message, setMessage] = useState('');
  const [skills, setSkills] = useState([]); // Initial state is an empty array
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    setIsLoading(true);
    setMessage('');
    setSkills([]);

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('resume', file);

    axios.post('/api/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(res => {
      setMessage(res.data.message);
      // 👇 CORRECTED LINE: Access the nested data object
      setSkills(res.data.data.skills || []); // Use || [] as a safeguard
      setIsLoading(false);
    })
    .catch(err => {
      const errorMsg = err.response?.data?.message || 'An error occurred';
      setMessage(errorMsg);
      setIsLoading(false);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
  });

  return (
    <div className="resume-upload-container">
      <h3>Upload and Analyze Your Resume</h3>
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop a PDF resume here, or click to select a file</p>
      </div>
      
      {isLoading && <p>Analyzing... please wait.</p>}
      {message && <p className="message">{message}</p>}
      
      {/* This check now works because 'skills' is always an array */}
      {skills.length > 0 && (
        <div className="skills-display">
          <h4>Extracted Skills:</h4>
          <div className="skills-list">
            {skills.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;