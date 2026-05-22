import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={() => navigate('/jobs')}>View Jobs</button>
      <button onClick={() => navigate('/post-job')}>Post Job</button>
      <button onClick={() => navigate('/upload-resume')}>Upload Resume</button>
      <button onClick={() => { localStorage.removeItem('token'); navigate('/'); }}>Logout</button>
    </div>
  );
}

export default Dashboard;
