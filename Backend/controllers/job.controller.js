import { Job } from "../models/job.model.js";
<<<<<<< HEAD
import { User } from "../models/usermodel.js";
import { Application } from "../models/application.model.js";
import { createNotification } from "./notification.controller.js";
import { scoreResumeDirect } from "./aiController.js";
import anonymizationService from "../services/anonymization.service.js";
import fakeJobDetectionService from "../services/fakeJobDetection.service.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import axios from "axios";

// Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const location = req.query.location || "";
    const technology = req.query.technology || "";
    const experience = req.query.experience || "";
    const salary = req.query.salary || "";

    let query = {};
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Technology filter
    if (technology) {
      query.requirements = { $elemMatch: { $regex: technology, $options: "i" } };
    }

    // Experience filter
    if (experience) {
      if (experience === "0-3 years") {
        query.experienceLevel = { $in: ["1", "2", "3"] };
      } else if (experience === "3-5 years") {
        query.experienceLevel = { $in: ["3", "4", "5"] };
      } else if (experience === "5-7 years") {
        query.experienceLevel = { $in: ["5", "6", "7"] };
      } else if (experience === "7+ years") {
        query.experienceLevel = { $gte: "7" };
      }
    }

    // Salary filter
    if (salary) {
      if (salary === "0-50k") {
        query.salary = { $gte: 0, $lt: 50000 };
      } else if (salary === "50k-100k") {
        query.salary = { $gte: 50000, $lt: 100000 };
      } else if (salary === "100k-200k") {
        query.salary = { $gte: 100000, $lt: 200000 };
      } else if (salary === "200k+") {
        query.salary = { $gte: 200000 };
      }
    }

    const jobs = await Job.find(query).populate({
      path: "company",
      select: "name logo",
    }).sort({ createdAt: -1 });

    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false
      });
    }

    return res.status(200).json({
      jobs,
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// Get job by ID
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
    });
    if (!job) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false
      });
    }
    return res.status(200).json({ job, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// Get admin jobs
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({
        message: "Jobs not found.",
        success: false
      });
    }
    return res.status(200).json({
      jobs,
      success: true
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// Get matching candidates for a job
export const getMatchingCandidates = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false
      });
    }

    // Check if user is the job owner
    if (job.created_by.toString() !== userId) {
      return res.status(403).json({
        message: "You are not authorized to view candidates for this job.",
        success: false
      });
    }

    // Get all applications for this job
    const applications = await Application.find({ job: jobId })
      .populate({
        path: "applicant",
        select: "fullname email phone skills experience"
      })
      .populate({
        path: "job",
        select: "title requirements experienceLevel"
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      candidates: applications,
      success: true,
      message: "Candidates retrieved successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

//Admin job posting
=======

// Admin: Post new job
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req.id;

<<<<<<< HEAD
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    // Perform fake job detection
    const jobDataForDetection = {
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
    };

    const detectionResult = await fakeJobDetectionService.detectFakeJob(jobDataForDetection);

    if (detectionResult.isFake && detectionResult.recommendation === 'reject') {
      return res.status(400).json({
        message: "Job posting flagged as potentially fake and rejected.",
        detection: detectionResult,
        success: false,
      });
=======
    if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
      return res.status(400).json({ message: "All fields are required", success: false });
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: userId,
<<<<<<< HEAD
      status: detectionResult.recommendation === 'approve' ? 'live' : 'pending_review',
    });

    // Only notify if job goes live
    if (job.status === 'live') {
      try {
        const students = await User.find({
          role: { $in: ["student", "Student"] }
        }).select("_id");

        const notificationPromises = students.map(student =>
          createNotification(
            student._id.toString(),
            'new_job_posted',
            'New Job Posted',
            `A new job "${title}" has been posted at ${location}. Check it out!`,
            job._id.toString()
          )
        );

        await Promise.all(notificationPromises);
        console.log(`Notified ${students.length} students about new job posting`);
      } catch (notifyError) {
        console.log("Error sending job posting notifications:", notifyError);
      }
    }

    res.status(201).json({
      message: job.status === 'live' ? "Job posted successfully." : "Job submitted for review.",
      job,
      detection: detectionResult,
      status: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

// Update job
export const updateJob = async (req, res) => {
  try {
    const { title, description, requirements, salary, location, jobType, experience, position } = req.body;
    const jobId = req.params.id;
    const userId = req.id;

    let job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false
      });
    }

    // check if this user is the owner of this job
    if (job.created_by.toString() !== userId) {
      return res.status(403).json({
        message: "You can only update your own jobs.",
        success: false
      });
    }

    // updating data
    if (title) job.title = title;
    if (description) job.description = description;
    if (requirements) job.requirements = requirements.split(",");
    if (salary) job.salary = salary;
    if (location) job.location = location;
    if (jobType) job.jobType = jobType;
    if (experience) job.experienceLevel = experience;
    if (position) job.position = position;

    await job.save();

    // Notify applicants about job update
    try {
      const applications = await Application.find({ job: jobId }).populate('applicant');
      const notificationPromises = applications.map(app =>
        createNotification(
          app.applicant._id.toString(),
          'job_updated',
          'Job Updated',
          `The job "${job.title}" has been updated. Please check for changes.`,
          jobId
        )
      );

      await Promise.all(notificationPromises);
      console.log(`Notified ${applications.length} applicants about job update`);
    } catch (notifyError) {
      console.log("Error sending job update notifications:", notifyError);
    }

    return res.status(200).json({
      message: "Job information updated.",
      job,
      success: true
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// Custom Resume Screening with LLM Multi-Agent System
export const screenResume = async (req, res) => {
  try {
    const userId = req.id;

    // Handle file upload
    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required.",
        success: false
      });
    }

    const resumePath = req.file.path;
    let resumeText;

    // Extract text using anonymization service (supports PDF, DOCX, TXT)
    try {
      resumeText = await anonymizationService.extractText(resumePath);
    } catch (extractError) {
      console.error('Text extraction error:', extractError);
      return res.status(400).json({
        message: "Failed to extract text from resume. Please ensure the file is a valid PDF, DOCX, or TXT document.",
        success: false
      });
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({
        message: "No text content found in the resume file. Please upload a text-based resume.",
        success: false
      });
    }

    // Multi-Agent LLM Processing

    let extractedData, evaluation, summary;

    try {
      console.log('Starting LLM processing for resume screening...');
      // Agent 1: Extractor - Extract key info from resume
      const extractorPrompt = `Extract the following from this resume text: name, email, phone, skills (list), experience (years and roles), education, certifications. Return the result as a valid JSON object with keys: name, email, phone, skills (array), experience, education, certifications. Resume: ${resumeText}`;
      console.log('Calling extractor LLM...');
      const extractorResponse = await callLLM(extractorPrompt);
      console.log('Extractor response:', extractorResponse);
      extractedData = JSON.parse(extractorResponse);

      // Agent 2: Evaluator - General evaluation
      const evaluatorPrompt = `Evaluate this resume generally. Candidate data: ${JSON.stringify(extractedData)}. Provide scores (0-10) for: skill_diversity, experience_level, overall_quality. Return the result as a valid JSON object with keys: skill_diversity, experience_level, overall_quality, explanation.`;
      console.log('Calling evaluator LLM...');
      const evaluatorResponse = await callLLM(evaluatorPrompt);
      console.log('Evaluator response:', evaluatorResponse);
      evaluation = JSON.parse(evaluatorResponse);

      // Agent 3: Summarizer - Provide summary and recommendation
      const summarizerPrompt = `Summarize the evaluation: ${JSON.stringify(evaluation)}. Candidate: ${JSON.stringify(extractedData)}. Give a general assessment and suggestions for improvement.`;
      console.log('Calling summarizer LLM...');
      summary = await callLLM(summarizerPrompt);
      console.log('Summarizer response:', summary);
    } catch (llmError) {
      console.error('LLM processing error:', llmError);
      console.error('Error details:', llmError.response?.data || llmError.message);
      // Fallback: provide basic response without LLM
      extractedData = {
        name: 'Unknown',
        email: 'Unknown',
        phone: 'Unknown',
        skills: [],
        experience: 'Unknown',
        education: 'Unknown',
        certifications: []
      };
      evaluation = {
        skill_diversity: 5,
        experience_level: 5,
        overall_quality: 5,
        explanation: 'Unable to process with AI. Basic evaluation provided.'
      };
      summary = 'Resume screening completed with basic analysis due to AI processing error.';
    }

    // Clean up uploaded file
    fs.unlinkSync(resumePath);

    return res.status(200).json({
      message: "Resume screened successfully.",
      extractedData,
      evaluation,
      summary,
      success: true
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

// Screen individual applicant resume
export const screenApplicantResume = async (req, res) => {
  try {
    const { jobId, applicationId } = req.params;
    const userId = req.id;

    // Verify the job belongs to the user
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false
      });
    }

    if (job.created_by.toString() !== userId) {
      return res.status(403).json({
        message: "You are not authorized to screen applicants for this job.",
        success: false
      });
    }

    // Get the application
    const application = await Application.findById(applicationId).populate('applicant');
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false
      });
    }

    if (application.job.toString() !== jobId) {
      return res.status(400).json({
        message: "Application does not belong to this job.",
        success: false
      });
    }

    // Check if resume exists
    const resume = application.applicant.profile?.resumes?.[0];
    const storedResumeText = application.applicant.profile?.resumeText;

    if (!resume && !storedResumeText) {
      return res.status(400).json({
        message: "No resume found for this applicant.",
        success: false
      });
    }

    console.log('Resume object:', resume);
    console.log('Resume URL:', resume?.url);
    console.log('Stored resume text available:', !!storedResumeText);

    // Extract text from resume
    let resumeText;
    try {
      if (storedResumeText && storedResumeText.trim().length > 0) {
        // Use stored resume text if available
        resumeText = storedResumeText;
        console.log('Using stored resume text, length:', resumeText.length);
      } else if (resume?.url) {
        console.log('Starting text extraction for URL:', resume.url);
        resumeText = await anonymizationService.extractText(resume.url);
        console.log('Extracted text length:', resumeText?.length);
        if (!resumeText || resumeText.trim().length === 0) {
          throw new Error('Could not extract text from resume');
        }
      } else {
        throw new Error('No resume text available');
      }
    } catch (extractError) {
      console.error('Resume text extraction error:', extractError);
      return res.status(400).json({
        message: "Could not process the resume file.",
        success: false,
        details: "Failed to extract text from resume",
        error: extractError.message
      });
    }

    // Prepare job description
    const jobDescription = `
Title: ${job.title}
Description: ${job.description}
Requirements: ${job.requirements.join(', ')}
Experience Level: ${job.experienceLevel}
Location: ${job.location}
    `.trim();

    // Score the resume using AI
    try {
      console.log('Starting AI scoring...');
      console.log('Resume text preview:', resumeText.substring(0, 200));
      console.log('Job description:', jobDescription);
      const scoreResult = await scoreResumeDirect(resumeText, jobDescription);

      return res.status(200).json({
        message: "Resume screened successfully.",
        success: true,
        score: scoreResult.score,
        analysis: scoreResult.analysis,
        applicantName: application.applicant.fullname,
        jobTitle: job.title
      });

    } catch (aiError) {
      console.error('AI scoring error:', aiError);
      return res.status(500).json({
        message: "Failed to analyze resume with AI.",
        success: false,
        error: aiError.message || "AI service error",
        details: "Please check your API configuration or try again later."
      });
    }

  } catch (error) {
    console.error('Resume screening error:', error);
    return res.status(500).json({
      message: "Server Error during resume screening",
      success: false
    });
  }
};

