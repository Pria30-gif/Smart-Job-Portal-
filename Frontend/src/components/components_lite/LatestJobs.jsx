import React from "react";
import JobCards from "./JobCards";
import { useSelector } from "react-redux";

const LatestJobs = () => {
  const allJobs = useSelector((state) => state.jobs?.allJobs || []); // Safely access allJobs

  return (
<<<<<<< HEAD
    <div className="max-w-7xl mx-auto my-10">
      <h2 className="text-3xl font-bold">
=======
    <div className="max-w-7xl mx-auto my-20">
      <h2 className="text-4xl font-bold">
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
        <span className="text-[#6A38C2]">Latest & Top </span>Job Openings
      </h2>

      {/* Job Cards */}
<<<<<<< HEAD
      <div className="grid grid-cols-2 gap-4 my-5">
=======
      <div className="grid grid-cols-3 gap-4 my-5">
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
        {allJobs.length === 0 ? (
          <span>No Job Available</span>
        ) : (
          allJobs
            .slice(0, 6)
            .map((job) =>
              job?._id ? (
                <JobCards key={job._id} job={job}></JobCards>
              ) : (
                <span key={Math.random()}>Invalid Job Data</span>
              )
            )
        )}
      </div>
    </div>
  );
};

export default LatestJobs;
