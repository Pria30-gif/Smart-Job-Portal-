import axios from "axios";
import fs from "fs";

export const analyzeMockInterview = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file received" });
    }

    const filePath = req.file.path;

    // Simulated AI Response
    const mockAIResponse = {
      final_score_0_100: 78,
      clarity: 8,
      tone: 7,
      confidence: 8,
      eye_contact: 7,
      filler_words: 3,
      communication: 8,
      ai_comment: "Good job! Improve tone variation and reduce filler words.",
      suggestions: [
        "Try to speak with energy and confidence.",
        "Keep your posture straight.",
        "Reduce filler words like umm, okay."
      ],
      transcripts: "Hello, I am applying for full stack developer role..."
    };

    fs.unlinkSync(filePath); // DELETE FILE AFTER USE ✅

    res.json({
      message: "Interview analyzed",
      feedback: mockAIResponse,
    });

  } catch (error) {
    console.error("AI analysis error:", error);
    res.status(500).json({ error: "Failed to analyze interview" });
  }
};
