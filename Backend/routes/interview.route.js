import express from 'express';
<<<<<<< HEAD
import { scheduleInterview, getInterviews, updateInterview } from '../controllers/interview.controller.js';
=======
import { scheduleInterview, getInterviews } from '../controllers/interview.controller.js';
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
import authenticateToken from '../middleware/isAuthenticated.js';

const router = express.Router();

router.post('/schedule', authenticateToken, scheduleInterview);
router.get('/', authenticateToken, getInterviews);
<<<<<<< HEAD
router.put('/:id', authenticateToken, updateInterview);

export default router;
=======

export default router;
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
