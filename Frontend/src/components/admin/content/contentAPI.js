import axios from "axios";

export const createContentPost = (data) =>
  axios.post("/api/content/create", data);

export const getABResult = () =>
  axios.get("/api/content/ab-result");
