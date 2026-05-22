<<<<<<< HEAD
import mongoose from "mongoose";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { createNotification } from "./notification.controller.js";

=======
// controllers/application.controller.js
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// Apply for a job
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
<<<<<<< HEAD
    if (!jobId) {
      return res
        .status(400)
        .json({ message: "Invalid job id", success: false });
    }
    // check if the user already has applied for this job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }
    //check if the job exists or not
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }
    // create a new application

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });
    job.applications.push(newApplication._id);
    await job.save();

    // Create notification for job application
    await createNotification(
      userId,
      'application_status',
      'Application Submitted',
      `Your application for ${job.title} at ${job.company.name} has been submitted successfully.`,
      jobId
    );

    return res
      .status(201)
      .json({ message: "Application submitted", success: true });
  } catch (error) {
    console.error(error);
=======
    if (!jobId) return res.status(400).json({ message: "Invalid job id", success: false });

    const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
    if (existingApplication)
      return res.status(400).json({ message: "Already applied", success: false });

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found", success: false });

    const newApplication = await Application.create({ job: jobId, applicant: userId });
    job.applications.push(newApplication._id);
    await job.save();

    res.status(201).json({ message: "Application submitted", success: true });
  } catch (err) {
    console.error(err);
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
    res.status(500).json({ message: "Server error", success: false });
  }
};

<<<<<<< HEAD
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    
    // Return empty array if not authenticated
    if (!userId) {
      return res.status(200).json({ application: [], success: true });
    }
    
    let application;
    try {
      application = await Application.find({ applicant: userId })
        .sort({ createdAt: -1 })
        .populate({
          path: "job",
          options: { sort: { createdAt: -1 } },
          populate: { path: "company", options: { sort: { createdAt: -1 } } },
        });
    } catch (dbError) {
      console.log("Database not available, returning mock application data");
      application = [
        {
          _id: "app1",
          job: {
            _id: "mock1",
            title: "Software Engineer",
            description: "Develop and maintain web applications",
            company: {
              name: "Tech Corp"
            }
          },
          status: "pending",
          createdAt: new Date()
        }
      ];
    }
    
    if (!application || application.length === 0) {
      return res.status(200).json({ application: [], success: true });
    }

    return res.status(200).json({ application, success: true });
  } catch (error) {
    console.error(error);
=======
// Get jobs user applied to
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({ path: "job", populate: { path: "company" } });

    res.status(200).json({ applications, success: true });
  } catch (err) {
    console.error(err);
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
    res.status(500).json({ message: "Server error", success: false });
  }
};

<<<<<<< HEAD
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    console.log("Getting applicants for job ID:", jobId);

    if (!jobId || !mongoose.isValidObjectId(jobId)) {
      console.log("Invalid job ID provided:", jobId);
      return res.status(400).json({ message: "Invalid job id", success: false });
    }

    const job = await Job.findOne({ _id: jobId }).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
        options: { sort: { createdAt: -1 } },
        select: "fullname email profile"
      },
    });

    if (!job) {
      console.log("Job not found for ID:", jobId);
      return res.status(404).json({ message: "Job not found", success: false });
    }

    console.log("Found job:", job.title, "with", job.applications?.length || 0, "applications");

    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.error("Error in getApplicants:", error);
=======
// Get applicants for a job
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      populate: { path: "applicant" },
    });

    if (!job) return res.status(404).json({ message: "Job not found", success: false });

    // Include match_score placeholder if ML ranking not applied
    const rankedApplicants = job.applications.map((app) => ({
      _id: app._id,
      applicant: app.applicant,
      match_score: app.match_score || 0,
    }));

    res.status(200).json({ jobTitle: job.title, rankedApplicants, success: true });
  } catch (err) {
    console.error(err);
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
    res.status(500).json({ message: "Server error", success: false });
  }
};

<<<<<<< HEAD
=======
// Update application status (accept/reject)
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
<<<<<<< HEAD
    if (!status) {
      return res.status(400).json({
        message: "status is required",
        success: false,
      });
    }

    // find the application by applicantion id
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false,
      });
    }

    // update the status
    application.status = status.toLowerCase();
    await application.save();

    return res
      .status(200)
      .json({ message: "Application status updated", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// NEW FUNCTION to update application status by a recruiter
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!status) {
            return res.status(400).json({ message: "Status is required.", success: false });
        }

        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ message: "Application not found.", success: false });
        }

        // Update the status
        application.status = status;
        await application.save();

        // Create notification for status update
        const job = await Job.findById(application.job).populate('company');
        if (job) {
            await createNotification(
                application.applicant,
                'application_status',
                'Application Status Updated',
                `Your application for ${job.title} at ${job.company.name} has been ${status}.`,
                application.job
            );
        }

        return res.status(200).json({
            message: "Application status updated successfully.",
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to update application status." });
    }
};

// WITHDRAW APPLICATION
export const withdrawApplication = async (req, res) => {
  try {
    const userId = req.id;
    const applicationId = req.params.id;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }

    if (application.applicant.toString() !== userId) {
      return res.status(403).json({
        message: "You can only withdraw your own applications",
        success: false,
      });
    }

    // Remove application from job's applications array
    const job = await Job.findById(application.job);
    if (job) {
      job.applications = job.applications.filter(
        (appId) => appId.toString() !== applicationId
      );
      await job.save();
    }

    // Delete the application
    await Application.findByIdAndDelete(applicationId);

    return res.status(200).json({
      message: "Application withdrawn successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error withdrawing application",
      success: false,
    });
  }
};

=======
    if (!status) return res.status(400).json({ message: "status required", success: false });

    const application = await Application.findById(applicationId);
    if (!application) return res.status(404).json({ message: "Application not found", success: false });

    application.status = status.toLowerCase();
    await application.save();

    res.status(200).json({ message: "Status updated", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", success: false });
  }
};
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
