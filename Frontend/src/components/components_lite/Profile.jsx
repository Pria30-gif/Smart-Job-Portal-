<<<<<<< HEAD
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Pen, Trash2, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
=======
import React, { useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Mail, Pen } from "lucide-react";
import { Badge } from "../ui/badge";
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
import AppliedJob from "./AppliedJob";
import EditProfileModal from "./EditProfileModal";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAllAppliedJobs";
<<<<<<< HEAD
import axios from "axios";
import { USER_API_ENDPOINT } from "../../utils/data";
import { toast } from "sonner";

const Profile = () => {
    const { user } = useSelector((store) => store.auth);

    // This hook will only be called if the user is not a recruiter.
    useGetAppliedJobs();

    const [open, setOpen] = useState(false);
    const [resumes, setResumes] = useState(user?.profile?.resumes || []);

    const removeResume = async (resumeId) => {
        try {
            const res = await axios.post(
                `${USER_API_ENDPOINT}/profile/remove-resume`,
                { resumeId },
                { withCredentials: true }
            );
            if (res.data.success) {
                toast.success("Resume removed successfully");
                setResumes(resumes.filter((r) => r._id !== resumeId));
            } else {
                toast.error("Failed to remove resume");
            }
        } catch (error) {
            console.error("Error removing resume:", error);
            toast.error("Error removing resume");
        }
    };

    const getInitials = (name) => {
        if (!name) return "U";
        const names = name.split(' ');
        return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase() : name[0].toUpperCase();
    };

    return (
        <div>
            <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8 shadow-lg">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-5">
                        <Avatar className="cursor-pointer h-24 w-24">
                            <AvatarImage src={user?.profile?.profilePhoto} alt="@profile" />
                            <AvatarFallback className="text-3xl">{getInitials(user?.fullname)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="font-bold text-2xl">{user?.fullname}</h1>
                                {user?.role === 'recruiter' && <Badge variant="outline" className="border-indigo-500 text-indigo-600">Recruiter</Badge>}
                            </div>
                            <p className="text-gray-600 mt-1">{user?.profile?.bio || (user?.role === 'recruiter' ? "Managing recruitment for their organization." : "No bio available.")}</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => setOpen(true)}
                        className="text-right"
                        variant="outline"
                    >
                        <Pen />
                    </Button>
                </div>

                <div className="my-5 border-t pt-5">
                    <div className="flex items-center gap-3 my-2">
                        <Mail />
                        <span>
                            <a href={`mailto:${user?.email}`}>{user?.email}</a>
                        </span>
                    </div>
                </div>

                <div className="my-5 border-t pt-5">
                    <h1 className="font-bold text-lg mb-2">Skills</h1>
                    <div className="flex flex-wrap gap-2 items-center">
                        {user?.profile?.skills?.length > 0 ? (
                            user?.profile?.skills.map((item, index) => (
                                <Badge key={index}>{item}</Badge>
                            ))
                        ) : (
                            <span className="text-gray-500">No skills added.</span>
                        )}
                    </div>
                </div>

                {user?.role !== 'recruiter' && (
                    <>
                        <div className="my-5 border-t pt-5">
                            <h1 className="font-bold text-lg mb-2">Resumes</h1>
                            <div>
                                {resumes.length > 0 ? (
                                    resumes.map((resume) => (
                                        <div key={resume._id} className="flex items-center justify-between my-1">
                                            <a
                                                target="_blank"
                                                href={resume.url}
                                                className="text-blue-600 hover:underline cursor-pointer"
                                                rel="noopener noreferrer"
                                            >
                                                {resume.originalName}
                                            </a>
                                            <button
                                                onClick={() => removeResume(resume._id)}
                                                className="ml-2 text-red-600 hover:text-red-800"
                                                title="Remove Resume"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-gray-500">No resumes uploaded.</span>
                                )}
                            </div>
                        </div>

                        <div className="my-5 border-t pt-5">
                            <h1 className="font-bold text-lg mb-2">Applied Jobs</h1>
                            <AppliedJob />
                        </div>
                    </>
                )}
            </div>
            <EditProfileModal open={open} setOpen={setOpen} />
        </div>
    );
};

// eslint-disable-next-line
export default Profile;

=======

const isResume = true;

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  return (
    <div>
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8 shadow shadow-gray-400 hover:shadow-yellow-400">
        <div className="flex justify-between">
          <div className="flex items-center gap-5">
            <Avatar className="cursor-pointer h-24 w-24">
              <AvatarImage src={user?.profile?.profilePhoto} alt="@profile" />
            </Avatar>
            <div>
              <h1 className="font-medium text-xl">{user?.fullname}</h1>
              <p>{user?.profile?.bio}</p>
            </div>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="text-right"
            variant="outline"
          >
            <Pen />
          </Button>
        </div>

        {/* Email only */}
        <div className="my-5">
          <div className="flex items-center gap-3 my-2">
            <Mail />
            <span>
              <a href={`mailto:${user?.email}`}>{user?.email}</a>
            </span>
          </div>
        </div>

        {/* Skills */}
        <div className="my-5">
          <h1>Skills</h1>
          <div className="flex flex-wrap gap-2 items-center">
            {user?.profile?.skills?.length > 0 ? (
              user?.profile?.skills.map((item, index) => (
                <Badge key={index}>{item}</Badge>
              ))
            ) : (
              <span>NA</span>
            )}
          </div>
        </div>

        {/* Resume */}
        <div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label className="text-md font-bold"> Resume</label>
            <div>
              {isResume ? (
                <a
                  target="_blank"
                  href={user?.profile?.resume}
                  className="text-blue-600 hover:underline cursor-pointer"
                  rel="noopener noreferrer"
                >
                  Download {user?.profile?.resumeOriginalName}
                </a>
              ) : (
                <span>No Resume Found</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Applied Jobs */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl">
        <h1 className="text-lg my-5 font-bold">Applied Jobs</h1>
        <AppliedJob />
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal open={open} setOpen={setOpen} />
    </div>
  );
};

export default Profile;
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
