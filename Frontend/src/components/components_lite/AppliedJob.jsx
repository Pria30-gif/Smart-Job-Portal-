import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
<<<<<<< HEAD
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import useWithdrawApplication from "@/hooks/useWithdrawApplication";

const AppliedJob = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);
  const withdrawApplication = useWithdrawApplication();
=======
import { useSelector } from "react-redux";

const AppliedJob = () => {
  const { allAppliedJobs } = useSelector((store) => store.job);
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
  return (
    <div>
      <Table>
        <TableCaption>Recent Applied Jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
<<<<<<< HEAD
            <TableHead className="text-right">Action</TableHead>
=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAppliedJobs.length <= 0 ? (
<<<<<<< HEAD
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                You have not applied any job yet.
              </TableCell>
            </TableRow>
=======
            <span>You have not applied any job yet. </span>
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
          ) : (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob._id}>
                <TableCell>{appliedJob?.createdAt.split("T")[0]}</TableCell>
                <TableCell>{appliedJob.job?.title}</TableCell>
                <TableCell>{appliedJob.job?.company.name}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={`${
                      appliedJob?.status === "rejected"
                        ? "bg-red-500"
                        : appliedJob?.status === "accepted"
                        ? "bg-green-600"
                        : "bg-gray-500"
                    }`}
                  >
<<<<<<< HEAD
                    {appliedJob?.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {appliedJob?.status === "pending" && (
                    <Button
                      onClick={() => withdrawApplication(appliedJob._id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
=======
                    {" "}
                    {appliedJob?.status}
                  </Badge>{" "}
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJob;
