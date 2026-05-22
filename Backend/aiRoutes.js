<<<<<<< HEAD

import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import multer from "multer";
import { spawn } from "child_process";
import path from "path";

dotenv.config();
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// --- RESUME ANALYZER ROUTE ---
router.post("/resume-analyze", async (req, res) => {
    try {
        const { resumeText } = req.body;

        if (!resumeText || resumeText.trim() === "") {
            return res.status(400).json({ error: "Resume text is required." });
        }

        // Truncate text if too long (Gemini has limits)
        const truncatedText = resumeText.length > 5000 ? resumeText.substring(0, 5000) + "..." : resumeText;

        // Check if it looks like a resume
        const resumeKeywords = ["experience", "education", "skills", "work", "resume", "cv", "professional"];
        const hasResumeKeywords = resumeKeywords.some(keyword => truncatedText.toLowerCase().includes(keyword));
        if (!hasResumeKeywords) {
            return res.json({ analysis: "**Error:** This does not appear to be a resume. Please upload a valid resume PDF." });
        }

        const prompt = `
            You are an expert resume analyzer for a smart job portal.
            Analyze the following resume text and provide a concise, professional analysis.
            Structure your response into these sections using markdown formatting:
            1.  **Summary:** A brief overview of the candidate's profile.
            2.  **Strengths:** Identify 2-3 key strengths.
            3.  **Areas for Improvement:** Suggest 2-3 specific and actionable improvements.
            4.  **Keyword Optimization:** List 5-7 relevant keywords missing from the resume.
            5.  **ATS Score:** Provide an ATS compatibility score and concise explanation.

            Keep the tone constructive and professional.

            Resume Text:
            ---
            ${truncatedText}
            ---
        `;

        const lowerText = truncatedText.toLowerCase();
        const skillKeywords = [
            'javascript', 'react', 'node', 'python', 'sql', 'agile', 'leadership', 'html', 'css', 'mongodb', 'express', 'typescript', 'aws', 'docker', 'git', 'rest', 'api', 'ci/cd', 'testing'
        ];

        const skills = skillKeywords.filter((keyword) => lowerText.includes(keyword)).map((keyword) => {
            if (keyword === 'node') return 'Node.js';
            if (keyword === 'express') return 'Express.js';
            if (keyword === 'ci/cd') return 'CI/CD';
            return keyword.charAt(0).toUpperCase() + keyword.slice(1);
        });

        const sectionChecks = [
            { name: 'Experience', regex: /\b(experience|work history|employment|projects)\b/ },
            { name: 'Skills', regex: /\b(skills|technologies|tech stack|proficiencies)\b/ },
            { name: 'Education', regex: /\b(education|degree|university|college|bachelor|master|phd)\b/ },
            { name: 'Summary', regex: /\b(summary|professional summary|profile|about me)\b/ },
            { name: 'Certifications', regex: /\b(certification|certified|credentials)\b/ },
        ];

        const matchedSections = sectionChecks.filter((section) => section.regex.test(lowerText)).map((section) => section.name);
        const sectionCoverage = matchedSections.length;
        const sectionScore = Math.min(40, sectionCoverage * 8);

        const achievementsFound = /\b(achieved|optimized|reduced|increased|improved|designed|led|managed|built|launched|delivered)\b/i.test(truncatedText) ? 10 : 0;
        const wordCount = truncatedText.split(/\s+/).filter(Boolean).length;
        const lengthScore = wordCount >= 200 ? 5 : 0;
        const skillScore = Math.min(20, skills.length * 4);

        const atsScore = Math.min(
            100,
            Math.max(
                0,
                30 + sectionScore + skillScore + achievementsFound + lengthScore
            )
        );

        const matchedKeywords = skills.slice(0, 7);
        const suggestedKeywords = [
            'Team Collaboration', 'Problem Solving', 'Project Management', 'Communication', 'Leadership', 'AWS', 'CI/CD', 'Automation', 'Data Analysis', 'Testing'
        ].filter((keyword) => !lowerText.includes(keyword.toLowerCase())).slice(0, 7);

        const experience = lowerText.includes('experience') ? 'experienced' : 'entry-level';
        const education = lowerText.includes('bachelor') || lowerText.includes('master') ? 'well-educated' : 'skilled';

        const analysis = `
**ATS Score:** ${atsScore}/100

**Summary:** This resume appears to be for a ${experience} professional in tech, ${education} with skills in ${skills.slice(0, 3).join(', ') || 'various technologies'}.

**Strengths:**
- ${skills.length > 0 ? `Technical skills in ${skills.slice(0, 3).join(', ')}.` : 'Relevant experience in the field.'}
- ${matchedSections.length > 0 ? `Includes strong section coverage for ${matchedSections.join(', ')}.` : 'Good overall structure with room for stronger section headings.'}

**Areas for Improvement:**
- Add more quantifiable achievements and results.
- Tailor the resume language to include relevant keywords and action verbs.
- Improve section headings and formatting for better ATS parsing.

**Keyword Optimization:** ${matchedKeywords.length > 0 ? matchedKeywords.join(', ') : 'JavaScript, React, Node.js, Python, SQL'}.
**Suggested Keywords to Add:** ${suggestedKeywords.join(', ')}.
        `;

        res.json({
            analysis,
            atsScore,
            matchedKeywords,
            suggestedKeywords,
            matchedSections,
            wordCount,
            sectionCoverage,
        });

    } catch (error) {
        console.error("Resume processing error:", error);
        res.status(500).json({ error: "Failed to process resume." });
    }
});

