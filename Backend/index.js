<<<<<<< HEAD
import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import adminRoutes from './routes/admin.route.js';
import userRoutes from './routes/user.route.js';
import jobRoutes from './routes/job.route.js';
import applicationRoutes from './routes/application.route.js';
import companyRoutes from './routes/company.route.js';
import notificationRoutes from './routes/notification.route.js';
import resumeRoutes from './routes/resumeRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import fairnessRoutes from './routes/fairnessRoutes.js';
import mockInterviewFeedbackRoutes from './routes/mockInterviewFeedback.route.js';
import aiRoutes from './aiRoutes.js';

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5177', 'http://localhost:5714'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api', aiRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/fairness', fairnessRoutes);
app.use('/api/mock-interview-feedback', mockInterviewFeedbackRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: err.message });
});

// ===== Server Config =====
const PORT = process.env.PORT || 5011;

const server = app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});

// Handle "port already in use" error
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `❌ Port ${PORT} is already in use. Kill other processes using this port and restart.`
    );
    process.exit(1); // Exit so nodemon doesn't hang
  } else {
    console.error(err);
  }
});
=======
// index.js (Main Express Entry Point)

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";

import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import recruiterRoute from "./routes/recruiter.js"; // ML ranking route
// 🎯 CRITICAL IMPORT: Import the mock interview feedback route
import mockInterviewFeedbackRoutes from "./routes/mockInterviewFeedback.route.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5011;

// --- Middleware ---
app.use(cors({
    origin: "http://localhost:5173", // frontend
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- Routes ---
app.use("/api/user", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/job", jobRoute);
app.use("/api/application", applicationRoute);
app.use("/api/recruiter", recruiterRoute);

// 🎯 CRITICAL FIX: Mount the router for mock interview feedback.
// This handles the path: /api/mock-interview-feedback/upload
app.use("/api/mock-interview-feedback", mockInterviewFeedbackRoutes); 

// --- DB + Server Start ---
connectDB()
    .then(() => {
        app.listen(PORT, '127.0.0.1', () => {
            console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
        });
    })
    .catch(err => {
        console.error("❌ Failed to connect DB or start server:", err);
        process.exit(1);
    });
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
