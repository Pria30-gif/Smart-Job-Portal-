<<<<<<< HEAD
import express from 'express';
import { uploadInterviewVideo, getFeedback, testOpenAI } from '../controllers/mockInterviewFeedback.controller.js';

const router = express.Router();

router.post('/upload', uploadInterviewVideo);
router.get('/test-ai', testOpenAI);
router.get('/:userId', getFeedback);

export default router;
=======
// Backend/routes/mockInterviewFeedback.route.js

import express from 'express';
// Assuming these dependencies exist and export correctly
import upload from '../middleware/multer.js'; 
import { uploadInterviewVideo } from '../controllers/mockInterviewFeedback.controller.js'; // Flask forwarder
import { analyzeMockInterview } from "../controllers/mockInterview.controller.js"; // Mock tester

const router = express.Router();

// 1. Endpoint for MOCK/TESTING - POST /api/mock-interview-feedback/analyze
// Multer expects the field name "file" (standardized fix for your MulterError)
router.post("/analyze", upload.single("file"), analyzeMockInterview);

// 2. Endpoint for REAL UPLOAD - POST /api/mock-interview-feedback/upload
// Multer expects the field name "file"
router.post("/upload", upload.single("file"), uploadInterviewVideo);

export default router;
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
