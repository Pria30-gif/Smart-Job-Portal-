// Backend/routes/api/recruiter.js

import express from "express";
// 👇 FINAL, CORRECTED PATHS that match your exact filenames
import { Application } from "../../models/application.model.js";
import { Job } from "../../models/job.model.js";
import { User } from "../../models/usermodel.js";
import authenticateToken from "../../middleware/isAuthenticated.js";

const router = express.Router();

// GET all ranked applicants for a specific job
router.get("/jobs/:jobId/applicants", authenticateToken, async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found." });
        }

        const applications = await Application.find({ job: jobId }).populate({
            path: 'applicant',
            model: 'User',
            select: 'fullname email profile'
        });

        if (!applications) {
            return res.json({ jobTitle: job.title, rankedApplicants: [] });
        }

        const rankedApplicants = applications.map(app => {
            const applicantProfile = app.applicant.profile;
            const resumeText = (applicantProfile.resumeText || "").toLowerCase();
            let matchScore = 0;
            let matchedSkills = [];

            (job.skills || []).forEach(skill => {
                if (resumeText.includes(skill.toLowerCase())) {
                    matchScore++;
                    matchedSkills.push(skill);
                }
            });

            const matchPercentage = (job.skills.length > 0) 
                ? ((matchScore / job.skills.length) * 100).toFixed(0) 
                : 0;

            return {
                ...app.toObject(),
                matchScore,
                matchPercentage,
                matchedSkills
            };
        });

        rankedApplicants.sort((a, b) => b.matchScore - a.matchScore);

        return res.json({ jobTitle: job.title, rankedApplicants });
    } catch (error) {
        console.error("Error fetching applicants:", error.message);
        return res.status(500).json({ message: "Server Error" });
    }
});

export default router;