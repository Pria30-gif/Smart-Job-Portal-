import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/usermodel.js";
import { scoreResumeDirect } from "../controllers/aiController.js";
import anonymizationService from "./anonymization.service.js";
import biasDetectionService from "./biasDetection.service.js";

class RankingService {
  /**
   * Rank applications for a job based on skill matching and resume scoring
   * @param {string} jobId - Job ID to rank applications for
   * @returns {Promise<Array>} - Ranked applications with scores
   */
  async rankApplications(jobId) {
    try {
      // Get job details
      const job = await Job.findById(jobId).populate('company');
      if (!job) {
        throw new Error('Job not found');
      }

      // Get all applications for this job
      const applications = await Application.find({ job: jobId })
        .populate('applicant')
        .sort({ createdAt: 1 }); // Sort by application date

      if (applications.length === 0) {
        return [];
      }

      // Prepare job description for scoring
      const jobDescription = `
Title: ${job.title}
Description: ${job.description}
Requirements: ${job.requirements.join(', ')}
Experience Level: ${job.experienceLevel}
Location: ${job.location}
      `.trim();

      // Score each application
      const scoredApplications = await Promise.all(
        applications.map(async (application, index) => {
          try {
            // Get applicant's resume
            const applicant = application.applicant;
            const resume = applicant.profile.resumes?.[0]; // Get first resume

            if (!resume) {
              return {
                application,
                score: 0,
                rank: 0,
                reasons: ['No resume uploaded'],
                anonymized: false
              };
            }

            // Extract text from resume
            const resumePath = resume.url; // Assuming this is a file path
            const resumeText = await anonymizationService.extractText(resumePath);

            if (!resumeText || resumeText.trim().length === 0) {
              return {
                application,
                score: 0,
                rank: 0,
                reasons: ['Could not extract resume text'],
                anonymized: false
              };
            }

            // Score the resume against job description
            const scoreResult = await this.scoreResume(resumeText, jobDescription);

            return {
              application,
              score: scoreResult.score,
              rank: 0, // Will be set after sorting
              reasons: scoreResult.analysis ? [scoreResult.analysis] : [],
              anonymized: true
            };

          } catch (error) {
            console.error(`Error scoring application ${application._id}:`, error);
            return {
              application,
              score: 0,
              rank: 0,
              reasons: [`Scoring error: ${error.message}`],
              anonymized: false
            };
          }
        })
      );

      // Sort by score (descending) and assign ranks
      scoredApplications.sort((a, b) => b.score - a.score);

      scoredApplications.forEach((item, index) => {
        item.rank = index + 1;
      });

      return scoredApplications;

    } catch (error) {
      console.error('Error ranking applications:', error);
      throw error;
    }
  }

  /**
   * Score a resume against job description using AI
   * @param {string} resumeText - Resume text content
   * @param {string} jobDescription - Job description
   * @returns {Promise<Object>} - Scoring result
   */
  async scoreResume(resumeText, jobDescription) {
    try {
      // Use the direct scoring function from aiController
      const result = await scoreResumeDirect(resumeText, jobDescription);

      if (!result.success) {
        throw new Error(result.error || 'Resume scoring failed');
      }

      // Use the score directly if available, otherwise parse from analysis
      let score = result.score;
      if (score === null || score === undefined) {
        const analysis = result.analysis || '';
        const scoreMatch = analysis.match(/(\d+)\/100/);
        score = scoreMatch ? parseInt(scoreMatch[1]) : 0;
      }

      return {
        score: Math.min(100, Math.max(0, score)), // Ensure score is between 0-100
        analysis: result.analysis || 'No analysis available'
      };

    } catch (error) {
      console.error('Error scoring resume:', error);
      return {
        score: 0,
        analysis: 'Scoring failed'
      };
    }
  }

  /**
   * Get shortlisted candidates (top N applications) with fairness metrics
   * @param {string} jobId - Job ID
   * @param {number} limit - Number of candidates to shortlist
   * @returns {Promise<Object>} - Shortlisted applications and fairness metrics
   */
  async getShortlistedCandidates(jobId, limit = 10) {
    const rankedApplications = await this.rankApplications(jobId);
    const candidates = rankedApplications.slice(0, limit);

    // Analyze bias and fairness metrics
    const biasAnalysis = biasDetectionService.analyzeBias(rankedApplications);

    return {
      candidates,
      fairnessMetrics: biasAnalysis
    };
  }

  /**
   * Reveal candidate identities after shortlisting
   * @param {string} jobId - Job ID
   * @param {Array} shortlistedApplicationIds - IDs of shortlisted applications
   * @returns {Promise<Array>} - Revealed candidate details
   */
  async revealCandidates(jobId, shortlistedApplicationIds) {
    try {
      const applications = await Application.find({
        _id: { $in: shortlistedApplicationIds },
        job: jobId
      }).populate({
        path: 'applicant',
        select: 'fullname email profile.skills profile.resumes'
      });

      return applications.map(app => ({
        applicationId: app._id,
        candidate: {
          id: app.applicant._id,
          name: app.applicant.fullname,
          email: app.applicant.email,
          skills: app.applicant.profile.skills,
          resumes: app.applicant.profile.resumes
        },
        appliedAt: app.createdAt,
        status: app.status
      }));

    } catch (error) {
      console.error('Error revealing candidates:', error);
      throw error;
    }
  }
}

export default new RankingService();
