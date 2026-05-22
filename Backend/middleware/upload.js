import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "..", "uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files allowed"));
    }
    cb(null, true);
  },
});
import express from "express";
import multer from "multer";
import pdfParse from 'pdf-parse';


const router = express.Router();


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const dataBuffer = fs.readFileSync('resume.pdf');

pdfParse(dataBuffer).then(function(data) {
    console.log(data.text); 
});

router.post("/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No resume uploaded" });
    }


    let parsed;
    try {
      parsed = await pdfParse(req.file.buffer);
    } catch (err) {
      console.error("PDF parse error:", err);
      return res.status(400).json({
        message: "Invalid or scanned PDF. Upload text-based resume.",
      });
    }


    const text = parsed.text?.trim();


    if (!text || text.length < 50) {
      return res.status(400).json({
        message: "This document doesn't appear to be a resume",
      });
    }


    // ===== ATS LOGIC =====
    const skills = [];
    const technical = [];


    if (/react/i.test(text)) skills.push("React");
    if (/javascript/i.test(text)) skills.push("JavaScript");
    if (/node\.js|node/i.test(text)) skills.push("Node.js");
    if (/mongodb/i.test(text)) technical.push("MongoDB");
    if (/sql/i.test(text)) technical.push("SQL");


    // Allow ATS to compute full 0-100 range (previously capped at 95)
    const atsScore = Math.min(
      100,
      50 + skills.length * 10 + technical.length * 5
    );


    res.json({
      atsScore,
      skills,
      technical,
      improvements: [
        "Add quantified achievements",
        "Match keywords from job description",
        "Use strong action verbs",
      ],
      summary:
        "Good technical foundation, but resume can improve with clearer impact and metrics.",
    });
  } catch (err) {
    console.error("❌ Resume analysis error:", err);
    res.status(500).json({ message: "Resume analysis failed" });
  }
});


export default router;

<input 
  type="file" 
  accept="application/pdf" 
  onChange={(e) => handleUpload(e.target.files[0])} 
/>