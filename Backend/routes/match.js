const express = require('express');
const { execFile } = require('child_process');
const router = express.Router();

router.post('/ai-match', (req, res) => {
  const { jobDescription, resumeTexts } = req.body;

  // Basic validation of inputs
  if (!jobDescription || !Array.isArray(resumeTexts)) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  // Call Python script asynchronously
  execFile('python3', ['./ai/ai_match.py', jobDescription, JSON.stringify(resumeTexts)], (error, stdout, stderr) => {
    if (error) {
      console.error("Python script error:", stderr);
      return res.status(500).json({ error: "Error executing AI match script" });
    }
    try {
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      res.status(500).json({ error: "Invalid response from AI match script" });
    }
  });
});

module.exports = router;
