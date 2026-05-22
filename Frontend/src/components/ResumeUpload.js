import React, { useState } from 'react';
import axios from 'axios';

function ResumeUpload() {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('resume', file);
    try {
      await axios.post('http://localhost:5000/api/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Resume uploaded!');
    } catch (err) {
      alert('Upload failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Upload Resume</h2>
      <input type="file" onChange={e => setFile(e.target.files[0])} accept=".pdf,.doc,.docx" required />
      <button type="submit">Upload</button>
    </form>
  );
}

export default ResumeUpload;
