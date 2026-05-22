import { Job } from "../models/job.model.js";
import mongoose from "mongoose";

// helper
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

// normalize into 0–1
const normalize = (value, max) => clamp(value / max, 0, 1);

const getDifficulty = (scarcityIndex) => {
  if (scarcityIndex >= 70) return "HARD";
  if (scarcityIndex >= 40) return "MEDIUM";
  return "EASY";
};

// ✅ Trend analyzer: compare jobs posted last 7 days vs previous 7 days
const getTrendScore = async (job) => {
  const keyword = job?.title?.split(" ")[0] || "";

  // For demo purposes, simulate trend based on job popularity
  // In real implementation, this would use actual posting dates
  const jobCount = await Job.countDocuments({
    title: { $regex: keyword, $options: "i" }
  });

  // Simulate higher demand for popular job types
  const baseTrend = jobCount > 5 ? 150 : jobCount > 2 ? 100 : 50;
  const randomVariation = Math.random() * 50 - 25; // -25 to +25

  return clamp(baseTrend + randomVariation, -100, 200);
};

// ✅ Salary Gap: compare this job salary with average for same role
const getSalaryGap = async (job) => {
  const keyword = job?.title?.split(" ")[0] || "";

  const similarJobs = await Job.find({
    title: { $regex: keyword, $options: "i" },
    _id: { $ne: job._id } // Exclude current job
  }).select('salary');

  if (similarJobs.length === 0) {
    // If no similar jobs, simulate a gap based on job type
    const jobSalary = parseFloat(job?.salary) || 0;
    const marketAvg = jobSalary * (0.9 + Math.random() * 0.2); // 90-110% of job salary
    const gap = marketAvg === 0 ? 0 : ((jobSalary - marketAvg) / marketAvg) * 100;
    return clamp(gap, -50, 50);
  }

  // Calculate average salary from similar jobs
  const salaries = similarJobs
    .map(j => parseFloat(j.salary) || 0)
    .filter(s => s > 0);

  if (salaries.length === 0) {
    return 0;
  }

  const avgSalary = salaries.reduce((sum, s) => sum + s, 0) / salaries.length;
  const jobSalary = parseFloat(job?.salary) || 0;

  if (avgSalary === 0) return 0;

  const gap = ((jobSalary - avgSalary) / avgSalary) * 100;
  return clamp(gap, -100, 100);
};

// ✅ Scarcity Index: based on demand, skills, experience requirement
const getScarcityIndex = async (job) => {
  const totalJobs = await Job.countDocuments({});
  const keyword = job?.title?.split(" ")[0] || "";

  // Count jobs with similar titles (demand indicator)
  const similarJobsCount = await Job.countDocuments({
    title: { $regex: keyword, $options: "i" }
  });

  // Higher scarcity for specialized roles
  const specializationMultiplier = keyword.toLowerCase().includes('ai') ||
                                   keyword.toLowerCase().includes('ml') ||
                                   keyword.toLowerCase().includes('blockchain') ? 1.5 : 1.0;

  const demandRarity = totalJobs === 0 ? 50 : (1 - similarJobsCount / totalJobs) * 100;
  const experienceRarity = (parseInt(job?.experienceLevel) || 0) * 8; // 0-40
  const positionAvailability = clamp(100 - (job?.position || 1) * 10, 0, 100);

  const scarcity = (demandRarity * 0.4 + experienceRarity * 0.3 + positionAvailability * 0.3) * specializationMultiplier;

  return clamp(scarcity, 0, 100);
};

// ✅ GET TACIT Analytics
export const getTacitAnalytics = async (req, res) => {
  try {
    const jobId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // ✅ Calculate all metrics in parallel
    const [scarcityIndex, demandTrend, salaryGap] = await Promise.all([
      getScarcityIndex(job),
      getTrendScore(job),
      getSalaryGap(job),
    ]);

    const difficulty = getDifficulty(scarcityIndex);

    const tacit = {
      scarcityIndex: parseFloat(scarcityIndex.toFixed(2)),
      demandTrend: parseFloat(demandTrend.toFixed(2)),
      salaryGap: parseFloat(salaryGap.toFixed(2)),
      difficulty,
    };

    res.status(200).json({
      success: true,
      tacit,
      message: "TACIT analytics fetched successfully",
    });
  } catch (error) {
    console.error("TACIT Analytics Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching TACIT analytics",
      error: error.message,
    });
  }
};
