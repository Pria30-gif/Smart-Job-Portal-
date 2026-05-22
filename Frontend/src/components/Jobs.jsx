import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Header from "./components_lite/Header.jsx";
import Categories from "./components_lite/Categories.jsx";
import useGetAllJobs from "../hooks/useGetAllJobs.jsx";
import useGetAppliedJobs from "../hooks/useGetAllAppliedJobs.jsx";
import { Building2, MapPin, DollarSign, Clock, Search, Filter } from "lucide-react";

const Jobs = () => {
  const navigate = useNavigate();
  const { loading: jobsLoading, error: jobsError } = useGetAllJobs();
  const { loading: appliedLoading, error: appliedError } = useGetAppliedJobs();
  const jobs = useSelector((state) => state.jobs.allJobs) || [];
  const appliedJobs = useSelector((state) => state.jobs.allAppliedJobs) || [];
  const { user } = useSelector((store) => store.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [technologyFilter, setTechnologyFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");

  useEffect(() => {
    if (user?.role === "Recruiter") {
      navigate("/admin");
    }
  }, [user, navigate]);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !locationFilter || job.location?.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesTechnology = !technologyFilter || job.requirements?.some(req => req.toLowerCase().includes(technologyFilter.toLowerCase()));
    const matchesExperience = !experienceFilter || job.experienceLevel === experienceFilter;
    const matchesSalary = !salaryFilter || (
      (salaryFilter === "0-50k" && job.salary < 50000) ||
      (salaryFilter === "50k-100k" && job.salary >= 50000 && job.salary < 100000) ||
      (salaryFilter === "100k-200k" && job.salary >= 100000 && job.salary < 200000) ||
      (salaryFilter === "200k+" && job.salary >= 200000)
    );

    return matchesSearch && matchesLocation && matchesTechnology && matchesExperience && matchesSalary;
  });

  return (
    <div>
      <Header />
      <Categories />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {user && appliedJobs.length > 0 && (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Applied Jobs</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {appliedJobs.map((application, index) => {
                const job = application.job;
                return (
                  <div
                    key={job._id || index}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title || "Untitled Job"}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Building2 size={16} className="mr-2" />
                          <span>{job.company?.name || "Unknown Company"}</span>
                        </div>
                      </div>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        APPLIED
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin size={16} className="mr-2" />
                        <span>{job.location || "N/A"}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign size={16} className="mr-2" />
                        <span>${job.salary?.toLocaleString() || "N/A"}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-2" />
                        <span>{job.experienceLevel} years experience</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-700 text-sm line-clamp-3">
                        {job.description || "No description available."}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {Array.isArray(job.requirements) && job.requirements.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {Array.isArray(job.requirements) && job.requirements.length > 3 && (
                        <span className="text-gray-500 text-xs">+{job.requirements.length - 3} more</span>
                      )}
                    </div>

                    <Link
                      to={`/description/${job._id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-center block"
                    >
                      View Details
                    </Link>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Jobs</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <input
              type="text"
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="Technology"
              value={technologyFilter}
              onChange={(e) => setTechnologyFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Experience Level</option>
              <option value="1">1 year</option>
              <option value="2">2 years</option>
              <option value="3">3 years</option>
              <option value="4">4 years</option>
              <option value="5">5 years</option>
              <option value="6">6 years</option>
              <option value="7">7+ years</option>
            </select>
            <select
              value={salaryFilter}
              onChange={(e) => setSalaryFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Salary Range</option>
              <option value="0-50k">$0 - $50k</option>
              <option value="50k-100k">$50k - $100k</option>
              <option value="100k-200k">$100k - $200k</option>
              <option value="200k+">$200k+</option>
            </select>
          </div>
        </div>

        {(jobsLoading || appliedLoading) && <p className="text-center py-8">Loading jobs...</p>}
        {(jobsError || appliedError) && (
          <p className="text-center text-red-600 py-8">
            {jobsError || (appliedError && appliedError.includes("401") ? "You must be logged in to view applied jobs." : appliedError)}
          </p>
        )}

        {!jobsLoading && !jobsError && filteredJobs.length === 0 && (
          <p className="text-center py-8 text-gray-500">No jobs found matching your criteria.</p>
        )}

        {!jobsLoading && !jobsError && filteredJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, index) => (
              <div
                key={job._id || index}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title || "Untitled Job"}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Building2 size={16} className="mr-2" />
                      <span>{job.company?.name || "Unknown Company"}</span>
                    </div>
                  </div>
                  {appliedJobs?.some(app => app.job?._id === job._id) && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      APPLIED
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={16} className="mr-2" />
                    <span>{job.location || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign size={16} className="mr-2" />
                    <span>${job.salary?.toLocaleString() || "N/A"}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock size={16} className="mr-2" />
                    <span>{job.experienceLevel} years experience</span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 text-sm line-clamp-3">
                    {job.description || "No description available."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {Array.isArray(job.requirements) && job.requirements.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {Array.isArray(job.requirements) && job.requirements.length > 3 && (
                    <span className="text-gray-500 text-xs">+{job.requirements.length - 3} more</span>
                  )}
                </div>

                <Link
                  to={`/description/${job._id}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-center block"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
