<<<<<<< HEAD
/* @ts-nocheck */
import React, { useEffect } from "react";
import Job1 from "./Job1";
import FilterJobs from "./FilterJobs";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "../../redux/jobSlice";
import useGetAllJobs from "../../hooks/useGetAllJobs";
=======
import React, { useEffect } from "react";
import Job1 from "./Job1";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e

const Browse = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((store) => store.job);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto my-10">
      <h1 className="font-bold text-xl my-10">
<<<<<<< HEAD
        Search Results ({allJobs.length})
      </h1>
      <FilterJobs />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
=======
        Search Results {allJobs.length}
      </h1>
      <div className="grid grid-cols-3 gap-4">
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
        {allJobs.map((job) => {
          return <Job1 key={job._id} job={job} />;
        })}
      </div>
    </div>
  );
};

export default Browse;
