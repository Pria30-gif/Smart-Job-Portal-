import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getMockInterviewQuestion = async (req, res) => {
    try {
        const { domain } = req.body;

        if (!domain) {
            return res.status(400).json({ error: "Domain is required" });
        }

        const prompt = `You are an expert interviewer for ${domain} positions. Generate a challenging but fair interview question for a candidate applying for a ${domain} role. Provide only the question, no additional text.`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

        const question = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate question.";

        res.json({ question });

    } catch (error) {
        console.error("AI API Error:", error.response?.data || error.message);
        res.status(500).json({
            error: "An error occurred while generating the question.",
            details: error.response?.data || error.message
        });
    }
};

export const scoreAnswer = async (req, res) => {
    try {
        const { question, answer } = req.body;

        if (!question || !answer) {
            return res.status(400).json({ error: "Question and answer are required" });
        }

        const prompt = `You are an expert interviewer. Evaluate the following interview answer on a scale of 1-10, where 10 is excellent. Provide a brief explanation (max 50 words). Question: ${question} Answer: ${answer}`;

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

        const score = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to score answer.";

        res.json({ score });

    } catch (error) {
        console.error("AI API Error:", error.response?.data || error.message);
        res.status(500).json({
            error: "An error occurred while scoring the answer.",
            details: error.response?.data || error.message
        });
    }
};
