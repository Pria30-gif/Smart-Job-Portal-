// routes/api/resume.js

import express from "express";
import multer from "multer";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

import authenticateToken from "../../middleware/isAuthenticated.js";
import { User } from "../../models/usermodel.js";
import skills from "../../utils/skillsList.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", authenticateToken, async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }
    
    try {
        const user = await User.findById(req.id);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        const dataBuffer = req.file.buffer;
        const data = await pdf(dataBuffer);
        const resumeText = data.text;

        // 1. Extract skills (this part works reliably)
        const extractedSkills = skills.filter(skill => resumeText.toLowerCase().includes(skill.toLowerCase()));
        user.profile.skills = [...new Set(extractedSkills)];
        
        // 2. Save the full, raw text for recruiter screening
        user.profile.resumeText = resumeText;
        
        await user.save();

        res.json({
            message: "Resume analyzed successfully! Skills have been updated.",
            data: { skills: user.profile.skills }
        });
    } catch (error) {
        console.error("Resume upload error:", error.message);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;