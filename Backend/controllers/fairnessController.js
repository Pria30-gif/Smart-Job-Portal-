import mongoose from "mongoose";
import { Application } from "../models/application.model.js";

export const getFairnessMetrics = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId || !mongoose.isValidObjectId(jobId)) {
      return res.status(400).json({ message: "Invalid job id" });
    }

    const applications = await Application.find({ job: jobId }).populate('applicant', 'fullname email');

    if (applications.length === 0) {
      return res.json({ message: "No data available" });
    }

    const groups = {};

    applications.forEach(app => {
      const group = app.experienceRange || "Unknown";

      if (!groups[group]) {
        groups[group] = {
          total: 0,
          shortlisted: 0,
          scores: []
        };
      }

      groups[group].total++;
      if (app.status === "accepted") groups[group].shortlisted++;
      if (app.resumeScore > 0) groups[group].scores.push(app.resumeScore);
    });

    const demographicParity = Object.keys(groups).map(group => {
      const g = groups[group];
      const selectionRate = (g.shortlisted / g.total) * 100;

      const avgScore =
        g.scores.reduce((a, b) => a + b, 0) / (g.scores.length || 1);

      return {
        group,
        totalApplicants: g.total,
        shortlisted: g.shortlisted,
        selectionRate: +selectionRate.toFixed(2),
        avgScore: +avgScore.toFixed(2)
      };
    });

    const rates = demographicParity.map(d => d.selectionRate);
    const scores = demographicParity.map(d => d.avgScore);

    const maxRateDiff = Math.max(...rates) - Math.min(...rates);
    const maxScoreDiff = Math.max(...scores) - Math.min(...scores);

    let biasLevel = "Low";
    if (maxRateDiff > 20) biasLevel = "High";
    else if (maxRateDiff > 10) biasLevel = "Moderate";

    res.json({
      biasLevel,
      maxRateDiff: +maxRateDiff.toFixed(2),
      maxScoreDiff: +maxScoreDiff.toFixed(2),
      demographicParity
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
