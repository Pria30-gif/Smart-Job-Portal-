import React, { useEffect, useState } from "react";
import FilterCard from "./Filtercard";
import Job1 from "./Job1";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
<<<<<<< HEAD
import { Link } from "react-router-dom"; // Import Link
import useGetAllJobs from "../../hooks/useGetAllJobs";
import axios from "axios";
import { JOB_API_ENDPOINT } from "../../utils/data";

const Jobs = () => {
  const { allJobs = [], searchedQuery } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth); // Get user info
  const [filterJobs, setFilterJobs] = useState(allJobs);

  useGetAllJobs();

=======

// Example handler - customize as per integration with your backend
const handleShowMatchingCandidates = (job) => {
  // You can open a modal, dialog, or route, or call the backend here
  alert(`Show matching candidates for Job: ${job.title}`);
  // Replace alert with an API call to your /ai-match endpoint and modal with results
};

const Jobs = () => {
  const { allJobs = [], searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);

>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
  useEffect(() => {
    if (!searchedQuery || searchedQuery.trim() === "") {
      setFilterJobs(allJobs);
      return;
    }
    const query = searchedQuery.toLowerCase();
    const filteredJobs = allJobs.filter((job) => {
      return (
        job.title?.toLowerCase().includes(query) ||
        job.description?.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query) ||
        job.experience?.toLowerCase().includes(query) ||
        job.salary?.toLowerCase().includes(query)
      );
    });
    setFilterJobs(filteredJobs);
  }, [allJobs, searchedQuery]);

  return (
    <div className="max-w-7xl mx-auto mt-5">
      <div className="flex gap-5">
        <div className="w-1/5">
          <FilterCard />
        </div>

        {filterJobs.length <= 0 ? (
          <span>Job not found</span>
        ) : (
          <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
            <div className="grid grid-cols-3 gap-4">
              {filterJobs.map((job, index) => (
                <motion.div
                  key={job._id || index}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.4 }}
                >
                  <Job1 job={job} />
<<<<<<< HEAD
                  
                  {/* Conditional button for recruiters */}
                  {user?.role === 'Recruiter' && (
                    <div className="flex gap-2 mt-2">
                      <Link to={`/admin/jobs/${job._id}/applicants`}>
                          <button
                              className="flex-1 px-4 py-2 bg-indigo-600 text-white font-semibold rounded shadow hover:bg-indigo-700 transition-colors"
                          >
                              View Applicants
                          </button>
                      </Link>
                      <button
                        className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded shadow hover:bg-yellow-700"
                        onClick={async () => {
                          const newTitle = prompt("Enter new job title:", job.title);
                          if (newTitle) {
                            try {
                              const res = await axios.put(`${JOB_API_ENDPOINT}/update/${job._id}`, { title: newTitle }, { withCredentials: true });
                              alert(res.data.message);
                              // Refresh jobs
                              window.location.reload();
                            } catch (error) {
                              console.error('Error updating job:', error);
                              alert('Failed to update job.');
                            }
                          }
                        }}
                      >
                        Update Job
                      </button>
                    </div>
                  )}

                  {/* Apply button for applicants */}
                  {user?.role !== 'Recruiter' && (
                     <button
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
                        onClick={async () => {
                          try {
                            const res = await axios.post(`${JOB_API_ENDPOINT}/apply/${job._id}`, {}, { withCredentials: true });
                            alert(res.data.message);
                          } catch (error) {
                            console.error('Error applying for job:', error);
                            alert('Failed to apply for job.');
                          }
                        }}
                      >
                        Apply Now
                      </button>
                  )}

=======
                  <button
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded shadow"
                    onClick={() => handleShowMatchingCandidates(job)}
                  >
                    Show Matching Candidates
                  </button>
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
