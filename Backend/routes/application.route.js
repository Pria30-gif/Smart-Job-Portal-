import express from "express";
<<<<<<< HEAD

import authenticateToken from "../middleware/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus, withdrawApplication } from "../controllers/application.controller.js";

const router = express.Router();

router.route("/apply/:id").post(authenticateToken, applyJob);
router.route("/get").get(authenticateToken, getAppliedJobs);
router.route("/:id/applicants").get(authenticateToken, getApplicants);
router.route("/status/:id/update").post(authenticateToken, updateStatus);
router.route("/withdraw/:id").delete(authenticateToken, withdrawApplication);

export default router;
=======
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";
import authenticateToken from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/apply/:id").get(authenticateToken, applyJob);
router.route("/get").get(authenticateToken, getAppliedJobs);
router.route("/:id/applicants").get(authenticateToken, getApplicants);
router.route("/status/:id/update").post(authenticateToken, updateStatus);

export default router;
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
