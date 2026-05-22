import express from 'express';
import { getFairnessMetrics } from '../controllers/fairnessController.js';

const router = express.Router();

// Get fairness metrics for a job
router.get('/metrics/:jobId', getFairnessMetrics);

export default router;
