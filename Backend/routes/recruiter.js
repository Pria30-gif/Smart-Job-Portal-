import express from "express";
import axios from "axios";
import authenticateToken from "../middleware/isAuthenticated.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

const router = express.Router();

router.get("/jobs/:id/applicants", authenticateToken, async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ message: "Job not found", success: false });

        const applications = await Application.find({ job: jobId }).populate("applicant");

        const payload = {
            job_text: job.title + " " + job.description,
            applicants: applications.map(app => ({
                id: app._id,
                resume_text: app.applicant.profile?.resume || ""
            }))
        };

        const mlRes = await axios.post("http://localhost:5001/shortlist", payload);
        const rankedApplicants = mlRes.data;

        res.json({ jobTitle: job.title, rankedApplicants });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", success: false });
    }
});

export default router;
