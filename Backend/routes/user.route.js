import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
<<<<<<< HEAD
  removeResume,
  updateBio,
} from "../controllers/user.controller.js";

import authenticateToken from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";

=======
} from "../controllers/user.controller.js";
import authenticateToken from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";



>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").post(logout);
<<<<<<< HEAD

=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
router
  .route("/profile/update")
  .post(authenticateToken, singleUpload, updateProfile);

<<<<<<< HEAD
router.route("/profile/remove-resume").post(authenticateToken, removeResume);

// ✅ bio update route
router.put("/bio", authenticateToken, updateBio);

=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
export default router;
