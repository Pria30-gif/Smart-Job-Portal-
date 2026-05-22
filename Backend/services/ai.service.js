import Groq from "groq-sdk";
import skills from "../utils/skillsList.js";

export class AIService {
  static cleanAIJson(text) {
    let cleanText = (text || "").trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```\s*/, '').replace(/```\s*$/, '');
    }
    const jsonMatch = cleanText.match(/\{[\s\S]*\}$/);
    return jsonMatch ? jsonMatch[0] : cleanText;
  }
  /**
   * Get Groq client instance
   */
  static getGroqClient() {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }
    return new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  /**
   * Analyze resume text using AI to extract key information
   */
  static async analyzeResume(resumeText) {
    try {
      // Validate input
      if (!resumeText || resumeText.trim().length < 10) {
        throw new Error("Resume text is too short or empty");
      }

      const prompt = `
You are an expert HR professional and resume analyzer. Analyze the following resume text and provide a detailed analysis in JSON format.

IMPORTANT: Always return valid JSON. If information is not available, use null or empty arrays. Never return invalid JSON.

Resume Text:
${resumeText.substring(0, 4000)} // Limit text length for API

Please provide analysis in this exact JSON format:
{
  "personalInfo": {
    "name": "extracted name or null",
    "email": "extracted email or null",
    "phone": "extracted phone or null",
    "location": "extracted location or null"
  },
  "skills": ["skill1", "skill2", "skill3"],
  "experience": {
    "years": 3,
    "roles": ["role1", "role2"],
    "companies": ["company1", "company2"]
  },
  "education": {
    "degree": "highest degree or null",
    "field": "field of study or null",
    "university": "university name or null"
  },
  "projects": ["project1", "project2"],
  "certifications": ["cert1", "cert2"],
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  // Let the AI compute this per-resume; avoid biasing it with a fixed default
  "atsScore": null,
  "summary": "brief professional summary"
}

Focus on accuracy and extract only information that is clearly present. Use reasonable defaults if needed.
`;

      const groq = this.getGroqClient();
      const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-8b-8192",
        temperature: 0.1,
        max_tokens: 2000,
      });

      const analysisText = response.choices[0]?.message?.content;
      if (!analysisText) {
        throw new Error("No response from AI service");
      }

      // Clean the response to ensure it's valid JSON
      let cleanText = analysisText.trim();

      // Remove markdown code blocks if present
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/```json\s*/, '').replace(/```\s*$/, '');
      } else if (cleanText.startsWith('```')) {
        cleanText = cleanText.replace(/```\s*/, '').replace(/```\s*$/, '');
      }

      // Parse the JSON response
      let analysis;
      try {
        analysis = JSON.parse(cleanText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Raw response:", cleanText);

        // Try to extract JSON from the response
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("AI returned invalid JSON format");
        }
      }

      // Ensure all required fields exist with defaults
      return {
        personalInfo: analysis.personalInfo || {},
        skills: Array.isArray(analysis.skills) ? analysis.skills : [],
        experience: analysis.experience || { years: 0, roles: [], companies: [] },
        education: analysis.education || {},
        projects: Array.isArray(analysis.projects) ? analysis.projects : [],
        certifications: Array.isArray(analysis.certifications) ? analysis.certifications : [],
        strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
        weaknesses: Array.isArray(analysis.weaknesses) ? analysis.weaknesses : [],
        atsScore: typeof analysis.atsScore === 'number' ? analysis.atsScore : 70,
        summary: analysis.summary || "Resume analyzed successfully"
      };

    } catch (error) {
      console.error("AI Resume Analysis Error:", error);
      return this.localResumeAnalysis(resumeText);
    }
  }

  static localResumeAnalysis(resumeText) {
    const normalizedText = (resumeText || "").trim();
    const lowerText = normalizedText.toLowerCase();

    const emailMatch = normalizedText.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
    const phoneMatch = normalizedText.match(/\+?\d[\d\s().-]{7,}\d/);

    const detectedSkills = [...new Set(
      skills.filter((skill) => lowerText.includes(skill.toLowerCase()))
    )].slice(0, 20);

    const sectionHits = [
      'experience', 'education', 'skills', 'projects', 'certification', 'achievements', 'summary'
    ].reduce((count, term) => count + (lowerText.includes(term) ? 1 : 0), 0);

    const achievementHits = (normalizedText.match(/\b(achieved|built|launched|led|managed|optimized|designed|delivered|reduced|improved|increased)\b/gi) || []).length;
    const wordCount = normalizedText.split(/\s+/).filter(Boolean).length;
    const plainResume = normalizedText.replace(/\s+/g, ' ').trim();
    const summaryLines = plainResume
      .split(/[\.\n\?\!]/)
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 2);
    const summary = summaryLines.length
      ? summaryLines.join('. ') + '.'
      : 'Resume text could not be summarized.';

    const sectionScore = Math.min(30, sectionHits * 5);
    const skillScore = Math.min(20, detectedSkills.length * 1.5);
    const achievementScore = Math.min(15, achievementHits * 3);
    const lengthScore = wordCount >= 450 ? 20 : wordCount >= 300 ? 15 : wordCount >= 200 ? 10 : wordCount >= 150 ? 5 : 0;
    const contactScore = (emailMatch && phoneMatch) ? 5 : (emailMatch || phoneMatch) ? 3 : 0;

    const atsScore = Math.min(
      100,
      10 + sectionScore + skillScore + achievementScore + lengthScore + contactScore
    );

    return {
      personalInfo: {
        name: null,
        email: emailMatch ? emailMatch[0] : null,
        phone: phoneMatch ? phoneMatch[0] : null,
        location: null,
      },
      skills: detectedSkills,
      experience: { years: 0, roles: [], companies: [] },
      education: { degree: null, field: null, university: null },
      projects: [],
      certifications: [],
      strengths: detectedSkills.length
        ? [`Includes ${detectedSkills.length} relevant skills such as ${detectedSkills.slice(0, 5).join(', ')}.`]
        : ['Resume contains professional content but no specific technical skills were detected.'],
      weaknesses: [
        'Add clearer ATS-friendly headings and section labels.',
        'Include quantifiable achievements and metrics.',
      ],
      atsScore,
      summary,
    };
  }

  static extractSkillsFromText(text) {
    const normalized = (text || '').toLowerCase();
    return [...new Set(
      skills.filter((skill) => normalized.includes(skill.toLowerCase()))
    )];
  }

  static computeKeywordOverlap(resumeText, jobDescription) {
    const stopWords = new Set([
      'the','and','for','with','that','this','from','have','has','are','was','were','will','would','could','should',
      'a','an','of','to','in','on','at','by','as','is','it','be','or','if','but','not','we','our','you','your',
      'job','role','position','candidate','experience','years','skills','requirements','responsibilities'
    ]);
    const normalize = (text) =>
      (text || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
        .filter((word) => !stopWords.has(word));

    const jobTokens = normalize(jobDescription);
    const resumeTokens = new Set(normalize(resumeText));
    if (!jobTokens.length) return 0;

    const matched = jobTokens.filter((word) => resumeTokens.has(word));
    return Math.round((matched.length / jobTokens.length) * 100);
  }

  static localJobMatch(resumeText, jobDescription) {
    const analysis = this.localResumeAnalysis(resumeText);
    const resumeSkills = analysis.skills;
    const jobSkills = this.extractSkillsFromText(jobDescription);
    const matchedSkills = resumeSkills.filter((skill) => jobSkills.includes(skill));
    const missingSkills = jobSkills.filter((skill) => !matchedSkills.includes(skill));
    const additionalSkills = resumeSkills.filter((skill) => !jobSkills.includes(skill));

    const skillMatchScore = jobSkills.length
      ? Math.round((matchedSkills.length / jobSkills.length) * 100)
      : 0;
    const keywordOverlapScore = this.computeKeywordOverlap(resumeText, jobDescription);
    const matchScore = jobSkills.length
      ? Math.min(100, Math.round((skillMatchScore * 0.7) + (analysis.atsScore * 0.2) + (keywordOverlapScore * 0.1)))
      : Math.min(95, Math.round((analysis.atsScore * 0.35) + (keywordOverlapScore * 0.5) + 20));
    const recommendation = matchScore >= 85 ? 'hire' : matchScore >= 65 ? 'consider' : 'no-hire';

    return {
      matchScore,
      skillMatch: {
        score: skillMatchScore,
        matchedSkills,
        missingSkills,
        additionalSkills,
      },
      experienceMatch: {
        score: 0,
        requiredYears: 0,
        candidateYears: analysis.experience?.years || 0,
        assessment: 'Job-specific resume screening used fallback matching based on extracted skills and keyword overlap.',
      },
      educationMatch: {
        score: 0,
        requiredDegree: null,
        candidateDegree: analysis.education?.degree || null,
        assessment: 'Education was not directly inferred from job description in fallback mode.',
      },
      strengths: analysis.strengths,
      concerns: analysis.weaknesses,
      recommendation,
      summary: jobSkills.length
        ? `Fallback job-screening used resume skills matched against the job description. ${matchedSkills.length} of ${jobSkills.length} job-related skills were detected.`
        : `Fallback job-screening used keyword overlap between the resume and job description. ${keywordOverlapScore}% of non-stopword job terms appeared in the resume.`,
    };
  }

  /**
   * Match resume against job description using AI
   */
  static async matchResumeToJob(resumeText, jobDescription) {
    try {
      const prompt = `
You are an expert recruiter. Compare the following resume with the job description and provide a detailed matching analysis in JSON format.

Resume Text:
${resumeText}

Job Description:
${jobDescription}

Please provide analysis in this exact JSON format:
{
  "matchScore": "overall match percentage 0-100 as number",
  "skillMatch": {
    "score": "skill match percentage 0-100 as number",
    "matchedSkills": ["skill1", "skill2"],
    "missingSkills": ["skill1", "skill2"],
    "additionalSkills": ["skill1", "skill2"]
  },
  "experienceMatch": {
    "score": "experience match percentage 0-100 as number",
    "requiredYears": "required years as number",
    "candidateYears": "candidate years as number",
    "assessment": "brief assessment"
  },
  "educationMatch": {
    "score": "education match percentage 0-100 as number",
    "requiredDegree": "required degree or null",
    "candidateDegree": "candidate degree or null",
    "assessment": "brief assessment"
  },
  "strengths": ["strength1", "strength2", "strength3"],
  "concerns": ["concern1", "concern2"],
  "recommendation": "hire/no-hire/consider as string",
  "summary": "brief summary of fit"
}

Be honest and accurate in your assessment. Consider both technical skills and experience level.
`;

      const groq = this.getGroqClient();
      const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-8b-8192",
        temperature: 0.1,
        max_tokens: 2500,
      });

      const matchText = response.choices[0]?.message?.content;
      if (!matchText) {
        throw new Error("No response from AI service");
      }

      const cleanMatchText = this.cleanAIJson(matchText);
      let matchAnalysis;
      try {
        matchAnalysis = JSON.parse(cleanMatchText);
      } catch (parseError) {
        console.error("Match JSON parse error:", parseError);
        console.error("Raw match response:", cleanMatchText);
        return {
          matchScore: 0,
          skillMatch: { score: 0, matchedSkills: [], missingSkills: [], additionalSkills: [] },
          experienceMatch: { score: 0, requiredYears: 0, candidateYears: 0, assessment: "Unable to parse AI match response" },
          educationMatch: { score: 0, requiredDegree: null, candidateDegree: null, assessment: "Unable to parse AI match response" },
          strengths: [],
          concerns: ["Unable to parse AI match response"],
          recommendation: "consider",
          summary: "Fallback resume screening because AI match service returned invalid data."
        };
      }
      return matchAnalysis;

    } catch (error) {
      console.error("AI Job Matching Error:", error);
      return this.localJobMatch(resumeText, jobDescription);
    }
  }

  /**
   * Generate improvement suggestions for resume
   */
  static async suggestResumeImprovements(resumeText, jobDescription = null) {
    try {
      const prompt = jobDescription ?
        `Analyze this resume for the specific job and suggest improvements. Job: ${jobDescription}\n\nResume: ${resumeText}` :
        `Analyze this resume and suggest general improvements to make it more ATS-friendly and compelling.\n\nResume: ${resumeText}`;

      const groq = this.getGroqClient();
      const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-8b-8192",
        temperature: 0.3,
        max_tokens: 1500,
      });

      const suggestions = response.choices[0]?.message?.content;
      return suggestions || "Unable to generate suggestions";

    } catch (error) {
      console.error("AI Suggestions Error:", error);
      return "Unable to generate suggestions due to technical issues";
    }
  }
}

export default AIService;