// Career Coach route
router.post("/groq/ask", async (req, res) => {
    try {
        const { prompt, model, apiKey } = req.body;

        if (!prompt || prompt.trim() === "" || !apiKey) {
            return res.status(400).json({ error: "Prompt and apiKey are required." });
        }

        const groqClient = new Groq({
            apiKey: apiKey,
        });

        const chatCompletion = await groqClient.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: model || "llama3-8b-8192",
        });

        const result = chatCompletion.choices[0]?.message?.content || "No response generated.";

        res.json({ result });

    } catch (error) {
        console.error("Groq API Error:", error.response?.data?.error || error.message);
        res.status(500).json({ error: "Failed to get response from Groq AI." });
    }
});

// Validate GROQ API key (quick health check)
router.get('/groq/validate', async (req, res) => {
    if (!process.env.GROQ_API_KEY) {
        return res.status(400).json({ valid: false, message: 'GROQ_API_KEY not set' });
    }

    try {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const resp = await Promise.race([
            groq.chat.completions.create({ messages: [{ role: 'user', content: 'Say ok' }], model: 'llama-3.3-70b-versatile', max_tokens: 5 }),
            new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 5000))
        ]);

        const ok = !!resp?.choices?.[0]?.message?.content;
        return res.json({ valid: ok });
    } catch (err) {
        console.error('GROQ validate error:', err?.message || err);
        return res.status(500).json({ valid: false, message: err?.message || 'Validation failed' });
    }
});

// Resume Analyzer with file upload
router.post("/analyze-resume", upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const jobDescription = req.body.job_description || "";
        const filePath = req.file.path;

        // Call Python script
        const pythonProcess = spawn('python', [
            path.join(process.cwd(), 'resume_analyzer.py'),
            filePath,
            jobDescription
        ]);

        let result = '';
        let errorOutput = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        pythonProcess.on('close', (code) => {
            // Clean up uploaded file
            try {
                require('fs').unlinkSync(filePath);
            } catch (err) {
                console.warn('Failed to clean up file:', err);
            }

            if (code !== 0) {
                console.error('Python script error:', errorOutput);
                return res.status(500).json({ error: "Analysis failed", details: errorOutput || "Unknown error" });
            }

            try {
                const analysisResult = JSON.parse(result);
                res.json(analysisResult);
            } catch (parseError) {
                console.error('JSON parse error:', parseError, 'Result:', result);
                res.status(500).json({ error: "Invalid response format", details: parseError.message });
            }
        });

        pythonProcess.on('error', (error) => {
            console.error('Process error:', error);
            res.status(500).json({ error: "Analysis process failed" });
        });

    } catch (error) {
        console.error("Resume analysis error:", error);
        res.status(500).json({ error: "Failed to analyze resume" });
    }
});

