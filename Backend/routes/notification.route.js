import express from "express";
import { getNotifications, markAsRead, deleteNotification } from "../controllers/notification.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.get("/", isAuthenticated, getNotifications);
router.put("/:id/read", isAuthenticated, markAsRead);
router.delete("/:id", isAuthenticated, deleteNotification);

export default router;
