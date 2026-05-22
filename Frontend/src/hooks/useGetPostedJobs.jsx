import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setPostedJobs } from "@/redux/jobSlice";
import { JOB_API_ENDPOINT } from "@/utils/data";

const useGetPostedJobs = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Create an AbortController for this request
        const controller = new AbortController();

        const fetchPostedJobs = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(
                    `${JOB_API_ENDPOINT}/getadminjobs`,
                    {
                        // Pass the signal to axios
                        signal: controller.signal,
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                );
                dispatch(setPostedJobs(res.data.jobs || []));
            } catch (err) {
                // Ignore the error if it's from the request being aborted
                if (axios.isCancel(err)) {
                    console.log("Request canceled:", err.message);
                    return;
                }
                console.error("Fetch Error (Posted Jobs):", err);
                setError(err.response?.data?.message || err.message || "An unexpected error occurred.");
                dispatch(setPostedJobs([]));
            } finally {
                setLoading(false);
            }
        };

        fetchPostedJobs();

        // Return a cleanup function
        return () => {
            // This function runs when the component unmounts or the effect re-runs
            controller.abort();
        };
    }, [dispatch]);

    return { loading, error };
};

export default useGetPostedJobs;
