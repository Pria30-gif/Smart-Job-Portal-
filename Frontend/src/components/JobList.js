import React, { useEffect, useState } from 'react';
import axios from 'axios';

function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/jobs')
      .then(res => setJobs(res.data))
      .catch(() => setJobs([]));
  }, []);

  return (
    <div>
      <h2>Job Listings</h2>
      <ul>
        {jobs.map(job => (
          <li key={job._id}>
            <strong>{job.title}</strong> at {job.company} ({job.location})<br />
            {job.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JobList;
