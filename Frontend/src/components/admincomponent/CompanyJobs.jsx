import React, { useEffect, useState } from "react";
import Navbar from "../components_lite/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowLeft, Eye, Loader2 } from "lucide-react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { toast } from "sonner";

const JOB_API_ENDPOINT = "/api/jobs"; // ✅ updated endpoint to match backend

const CompanyJobs = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!companyId) return;

    const fetchCompanyJobs = async () => {
      setIsFetching(true);
      try {
        const res = await axios.get(`${JOB_API_ENDPOINT}/company/${companyId}`, {
          withCredentials: true,
        });
        // ensure res.data.jobs exists
        setJobs(res.data.jobs ?? []);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        toast.error(
          error.response?.data?.message || "Failed to load company jobs."
        );
      } finally {
        setIsFetching(false);
      }
    };

    fetchCompanyJobs();
  }, [companyId]);

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center gap-5 p-8">
          <Button
            onClick={() => navigate("/admin/companies")}
            variant="outline"
            className="flex items-center gap-2 text-gray-500 font-semibold"
          >
            <ArrowLeft />
            <span>Back to Companies</span>
          </Button>
          <h1 className="font-bold text-3xl text-gray-800">
            Jobs Posted by Company
          </h1>
        </div>

        {isFetching ? (
          <div className="text-center py-10">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-red-500" />
            <p className="mt-2 text-gray-600">Loading jobs...</p>
          </div>
        ) : (
          <Table className="shadow-lg border rounded-lg">
            <TableCaption>List of jobs for this company</TableCaption>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[40%]">Job Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Posted On</TableHead>
                <TableHead className="text-right">Applicants</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan="4"
                    className="text-center text-gray-500 py-8"
                  >
                    No jobs posted for this company yet.
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow
                    key={job._id}
                    className="hover:bg-red-50/50 transition-colors"
                  >
                    <TableCell className="font-medium text-lg">
                      {job.title}
                    </TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>
                      {job.createdAt?.split("T")[0] ?? "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() =>
                          navigate(`/admin/jobs/${job._id}/applicants`)
                        }
                        className="bg-red-600 hover:bg-red-700 transition-colors shadow-md"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-1" /> View Applicants
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default CompanyJobs;
