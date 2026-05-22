import React, { useEffect } from "react";
import { useSelector } from "react-redux";
<<<<<<< HEAD
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header.jsx";
import Categories from "./Categories.jsx";
import useGetAllJobs from "../../hooks/useGetAllJobs.jsx";
import useGetAppliedJobs from "../../hooks/useGetAllAppliedJobs.jsx";
import { Building2, MessageCircle, Target, FileText, Briefcase, TrendingUp } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const { loading: jobsLoading, error: jobsError } = useGetAllJobs();
  const { loading: appliedLoading, error: appliedError } = useGetAppliedJobs();
  const jobs = useSelector((state) => state.jobs.allJobs) || [];
  const appliedJobs = useSelector((state) => state.jobs.allAppliedJobs) || [];
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (user?.role === "Recruiter") {
      navigate("/admin");
    }
  }, [user, navigate]);



=======
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header.jsx";
import Categories from "./Categories.jsx";
import useGetAllJobs from "../../hooks/useGetAllJobs.jsx";
import useGetAllAppliedJobs from "../../hooks/useGetAllAppliedJobs.jsx";
import { Building2, MessageCircle, Target, FileText, Briefcase } from "lucide-react";

const Home = () => {
  const { loading: jobsLoading, error: jobsError } = useGetAllJobs();
  const { loading: appliedLoading, error: appliedError } = useGetAllAppliedJobs();

  // ✅ Fixed selectors: use 'job' instead of 'jobs' to match your store
  const jobs = useSelector((state) => state.job?.allJobs) || [];
  const appliedJobs = useSelector((state) => state.job?.allAppliedJobs) || [];
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "Recruiter") {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
  return (
    <div>
      <Header />
      <Categories />

      {/* Resume Builder */}
      <div className="text-center my-5">
        <Link to="/resume-builder">
          <button className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all">
            Build Resume
          </button>
        </Link>
      </div>
<<<<<<< HEAD
      

=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e

      <h2 className="text-left text-purple-700 font-bold text-3xl my-6 px-4">
        Latest Top Job Openings
      </h2>

<<<<<<< HEAD
      {(jobsLoading || appliedLoading) && <p className="px-4">Loading jobs...</p>}
      {(jobsError || appliedError) && (
        <p className="text-red-600 px-4">
          {jobsError || (appliedError && appliedError.includes("401") ? "You must be logged in to view applied jobs." : appliedError)}
        </p>
      )}

      {!jobsLoading && !jobsError && jobs.length === 0 && <p className="px-4">No jobs found.</p>}

      {/* HORIZONTAL SCROLLABLE CONTAINER */}
      {!jobsLoading && !jobsError && jobs.length > 0 && (
        <div className="px-4 mb-10">
          <div className="overflow-x-auto custom-scrollbar border border-gray-100 rounded-lg p-4 bg-gray-50/50">
            <div className="flex flex-row gap-4 min-w-max">
              {jobs.map((job, index) => (
                <Link
                  key={job._id || index}
                  to="/jobs"
                  className="block"
                >
                  <div className="border p-4 rounded-md bg-white cursor-pointer hover:shadow-md transition border-gray-200 min-w-[300px]">
                    <h3 className="font-semibold text-lg text-gray-800">{job.title || "Untitled Job"}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1 my-1">
                      <Building2 size={16} className="text-gray-500" />
                      {job.company?.name || "Unknown Company"}
                    </p>
                    <p className="text-sm text-gray-700"><span className="font-medium">Location:</span> {job.location || "N/A"}</p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Skills:</span>{" "}
                      {Array.isArray(job.skills) && job.skills.length > 0
                        ? job.skills
                            .map((skill) =>
                              typeof skill === "string" ? skill : skill.name
                            )
                            .join(", ")
                        : "N/A"}
                    </p>
                    {appliedJobs?.some(app => app.job?._id === job._id) && (
                      <p className="text-green-600 text-xs font-bold mt-3 bg-green-50 w-fit px-2 py-1 rounded">
                        ✅ APPLIED
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <p className="text-center text-gray-400 text-xs mt-2 italic">Scroll horizontally to see more jobs</p>
        </div>
      )}

      {/* ===================== SMART JOB PORTAL SECTION (UNCHANGED) ===================== */}
      <section className="py-12 px-6 md:px-16 bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 relative overflow-hidden">
=======
      {(jobsLoading || appliedLoading) && <p>Loading jobs...</p>}
      {(jobsError || appliedError) && (
        <p className="text-red-600">Error: {jobsError || appliedError}</p>
      )}

      {!jobsLoading && !jobsError && jobs.length === 0 && <p>No jobs found.</p>}
      {!jobsLoading && !jobsError && jobs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {jobs.map((job, index) => (
            <div
              key={job._id || index}
              className="border p-4 rounded-md cursor-pointer hover:shadow-md transition"
            >
              <h3 className="font-semibold">{job.title || "Untitled Job"}</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Building2 size={16} className="text-gray-500" />
                {job.company?.name || "Unknown Company"}
              </p>
              <p>Location: {job.location || "N/A"}</p>
              <p>
                Skills Required:{" "}
                {Array.isArray(job.skills) && job.skills.length > 0
                  ? job.skills
                      .map((skill) =>
                        typeof skill === "string" ? skill : skill.name
                      )
                      .join(", ")
                  : "N/A"}
              </p>
              {appliedJobs?.includes(job._id) && (
                <p className="text-green-600 font-medium mt-2">
                  ✅ You have applied for this job
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ===================== SMART JOB PORTAL SECTION (MINIMIZED) ===================== */}
      <section className="py-12 px-6 md:px-16 bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 relative overflow-hidden">
        {/* Background accent blobs */}
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-blue-600/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-purple-600/25 blur-3xl rounded-full"></div>

        <div className="container mx-auto relative z-10">
          <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row items-center">
<<<<<<< HEAD
=======
            {/* Left Content */}
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
            <div className="p-8 md:p-10 md:w-1/2 space-y-4">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-snug">
                Empower Your Career with{" "}
                <span className="text-blue-400">Smart Intelligence</span>
              </h2>
              <p className="text-base text-gray-300 max-w-md">
                Discover jobs that match your skills, enhance your resume with
                AI feedback, and take guided steps toward your dream career — all
                in one intelligent platform.
              </p>

              <div className="flex flex-wrap gap-3 mt-4">
                <Link to="/career-coach">
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-blue-500/40 transition-all duration-300 text-sm md:text-base">
                    <MessageCircle size={18} />
                    Career Guidance
                  </button>
                </Link>
                <Link to="/jobs">
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/20 transition-all duration-300 text-sm md:text-base">
                    <Briefcase size={18} />
                    Explore Jobs
                  </button>
                </Link>
<<<<<<< HEAD
                <button
                  onClick={() => window.open('http://localhost:8501', '_blank')}
                  className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-purple-500/40 transition-all duration-300 text-sm md:text-base"
                >
                  <TrendingUp size={18} />
                  Salary Prediction
                </button>
              </div>
            </div>

=======
              </div>
            </div>

            {/* Right Image */}
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
            <div className="md:w-1/2 relative">
              <img
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2000&auto=format&fit=crop"
                alt="Smart Job Portal Career"
                className="w-full h-[250px] md:h-[320px] object-cover brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-slate-900/60 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* ===================== AI Tools Cards (UNCHANGED) ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-20 my-12">
=======
      {/* ===================== AI Tools Cards ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 md:px-20 my-12">
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
        <Link
          to="/skill-gap-analysis"
          className="block p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100"
        >
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-5">
            <Target size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Smart Skill Gap Analysis
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Compare your resume with job roles and identify the key skills you
            need to acquire to stay competitive.
          </p>
        </Link>

        <Link
          to="/cover-letter-generator"
          className="block p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100"
        >
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-5">
            <FileText size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            AI Cover Letter Generator
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Generate a personalized and professional cover letter based on your
            resume and desired job.
          </p>
        </Link>
<<<<<<< HEAD

        <a
          href="http://localhost:8501"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 cursor-pointer"
        >
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 text-purple-600 mb-5">
            <TrendingUp size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Salary Prediction Tool
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Predict your potential salary based on experience, education, and location using machine learning.
          </p>
        </a>
=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Home;
=======
export default Home;
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
