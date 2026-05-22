<<<<<<< HEAD
=======
import React from "react";
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
import { createBrowserRouter } from "react-router-dom";

import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";
import Home from "./components/components_lite/Home";
import PrivacyPolicy from "./components/components_lite/PrivacyPolicy.jsx";
import TermsofService from "./components/components_lite/TermsofService.jsx";
import Jobs from "./components/components_lite/Jobs.jsx";
import Browse from "./components/components_lite/Browse.jsx";
import Profile from "./components/components_lite/Profile.jsx";
import Description from "./components/components_lite/Description.jsx";
import Companies from "./components/admincomponent/Companies";
import CompanyCreate from "./components/admincomponent/CompanyCreate";
import CompanySetup from "./components/admincomponent/CompanySetup";
import AdminJobs from "./components/admincomponent/AdminJobs.jsx";
import PostJob from "./components/admincomponent/PostJob";
import Applicants from "./components/admincomponent/Applicants";
import ProtectedRoute from "./components/admincomponent/ProtectedRoute";
import Creator from "./components/creator/Creator.jsx";
import SalaryPredictor from "./components/components_lite/SalaryPredictor.jsx";
<<<<<<< HEAD
import ResumeAnalyzer from "./components/ResumeAnalyzer.jsx";
import AllApplicants from "./components/admincomponent/AllApplicants.jsx";
import EngagementOutcomePlannerDashboard from "./components/EngagementOutcomePlannerDashboard.jsx";
import EditJob from "./components/admincomponent/EditJob.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import InterviewScheduler from "./components/InterviewScheduler.jsx";
import AppliedJobsPage from "./components/components_lite/AppliedJobsPage.jsx";
import ResumeScreeningAI from "./admin/ResumeScreeningAI.jsx";
import MockInterview from "./components/MockInterviewPrep.jsx";
import InterviewFeedbackDashboard from "./components/InterviewFeedbackDashboard.jsx";
import AIInterviewFeedback from "./components/AIInterviewFeedback.jsx";
=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e

export const appRouter = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/description/:id", element: <Description /> },
  { path: "/profile", element: <Profile /> },
<<<<<<< HEAD
  { path: "/applied-jobs", element: <AppliedJobsPage /> },
=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
  { path: "/privacy-policy", element: <PrivacyPolicy /> },
  { path: "/terms-of-service", element: <TermsofService /> },
  { path: "/jobs", element: <Jobs /> },
  { path: "/home", element: <Home /> },
  { path: "/browse", element: <Browse /> },
  { path: "/creator", element: <Creator /> },
  { path: "/salary-predictor", element: <SalaryPredictor /> },
<<<<<<< HEAD
  { path: "/resume-review", element: <ResumeAnalyzer /> },

  // Consolidated Admin Dashboard
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  // Admin sub-routes
  {
    path: "/admin/jobs",
    element: (
      <ProtectedRoute>
        <AdminJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/post",
    element: (
      <ProtectedRoute>
        <PostJob />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/:id/edit",
    element: (
      <ProtectedRoute>
        <EditJob />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: (
      <ProtectedRoute>
        <Applicants />
      </ProtectedRoute>
    ),
  },
=======

  // Admin routes
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
  {
    path: "/admin/companies",
    element: (
      <ProtectedRoute>
        <Companies />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/create",
    element: (
      <ProtectedRoute>
        <CompanyCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/:id",
    element: (
      <ProtectedRoute>
        <CompanySetup />
      </ProtectedRoute>
    ),
  },
  {
<<<<<<< HEAD
    path: "/admin/applicants",
    element: (
      <ProtectedRoute>
        <AllApplicants />
=======
    path: "/admin/jobs",
    element: (
      <ProtectedRoute>
        <AdminJobs />
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
      </ProtectedRoute>
    ),
  },
  {
<<<<<<< HEAD
    path: "/admin/interview-scheduler",
    element: (
      <ProtectedRoute>
        <InterviewScheduler />
=======
    path: "/admin/jobs/create",
    element: (
      <ProtectedRoute>
        <PostJob />
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
      </ProtectedRoute>
    ),
  },
  {
<<<<<<< HEAD
    path: "/admin/resume-screening",
    element: (
      <ProtectedRoute>
        <ResumeScreeningAI />
      </ProtectedRoute>
    ),
  },
  { path: "/mock-interview", element: <MockInterview /> },
  { path: "/interview-feedback", element: <InterviewFeedbackDashboard /> },
  { path: "/ai-interview-feedback", element: <AIInterviewFeedback /> },
=======
    path: "/admin/jobs/:id/applicants",
    element: (
      <ProtectedRoute>
        <Applicants />
      </ProtectedRoute>
    ),
  },
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
]);
