import React from "react";
import { useSelector } from "react-redux";
import AppliedJob from "./AppliedJob";
import useGetAppliedJobs from "../../hooks/useGetAllAppliedJobs";

const AppliedJobsPage = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  // Fetch applied jobs
  useGetAppliedJobs();

  if (user?.role === 'recruiter') {
    return (
      <div className="max-w-4xl mx-auto my-10 p-8">
        <h1 className="text-2xl font-bold text-center">Access Denied</h1>
        <p className="text-center text-gray-600 mt-4">
          This page is only available for job seekers.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-10 p-8">
      <h1 className="text-2xl font-bold mb-6">My Applied Jobs</h1>
      <AppliedJob />
    </div>
  );
};

export default AppliedJobsPage;
