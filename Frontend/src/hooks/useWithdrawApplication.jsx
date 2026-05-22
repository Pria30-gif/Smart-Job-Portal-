import { removeAppliedJob } from "@/redux/jobSlice";
import { APPLICATION_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const useWithdrawApplication = () => {
  const dispatch = useDispatch();

  const withdrawApplication = async (applicationId) => {
    try {
      const res = await axios.delete(`${APPLICATION_API_ENDPOINT}/withdraw/${applicationId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(removeAppliedJob(applicationId));
        toast.success("Application withdrawn successfully");
      } else {
        toast.error(res.data.message || "Failed to withdraw application");
      }
    } catch (error) {
      console.error("Withdraw Error:", error);
      toast.error(error.response?.data?.message || "An error occurred while withdrawing the application");
    }
  };

  return withdrawApplication;
};

export default useWithdrawApplication;
