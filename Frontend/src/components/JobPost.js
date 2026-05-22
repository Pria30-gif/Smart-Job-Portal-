import React, { useState } from 'react';
import axios from 'axios';

function JobPost() {
  const [form, setForm] = useState({ title: '', description: '', company: '', location: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/jobs', form);
      alert('Job posted!');
      setForm({ title: '', description: '', company: '', location: '' });
    } catch (err) {
      alert('Failed to post job');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Post a Job</h2>
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
      <input name="company" placeholder="Company" value={form.company} onChange={handleChange} required />
      <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
      <button type="submit">Post</button>
    </form>
  );
}

export default JobPost;
