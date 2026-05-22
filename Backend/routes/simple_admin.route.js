import express from 'express';
import multer from 'multer';

const router = express.Router();

// Simple multer config
const upload = multer({ dest: 'uploads/' });

// Simple test route
router.get("/test", (req, res) => {
  res.json({ message: "Test route working", timestamp: new Date().toISOString() });
});

// Simple resume analyzer route - no multer for now
router.post("/resume-analyzer", (req, res) => {
  console.log("✅ Resume analyzer called!");
  res.json({
    success: true,
    message: "Resume analyzer working!",
    timestamp: new Date().toISOString()
  });
});

export default router;