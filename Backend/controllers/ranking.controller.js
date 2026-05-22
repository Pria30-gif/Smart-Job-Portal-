import rankingService from "../services/ranking.service.js";
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

/**
 * Get ranked applications for a job
 */
export const getRankedApplications = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;

    // Check if job exists and user is the owner
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      });
    }

    if (job.created_by.toString() !== userId) {
      return res.status(403).json({
        message: "You can only view rankings for your own jobs",
        success: false
      });
    }

    const rankedApplications = await rankingService.rankApplications(jobId);

    res.status(200).json({
      message: "Applications ranked successfully",
      rankings: rankedApplications,
      success: true
    });

  } catch (error) {
    console.error("Error getting ranked applications:", error);
    res.status(500).json({
      message: "Failed to get ranked applications",
      success: false
    });
  }
};

/**
 * Get shortlisted candidates for a job with fairness metrics
 */
export const getShortlistedCandidates = async (req, res) => {
  try {
    const jobId = req.params.id;
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.id;

    // Check if job exists and user is the owner
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      });
    }

    if (job.created_by.toString() !== userId) {
      return res.status(403).json({
        message: "You can only view shortlisted candidates for your own jobs",
        success: false
      });
    }

    const result = await rankingService.getShortlistedCandidates(jobId, limit);

    res.status(200).json({
      message: "Shortlisted candidates retrieved successfully",
      candidates: result.candidates,
      fairnessMetrics: result.fairnessMetrics,
      success: true
    });

  } catch (error) {
    console.error("Error getting shortlisted candidates:", error);
    res.status(500).json({
      message: "Failed to get shortlisted candidates",
      success: false
    });
  }
};

/**
 * Reveal candidate identities after shortlisting
 */
export const revealCandidates = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { applicationIds } = req.body;
    const userId = req.id;

    // Check if job exists and user is the owner
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      });
    }

    if (job.created_by.toString() !== userId) {
      return res.status(403).json({
        message: "You can only reveal candidates for your own jobs",
        success: false
      });
    }

    if (!applicationIds || !Array.isArray(applicationIds)) {
      return res.status(400).json({
        message: "Application IDs array is required",
        success: false
      });
    }

    const revealedCandidates = await rankingService.revealCandidates(jobId, applicationIds);

    res.status(200).json({
      message: "Candidate identities revealed successfully",
      candidates: revealedCandidates,
      success: true
    });

  } catch (error) {
    console.error("Error revealing candidates:", error);
    res.status(500).json({
      message: "Failed to reveal candidates",
      success: false
    });
  }
};
