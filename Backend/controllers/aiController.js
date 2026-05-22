<<<<<<< HEAD
import Groq from "groq-sdk";

let groq = null;

// Lazy initialization of Groq client
const getGroqClient = () => {
    if (!groq) {
        if (!process.env.GROQ_API_KEY) {
            throw new Error('GROQ_API_KEY environment variable is not set');
        }
        groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });
    }
    return groq;
};

// Helper function to call LLM (Groq)
export const callLLM = async (prompt) => {
    try {
        const client = getGroqClient();
        const chatCompletion = await client.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama3-8b-8192",
        });

        return chatCompletion.choices[0]?.message?.content || "No response generated";
    } catch (error) {
        console.error("LLM API Error:", error.response?.data || error.message);
        throw new Error("Failed to communicate with AI service");
    }
};
=======
import axios from "axios";
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e

export const careerCoach = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({ error: "Message is required" });
        }

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        role: "user",
                        parts: [{ text: "You are an expert Career Coach AI. Your goal is to provide helpful, encouraging, and actionable career advice based on the user's questions. Do not go off-topic. Always maintain a positive and professional tone." }]
                    },
                    {
                        role: "model",
                        parts: [{ text: "Understood. I am ready to help as an expert Career Coach." }]
                    },
                    {
                        role: "user",
                        parts: [{ text: message }]
                    }
                ]
            },
            { headers: { "Content-Type": "application/json" } }
        );

        const aiReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response. Please try again.";

        res.json({ reply: aiReply });

    } catch (error) {
        console.error("AI API Error:", error.response?.data || error.message);
        res.status(500).json({
            error: "An error occurred while communicating with the AI service.",
            details: error.response?.data || error.message
        });
    }
};

<<<<<<< HEAD
// Helper function for direct resume scoring (used by services)
export const scoreResumeDirect = async (resumeText, jobDescription) => {
    try {
        if (!resumeText || !jobDescription) {
            throw new Error("Resume text and job description are required");
        }

        // Validate API key
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("AI service configuration error: API key not configured");
=======
export const resumeScore = async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;

        if (!resumeText || !jobDescription) {
            return res.status(400).json({ error: "Resume text and job description are required" });
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
        }

        const prompt = `You are an expert HR recruiter. Evaluate the following resume against the job description and provide a score out of 100, along with a brief analysis.

Resume:
${resumeText}

Job Description:
${jobDescription}

Provide your response in this format:
Score: [number]/100
Analysis: [brief explanation]`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }]
                    }
                ]
            },
<<<<<<< HEAD
            {
                headers: { "Content-Type": "application/json" },
                timeout: 30000 // 30 second timeout
            }
        );

        if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error("Invalid response from AI service");
        }

        const aiReply = response.data.candidates[0].content.parts[0].text;

        // Extract score from the response
        const scoreMatch = aiReply.match(/Score:\s*(\d+)\/100/i);
        const score = scoreMatch ? parseInt(scoreMatch[1]) : null;

        return {
            success: true,
            analysis: aiReply,
            score: score,
            rawResponse: aiReply
        };

    } catch (error) {
        console.error("AI API Error:", error.response?.data || error.message);

        let errorMessage = "An error occurred while analyzing the resume.";
        let errorDetails = error.message;

        if (error.code === 'ECONNABORTED') {
            errorMessage = "AI service timeout";
            errorDetails = "The request to the AI service timed out. Please try again.";
        } else if (error.response?.status === 400) {
            errorMessage = "Invalid request to AI service";
            errorDetails = "The request format was invalid.";
        } else if (error.response?.status === 401) {
            errorMessage = "AI service authentication failed";
            errorDetails = "API key may be invalid or expired.";
        } else if (error.response?.status === 429) {
            errorMessage = "AI service rate limit exceeded";
            errorDetails = "Too many requests. Please wait and try again.";
        } else if (error.response?.status >= 500) {
            errorMessage = "AI service temporarily unavailable";
            errorDetails = "The AI service is experiencing issues. Please try again later.";
        }

        throw new Error(errorMessage);
    }
};

export const resumeScore = async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;

        if (!resumeText || !jobDescription) {
            return res.status(400).json({
                success: false,
                error: "Resume text and job description are required",
                details: "Both resumeText and jobDescription must be provided"
            });
        }

        const result = await scoreResumeDirect(resumeText, jobDescription);

        res.json(result);

    } catch (error) {
        console.error("Resume scoring error:", error);

        res.status(500).json({
            success: false,
            error: error.message || "An error occurred while analyzing the resume.",
            details: error.message,
            timestamp: new Date().toISOString()
=======
            { headers: { "Content-Type": "application/json" } }
        );

        const aiReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to analyze resume.";

        res.json({ analysis: aiReply });

    } catch (error) {
        console.error("AI API Error:", error.response?.data || error.message);
        res.status(500).json({
            error: "An error occurred while analyzing the resume.",
            details: error.response?.data || error.message
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
        });
    }
};
