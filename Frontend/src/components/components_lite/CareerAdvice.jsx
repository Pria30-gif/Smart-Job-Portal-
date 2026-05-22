import React from "react";

const adviceList = [
  "Tailor your resume for each job application.",
  "Highlight your skills with real-world projects.",
  "Network with professionals in your field.",
  "Keep learning new technologies and tools.",
  "Prepare for interviews by practicing common questions.",
];

const CareerAdvice = () => (
  <div className="bg-blue-50 p-4 rounded shadow mb-4">
    <h2 className="font-bold mb-2">AI Career Advice</h2>
    <ul>
      {adviceList.map((tip, idx) => (
        <li key={idx}>• {tip}</li>
      ))}
    </ul>
  </div>
);

export default CareerAdvice;