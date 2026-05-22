
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
import contentRoutes from './routes/contentRoutes.js';
import fairnessRoutes from './routes/fairnessRoutes.js';
import mockInterviewFeedbackRoutes from './routes/mockInterviewFeedback.route.js';
import interviewRoutes from './routes/interview.route.js';
import aiRoutes from './aiRoutes.js';

// Connect to database
connectDB();

const app = express();

// Log OpenAI config status (do not print the key)
if (process.env.OPENAI_API_KEY) {
  console.log('🔐 OpenAI: API key configured');
} else {
  console.log('🔐 OpenAI: API key NOT configured');
}

// Simple request logger for debugging
app.use((req, res, next) => {
  console.log(`--> ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5176', 'http://localhost:5182', 'http://localhost:5174', 'http://localhost:5714'],
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
app.use('/api/content', contentRoutes);
app.use('/api', aiRoutes);
app.use('/api/fairness', fairnessRoutes);
app.use('/api/interview', interviewRoutes);
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