// Helper function to call LLM (using OpenAI API)
const callLLM = async (prompt) => {
  try {
    const Groq = (await import('groq-sdk')).default;
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
      temperature: 0.3,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('LLM call failed:', error);
    throw new Error('LLM processing failed');
=======
    });

    res.status(201).json({ message: "Job posted successfully", job, status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", status: false });
  }
};

// Get all jobs for users (search keyword optional)
export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const jobs = await Job.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ]
    })
      .populate("company")
      .sort({ createdAt: -1 });

    if (!jobs.length) return res.status(404).json({ message: "No jobs found", status: false });
    res.status(200).json({ jobs, status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", status: false });
  }
};

// Get jobs posted by admin
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate("company").sort({ createdAt: -1 });
    if (!jobs.length) return res.status(404).json({ message: "No jobs found", status: false });
    res.status(200).json({ jobs, status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", status: false });
  }
};

// Get job by ID
export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate("applications");
    if (!job) return res.status(404).json({ message: "Job not found", status: false });
    res.status(200).json({ job, status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", status: false });
  }
};

// Get all jobs by company
export const getJobsByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params;
    const jobs = await Job.find({ company: companyId }).sort({ createdAt: -1 });
    if (!jobs.length) return res.status(404).json({ message: "No jobs found for this company", status: false });
    res.status(200).json({ jobs, status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", status: false });
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
  }
};
