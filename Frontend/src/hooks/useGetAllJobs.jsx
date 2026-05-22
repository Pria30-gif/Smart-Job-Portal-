import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAllJobs } from "@/redux/jobSlice";
import { JOB_API_ENDPOINT } from "@/utils/data";

const useGetAllJobs = () => {
<<<<<<< HEAD
    const dispatch = useDispatch();
    const { searchedQuery, filters } = useSelector((store) => store.job);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchAllJobs = async () => {
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams();
                if (searchedQuery) params.append("keyword", searchedQuery);
                if (filters?.location) params.append("location", filters.location);
                if (filters?.technology) params.append("technology", filters.technology);
                if (filters?.experience) params.append("experience", filters.experience);
                if (filters?.salary) params.append("salary", filters.salary);

                const url = `${JOB_API_ENDPOINT}/get?${params.toString()}`;

                const res = await axios.get(url, {
                    signal: controller.signal,
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                });

                dispatch(setAllJobs(res.data.jobs || []));
            } catch (err) {
                if (axios.isCancel(err)) {
                    // request was aborted — expected during cleanup
                    return;
                }
                console.error("Fetch Error (Jobs):", err);
                setError(err.response?.data?.message || err.message || "An unexpected error occurred.");
                dispatch(setAllJobs([]));
            } finally {
                setLoading(false);
            }
        };

        fetchAllJobs();

        return () => controller.abort();
    }, [dispatch, searchedQuery, filters]);

    return { loading, error };
};

export default useGetAllJobs;
=======
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `${JOB_API_ENDPOINT}/get?keyword=${encodeURIComponent(
            searchedQuery || ""
          )}`,
          {
            // ✅ Uncomment if backend requires authentication cookies
            // withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API Response (Jobs):", res.data);

        if (res.data?.status) {
          dispatch(setAllJobs(res.data.jobs || []));
        } else {
          setError(res.data?.message || "Failed to fetch jobs.");
          dispatch(setAllJobs([]));
        }
      } catch (err) {
        console.error("Fetch Error (Jobs):", err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "An unexpected error occurred."
        );
        dispatch(setAllJobs([]));
      } finally {
        setLoading(false);
      }
    };

    fetchAllJobs();
  }, [dispatch, searchedQuery]);

  return { loading, error };
};

export default useGetAllJobs;
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
