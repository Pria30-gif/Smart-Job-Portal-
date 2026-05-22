import express from "express";
<<<<<<< HEAD
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authenticateToken from "../middleware/isAuthenticated.js";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
  getMatchingCandidates,
  updateJob,
  screenResume,
  screenApplicantResume,
} from "../controllers/job.controller.js";
import { applyJob } from "../controllers/application.controller.js";
import {
  getRankedApplications,
  getShortlistedCandidates,
  revealCandidates,
} from "../controllers/ranking.controller.js";
import { getTacitAnalytics } from "../controllers/tacit.controller.js";

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads/');
console.log('Uploads directory path:', uploadsDir);
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Saving file to:', uploadsDir);
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + '-' + file.originalname;
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});
const upload = multer({ storage: storage });

router.route("/post").post(authenticateToken, postJob);
//router.route("/get").get(authenticateToken, getAllJobs);
//router.get("/get", (req, res, next) => {
//  console.log("Incoming cookies:", req.cookies); // 👈 Debug log
//  next();
//}, authenticateToken, getAllJobs);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(authenticateToken, getAdminJobs);
router.route("/:id/shortlisted").get(authenticateToken, getShortlistedCandidates);
router.route("/get/:id").get(getJobById);
router.route("/match/:id").get(authenticateToken, getMatchingCandidates);
router.route("/apply/:id").post(authenticateToken, applyJob);
router.route("/update/:id").put(authenticateToken, updateJob);
router.route("/screen").post(authenticateToken, upload.single('resume'), screenResume);
router.route("/:jobId/screen-applicant/:applicationId").post(authenticateToken, screenApplicantResume);

// ✅ TACIT Analytics Route
router.route("/tacit/:id").get(getTacitAnalytics);
=======
import authenticateToken from "../middleware/isAuthenticated.js";
import {
  postJob,
  getAllJobs,
  getAdminJobs,
  getJobById,
  getJobsByCompanyId
} from "../controllers/job.controller.js";

const router = express.Router();

// Routes
router.route("/post").post(authenticateToken, postJob);
router.route("/get").get(getAllJobs); // public
router.route("/getadminjobs").get(authenticateToken, getAdminJobs);
router.route("/get/:id").get(authenticateToken, getJobById);
router.route("/company/:companyId").get(getJobsByCompanyId); // ✅ new route
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e

export default router;
