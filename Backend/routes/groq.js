import express from "express";
import { Groq } from "groq-sdk";

const router = express.Router();

// Initialize Groq client
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Recommended fallback model (replace with one available in your Groq account)
const DEFAULT_MODEL = "llama3-7b"; // ✅ Update this to a valid model from your Groq console

// POST /api/groq/ask
router.post("/ask", async (req, res) => {
  try {
    const { prompt, model } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Use user-provided model if valid, otherwise default
    const selectedModel = model || DEFAULT_MODEL;

    const response = await client.complete({
      model: selectedModel,
      prompt,
      max_tokens: 200,
    });

    res.json({ result: response.choices?.[0]?.text || "" });
  } catch (err) {
    console.error("Groq error:", err);

    // Handle known errors more gracefully
    if (err.code === "model_decommissioned") {
      return res.status(400).json({
        error: "The model you requested has been decommissioned. Please use a supported model.",
      });
    }
    if (err.code === "model_not_found") {
      return res.status(400).json({
        error: "The model you requested does not exist or you do not have access to it.",
      });
    }

    // Generic fallback for any other errors
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

export default router;
