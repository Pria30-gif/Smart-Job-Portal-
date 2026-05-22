import axios from "axios";

class FakeJobDetectionService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
  }

  /**
   * Detect if a job posting is fake or suspicious
   * @param {Object} jobData - Job posting data
   * @returns {Promise<Object>} - Detection result
   */
  async detectFakeJob(jobData) {
    try {
      const {
        title,
        description,
        requirements,
        salary,
        location,
        company,
        created_by
      } = jobData;

      const jobText = `
Title: ${title}
Description: ${description}
Requirements: ${requirements?.join(', ')}
Salary: ${salary}
Location: ${location}
Company: ${company?.name || 'Unknown'}
      `.trim();

      const prompt = `You are an expert fraud detection AI specializing in job scams. Analyze the following job posting and determine if it appears to be legitimate or potentially fake/scam.

Job Posting:
${jobText}

Consider these red flags for fake jobs:
1. Unrealistically high salary for the role/level
2. Vague or generic job descriptions
3. Requests for payment or personal financial information
4. Too good to be true opportunities
5. Poor grammar or unprofessional language
6. No company information or unverifiable company
7. Remote work with no interview process
8. Pressure to act quickly

Provide your analysis in this exact JSON format:
{
  "isFake": boolean,
  "confidence": number (0-100),
  "reasons": ["reason1", "reason2"],
  "recommendation": "approve/reject/flag_for_review"
}

Be conservative - only flag as fake if you're highly confident.`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ]
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const aiReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!aiReply) {
        throw new Error("No response from AI service");
      }

      // Extract JSON from response
      const jsonMatch = aiReply.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid response format");
      }

      const result = JSON.parse(jsonMatch[0]);

      return {
        isFake: result.isFake || false,
        confidence: result.confidence || 0,
        reasons: result.reasons || [],
        recommendation: result.recommendation || "flag_for_review",
        analysis: aiReply
      };

    } catch (error) {
      console.error("Fake job detection error:", error);
      // Default to safe if detection fails
      return {
        isFake: false,
        confidence: 0,
        reasons: ["Detection service unavailable"],
        recommendation: "flag_for_review",
        error: error.message
      };
    }
  }
}

export default new FakeJobDetectionService();
