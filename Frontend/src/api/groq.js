// src/api/groq.js
import axios from "axios";

// Optional: set a default model here
const DEFAULT_MODEL = "llama3-7b"; // replace with a valid model

// Main Groq API call
export const askGroq = async (prompt, model = DEFAULT_MODEL) => {
  try {
<<<<<<< HEAD
    const response = await axios.post("http://localhost:5000/api/groq/ask", {
=======
    const response = await axios.post("http://localhost:5011/api/groq/ask", {
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
      prompt,
      model,
    });

    return response.data.result;
  } catch (err) {
    console.error("Groq API error:", err.response?.data || err.message);

    if (err.response?.data?.error) {
      return `Error: ${err.response.data.error}`;
    }

    return "Error: Something went wrong. Please try again.";
  }
};

// Wrapper function for career advisor
export const askCareerAdvisor = async (prompt) => {
  try {
    const response = await askGroq(prompt);
    return response;
  } catch (err) {
    console.error("Career Advisor error:", err);
    return "Error: Something went wrong.";
  }
};
