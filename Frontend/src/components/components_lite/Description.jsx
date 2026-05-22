import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useParams } from "react-router-dom";
import { JOB_API_ENDPOINT, APPLICATION_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSingleJob } from "@/redux/jobSlice";
import { toast } from "sonner";
<<<<<<< HEAD
import { Trash2 } from "lucide-react";
import TacitMeter from "../TacitMeter";
import useTacit from "@/hooks/useTacit";
=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e

const Description = () => {
  const params = useParams();
  const jobId = params.id;

  const { singleJob } = useSelector((store) => store.job);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useSelector((store) => store.auth);

<<<<<<< HEAD
  // ✅ Fetch TACIT analytics
  const { tacit, loading: tacitLoading, error: tacitError } = useTacit(jobId);

  const isIntiallyApplied =
    singleJob?.applications?.some(
=======
  const isIntiallyApplied =
    singleJob?.application?.some(
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);

  const applyJobHandler = async () => {
    try {
<<<<<<< HEAD
      const res = await axios.post(
        `${JOB_API_ENDPOINT}/apply/${jobId}`,
        {},
=======
      const res = await axios.get(
        `${APPLICATION_API_ENDPOINT}/apply/${jobId}`,
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsApplied(true);
        const updateSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updateSingleJob));
<<<<<<< HEAD
        toast.success(res.data.message);
      }
    } catch (error) {
=======
        console.log(res.data);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
      toast.error(error.response.data.message);
    }
  };

<<<<<<< HEAD
  const withdrawApplicationHandler = async () => {
    try {
      // Find the application ID for this user and job
      const application = singleJob.applications.find(
        (app) => app.applicant.toString() === user?._id.toString()
      );

      if (!application || !application._id) {
        toast.error("Application not found");
        return;
      }

      const res = await axios.delete(
        `${APPLICATION_API_ENDPOINT}/withdraw/${application._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setIsApplied(false);
        // Refetch the job data to get updated applications list
        const jobRes = await axios.get(`${JOB_API_ENDPOINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (jobRes.data.success) {
          dispatch(setSingleJob(jobRes.data.job));
          setIsApplied(
            jobRes.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        }
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to withdraw application");
    }
  };

=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
  useEffect(() => {
    const fetchSingleJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/get/${jobId}`, {
          withCredentials: true,
        });
<<<<<<< HEAD
        if (res.data.success) {
=======
        console.log("API Response:", res.data);
        if (res.data.status) {
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        } else {
          setError("Failed to fetch jobs.");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setError(error.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchSingleJobs();
  }, [jobId, dispatch, user?._id]);
<<<<<<< HEAD

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }

  if (!singleJob) {
    return <div className="text-center text-gray-500 py-8">Job not found.</div>;
=======
  console.log("single jobs", singleJob);

  if (!singleJob) {
    return <div>Loading...</div>;
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
  }

  return (
    <div>
      <div className="max-w-7xl mx-auto my-10 ">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-xl ">{singleJob?.title}</h1>
            <div className=" flex gap-2 items-center mt-4 ">
              <Badge className={" text-blue-600 font-bold"} variant={"ghost"}>
                {singleJob?.position} Open Positions
              </Badge>
              <Badge className={" text-[#FA4F09] font-bold"} variant={"ghost"}>
                {singleJob?.salary}LPA
              </Badge>
              <Badge className={" text-[#6B3AC2]  font-bold"} variant={"ghost"}>
                {singleJob?.location}
              </Badge>
              <Badge className={" text-black font-bold"} variant={"ghost"}>
                {singleJob?.jobType}
              </Badge>
            </div>
          </div>
<<<<<<< HEAD
          <div className="flex gap-2">
=======
          <div>
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
            <Button
              onClick={isApplied ? null : applyJobHandler}
              disabled={isApplied}
              className={`rounded-lg ${
                isApplied
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#6B3AC2] hover:bg-[#552d9b]"
              }`}
            >
              {isApplied ? "Already Applied" : "Apply"}
            </Button>
<<<<<<< HEAD
            {isApplied && (
              <Button
                onClick={withdrawApplicationHandler}
                variant="outline"
                size="sm"
                className="text-red-600 hover:text-red-800 border-red-300 hover:border-red-500"
              >
                <Trash2 size={16} className="mr-1" />
                Withdraw
              </Button>
            )}
=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
          </div>
        </div>
        <h1 className="border-b-2 border-b-gray-400 font-medium py-4">
          {singleJob?.description}
        </h1>
<<<<<<< HEAD

        {/* ✅ TACIT Meter */}
        <TacitMeter tacit={tacit} />

=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
        <div className="my-4">
          <h1 className="font-bold my-1 ">
            Role:{" "}
            <span className=" pl-4 font-normal text-gray-800">
              {singleJob?.position} Open Positions
            </span>
          </h1>
          <h1 className="font-bold my-1 ">
            Location:{" "}
            <span className=" pl-4 font-normal text-gray-800">
              {" "}
              {singleJob?.location}
            </span>
          </h1>
          <h1 className="font-bold my-1 ">
            Salary:{" "}
            <span className=" pl-4 font-normal text-gray-800">
              {singleJob?.salary} LPA
            </span>
          </h1>
          <h1 className="font-bold my-1 ">
            Experience:{" "}
            <span className=" pl-4 font-normal text-gray-800">
              {singleJob?.experienceLevel} Year
            </span>
          </h1>
          <h1 className="font-bold my-1 ">
            Total Applicants:{" "}
            <span className=" pl-4 font-normal text-gray-800">
              {singleJob?.applications?.length}
            </span>
          </h1>
          <h1 className="font-bold my-1 ">
            Job Type:
            <span className=" pl-4 font-normal text-gray-800">
              {singleJob?.jobType}
            </span>
          </h1>
          <h1 className="font-bold my-1 ">
            Post Date:
            <span className=" pl-4 font-normal text-gray-800">
              {singleJob?.createdAt.split("T")[0]}
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Description;
