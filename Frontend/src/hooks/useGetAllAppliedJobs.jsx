import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_ENDPOINT } from "@/utils/data";
import axios from "axios";
import { useEffect, useState } from "react";
<<<<<<< HEAD
import { useDispatch, useSelector } from "react-redux";

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth);
=======
import { useDispatch } from "react-redux";

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
<<<<<<< HEAD
    if (!user) {
      // Don't fetch if user is not logged in
      return;
    }

    const fetchAppliedJobs = async () => {
=======
    const fetchAppliedJobs = async () => {
      // ✅ Check if token exists in localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        // no login → don’t call API, just reset data
        dispatch(setAllAppliedJobs([]));
        return;
      }

>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`${APPLICATION_API_ENDPOINT}/get`, {
<<<<<<< HEAD
=======
          headers: {
            Authorization: `Bearer ${token}`,
          },
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
          withCredentials: true,
        });

        console.log("API Response (Applied Jobs):", JSON.stringify(res.data, null, 2));

        if (res.data.success) {
          dispatch(setAllAppliedJobs(res.data.application || []));
        } else {
          setError(res.data.message || "Failed to fetch applied jobs.");
        }
      } catch (err) {
        console.error("Fetch Error (Applied Jobs):", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
<<<<<<< HEAD
  }, [dispatch, user]);

  // Return loading and error so the component can show feedback if needed
=======
  }, [dispatch]);

>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
  return { loading, error };
};

export default useGetAppliedJobs;
