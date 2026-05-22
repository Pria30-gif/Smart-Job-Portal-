import React, { useState } from "react";

// This assumes resumes are uploaded & stored with a URL accessible for download/screening
const mockApplicants = [
  {
    id: 1,
    name: "Krish",
    position: "Frontend Developer",
    resumeUrl: "/uploads/resumes/1694051234567_resume.pdf", // Example local or S3/Cloudinary URL
  },
  {
    id: 2,
    name: "Radhika",
    position: "Backend Developer",
    resumeUrl: "/uploads/resumes/1694056543210_resume.docx",
  },
];

const ResumeScreening = () => {
  const [applicants, setApplicants] = useState(mockApplicants);

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>Resume Screening Panel</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Resume</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map(app => (
            <tr key={app.id}>
              <td>{app.name}</td>
              <td>{app.position}</td>
              <td>
                <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" download>
                  Download
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResumeScreening;