// User Resume Analyzer endpoint (separate from admin screening)
router.post("/user/analyze-resume", upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const jobDescription = req.body.jobDescription || "";
        const filePath = req.file.path;

        // Call Python script
        const pythonProcess = spawn('python', [
            path.join(process.cwd(), 'resume_analyzer.py'),
            filePath,
            jobDescription
        ]);

        let result = '';
        let errorOutput = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        pythonProcess.on('close', (code) => {
            // Clean up uploaded file
            try {
                require('fs').unlinkSync(filePath);
            } catch (err) {
                console.warn('Failed to clean up file:', err);
            }

            if (code !== 0) {
                console.error('Python script error:', errorOutput);
                return res.status(500).json({ error: "Analysis failed", details: errorOutput || "Unknown error" });
            }

            try {
                const analysisResult = JSON.parse(result);

                // Transform the response to match user component expectations
                const userFormat = {
                    ats_score: analysisResult.matchPercentage || 0,
                    semantic_similarity: analysisResult.matchPercentage || 0,
                    matched_keywords: [], // Will be populated from skills/extracted info
                    missing_keywords: [], // Will be populated from gaps
                    analysis: {
                        overview: analysisResult.summary || "Analysis completed",
                        strength_points: analysisResult.strengths || [],
                        suggestions: analysisResult.gaps || [],
                        present_skills: analysisResult.extractedInfo?.skills || []
                    }
                };

                // Extract keywords from strengths and gaps for matched/missing
                if (analysisResult.strengths) {
                    userFormat.matched_keywords = analysisResult.strengths
                        .filter(strength => strength.toLowerCase().includes('skill') || strength.toLowerCase().includes('experience'))
                        .map(strength => strength.replace(/[^\w\s]/g, '').trim())
                        .filter(keyword => keyword.length > 2);
                }

                if (analysisResult.gaps) {
                    userFormat.missing_keywords = analysisResult.gaps
                        .filter(gap => gap.toLowerCase().includes('missing') || gap.toLowerCase().includes('lack'))
                        .map(gap => gap.replace(/[^\w\s]/g, '').trim())
                        .filter(keyword => keyword.length > 2);
                }

                res.json(userFormat);
            } catch (parseError) {
                console.error('JSON parse error:', parseError, 'Result:', result);
                res.status(500).json({ error: "Invalid response format", details: parseError.message });
            }
        });

        pythonProcess.on('error', (error) => {
            console.error('Process error:', error);
            res.status(500).json({ error: "Analysis process failed" });
        });

    } catch (error) {
        console.error("User resume analysis error:", error);
        res.status(500).json({ error: "Failed to analyze resume" });
    }
});

// You can add other AI-related routes here.

export default router;

=======
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/career-coach", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Call Gemini with career guidance prompt
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",  // ✅ valid role
            parts: [{ text: message }]
          }
        ]
      },
      { headers: { "Content-Type": "application/json" } }
    );

    // Log response for debugging
    console.log("Full Gemini Response:");
    console.log(JSON.stringify(response.data, null, 2));

    // Extract AI reply
    let aiReply = "No reply found.";
    const candidates = response.data?.candidates || [];

    for (const candidate of candidates) {
      const parts = candidate.content?.parts || [];
      for (const part of parts) {
        if (part.text) {
          aiReply = part.text;
          break;
        }
      }
      if (aiReply !== "No reply found.") break;
    }

    res.json({ reply: aiReply });

  } catch (error) {
    console.error("AI API Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Internal Server Error",
      details: error.response?.data || error.message
    });
  }
});

export default router;
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
