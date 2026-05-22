import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import JobList from './components/JobList';
import JobPost from './components/JobPost';
import ResumeUpload from './components/ResumeUpload';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/post-job" element={<JobPost />} />
        <Route path="/upload-resume" element={<ResumeUpload />} />
      </Routes>
    </Router>
  );
}

export default App;
