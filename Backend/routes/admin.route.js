// Simple admin routes that won't crash the server
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { PDFParse } from 'pdf-parse';
import AIService from '../services/ai.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT files are allowed'));
    }
  }
});

// Simple test route
router.get("/test", (req, res) => {
  res.json({ message: "Admin routes working", timestamp: new Date().toISOString() });
});

// Resume analyzer endpoint with AI
router.post("/resume-analyzer", upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const jobDescription = req.body.jobDescription || '';

    console.log("📄 Analyzing resume:", filePath);

    let resumeText = '';
    try {
      if (req.file.mimetype === 'application/pdf') {
        const fileBuffer = fs.readFileSync(filePath);
        const parser = new PDFParse(new Uint8Array(fileBuffer));
        const parsed = await parser.getText();
        resumeText = parsed.text || '';
      } else if (req.file.mimetype === 'text/plain') {
        resumeText = fs.readFileSync(filePath, 'utf8');
      } else {
        return res.status(400).json({ error: 'Unsupported file type' });
      }

      if (!resumeText.trim()) {
        return res.status(400).json({ error: 'Unable to extract text from resume' });
      }

      let responsePayload;
      if (jobDescription.trim()) {
        const matchAnalysis = await AIService.matchResumeToJob(resumeText, jobDescription);
        const matchedSkills = Array.isArray(matchAnalysis.skillMatch?.matchedSkills)
          ? matchAnalysis.skillMatch.matchedSkills
          : [];
        const missingSkills = Array.isArray(matchAnalysis.skillMatch?.missingSkills)
          ? matchAnalysis.skillMatch.missingSkills
          : [];
        const suggestions = [];

        if (matchAnalysis.experienceMatch?.assessment) {
          suggestions.push(matchAnalysis.experienceMatch.assessment);
        }
        if (matchAnalysis.educationMatch?.assessment) {
          suggestions.push(matchAnalysis.educationMatch.assessment);
        }
        if (missingSkills.length) {
          suggestions.push(`Missing skills: ${missingSkills.join(', ')}`);
        }
        if (matchAnalysis.recommendation) {
          suggestions.push(`Recommendation: ${matchAnalysis.recommendation}`);
        }

        responsePayload = {
          success: true,
          matchPercentage: Number(matchAnalysis.matchScore) || 0,
          atsScore: Number(matchAnalysis.matchScore) || 0,
          technicalScore: Number(matchAnalysis.skillMatch?.score) || 0,
          overallFit: matchAnalysis.recommendation?.toUpperCase() || 'CONSIDER',
          strengths: Array.isArray(matchAnalysis.strengths) ? matchAnalysis.strengths : [],
          weaknesses: Array.isArray(matchAnalysis.concerns) ? matchAnalysis.concerns : [],
          extractedSkills: matchedSkills,
          experience: {
            years: Number(matchAnalysis.experienceMatch?.candidateYears) || 0,
            roles: [],
          },
          education: matchAnalysis.educationMatch?.candidateDegree || '',
          summary: matchAnalysis.summary || '',
          keywordsMatched: matchedSkills,
          suggestions,
          recommendation: matchAnalysis.recommendation || '',
          timestamp: new Date().toISOString(),
        };
      } else {
        const analysis = AIService.localResumeAnalysis(resumeText);
        responsePayload = {
          success: true,
          atsScore: analysis.atsScore || 0,
          technicalScore: analysis.atsScore || 0,
          overallFit:
            analysis.atsScore >= 80
              ? 'STRONG'
              : analysis.atsScore >= 50
              ? 'CONSIDER'
              : 'WEAK',
          strengths: analysis.strengths || [],
          weaknesses: analysis.weaknesses || [],
          extractedSkills: analysis.skills || [],
          experience: analysis.experience || { years: 0, roles: [] },
          education: [
            analysis.education?.degree,
            analysis.education?.field,
            analysis.education?.university
          ]
            .filter(Boolean)
            .join(', '),
          summary: analysis.summary || '',
          areasForImprovement: analysis.weaknesses || [],
          skills: analysis.skills || [],
          keywordsMatched: analysis.skills || [],
          timestamp: new Date().toISOString()
        };
      }

      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });

      res.json(responsePayload);
    } catch (analysisError) {
      console.error('Resume analyzer error:', analysisError);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
      res.status(500).json({ error: 'Analysis failed', details: analysisError.message });
    }

  } catch (error) {
    console.error('Resume analyzer error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
});

export default router;
