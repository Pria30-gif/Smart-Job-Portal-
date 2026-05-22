import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  allJobs: [],
<<<<<<< HEAD
  allAdminJobs: [], // This will hold
  singleJob: null, // This will hold the job details when a user clicks on a job
  searchJobByText: "",
  allAppliedJobs: [], // This will hold
  searchedQuery: "",
  postedJobs: [], // This will hold jobs posted by the admin
  filters: {
    location: "",
    technology: "",
    experience: "",
    salary: "",
  },
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    setAllJobs(state, action) {
      state.allJobs = action.payload; // Update state with fetched jobs
    },
    setSingleJob(state, action) {
      state.singleJob = action.payload; // Update state with fetched job details
    },
    setAllAdminJobs(state, action) {
      state.allAdminJobs = action.payload; // Update state with fetched admin jobs
=======
  allAdminJobs: [],
  singleJob: null,
  searchJobByText: "",
  allAppliedJobs: [],
  searchedQuery: "",
};

const jobSlice = createSlice({
  name: "job", // match the store key
  initialState,
  reducers: {
    setAllJobs(state, action) {
      state.allJobs = action.payload;
    },
    setSingleJob(state, action) {
      state.singleJob = action.payload;
    },
    setAllAdminJobs(state, action) {
      state.allAdminJobs = action.payload;
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
    },
    setSearchJobByText(state, action) {
      state.searchJobByText = action.payload;
    },
    setAllAppliedJobs(state, action) {
      state.allAppliedJobs = action.payload;
    },
    setSearchedQuery(state, action) {
      state.searchedQuery = action.payload;
    },
<<<<<<< HEAD
    setPostedJobs(state, action) {
      state.postedJobs = action.payload;
    },
    removeAppliedJob(state, action) {
      state.allAppliedJobs = state.allAppliedJobs.filter(job => job._id !== action.payload);
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters(state) {
      state.filters = {
        location: "",
        technology: "",
        experience: "",
        salary: "",
      };
    },
=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
  },
});

export const {
  setAllJobs,
  setSingleJob,
  setAllAdminJobs,
  setSearchJobByText,
  setAllAppliedJobs,
  setSearchedQuery,
<<<<<<< HEAD
  setPostedJobs,
  removeAppliedJob,
  setFilters,
  clearFilters,
} = jobSlice.actions;
export default jobSlice.reducer;
=======
} = jobSlice.actions;

export default jobSlice.reducer;
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
