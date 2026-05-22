import express from 'express';

const app = express();
const PORT = 5011;

// Simple routes
app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.post("/api/admin/resume-analyzer", (req, res) => {
  res.json({
    success: true,
    message: "Resume analyzer is working",
    atsScore: 75,
    technicalScore: 70,
    overallFit: "GOOD",
    strengths: ["Good experience", "Technical skills"],
    weaknesses: ["Could improve communication"],
    extractedSkills: ["JavaScript", "React", "Node.js"],
    experience: { years: 3, roles: ["Developer"] },
    education: "Bachelor's Degree",
    summary: "Good candidate with solid technical background",
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});