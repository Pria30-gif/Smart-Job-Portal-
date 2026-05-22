import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { JOB_API_ENDPOINT } from "@/utils/data";

// ✅ cache across component renders
const tacitCache = new Map();

const useTacit = (jobId) => {
  const [tacit, setTacit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // prevent setting state after unmount
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchTacit = async () => {
      if (!jobId) return;

      // ✅ return cached value if available
      if (tacitCache.has(jobId)) {
        setTacit(tacitCache.get(jobId));
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`${JOB_API_ENDPOINT}/tacit/${jobId}`, {
          withCredentials: true,
        });

        if (isMounted.current) {
          if (res.data.success) {
            tacitCache.set(jobId, res.data.tacit);
            setTacit(res.data.tacit);
          } else {
            setError("Failed to fetch TACIT analytics");
          }
        }
      } catch (err) {
        if (isMounted.current) {
          console.error("TACIT fetch error:", err);
          setError(err.response?.data?.message || "Error fetching TACIT data");
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchTacit();
  }, [jobId]);

  return { tacit, loading, error };
};

export default useTacit;
