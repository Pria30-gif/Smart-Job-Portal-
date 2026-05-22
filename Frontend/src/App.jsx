<<<<<<< HEAD
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layouts
import Layout from "./Layout.jsx";
// Corrected and simplified import path
import AdminLayout from "./components/AdminLayout.jsx"; 

// Public Pages
=======
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layout & Pages
import Layout from "./Layout.jsx";
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
import Home from "./components/components_lite/Home.jsx";
import CareerCoach from "./components/CareerCoach.jsx";
import Login from "./components/authentication/Login.jsx";
import Register from "./components/authentication/Register.jsx";
import PrivacyPolicy from "./components/components_lite/PrivacyPolicy.jsx";
import TermsofService from "./components/components_lite/TermsofService.jsx";
import Jobs from "./components/components_lite/Jobs.jsx";
import Browse from "./components/components_lite/Browse.jsx";
import Profile from "./components/components_lite/Profile.jsx";
import Description from "./components/components_lite/Description.jsx";
<<<<<<< HEAD
import PlacementCalculator from "./components/PlacementCalculator.jsx";
import SkillGapAnalysis from "./components/SkillGapAnalysis.jsx";
import CoverLetterGenerator from "./components/CoverLetterGenerator.jsx";
import ResumeBuilder from "./components/ResumeBuilder.jsx";
import ResumeAnalyzer from "./components/ResumeAnalyzer.jsx";
import MockInterviewPrep from "./components/MockInterviewPrep.jsx";
import InterviewFeedbackDashboard from "./components/InterviewFeedbackDashboard.jsx";
import CareerPathChatbot from "./components/CareerPathChatbot.jsx";
import EngagementOutcomePlannerDashboard from "./components/EngagementOutcomePlannerDashboard.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import SalaryPredictor from "./components/components_lite/SalaryPredictor.jsx";
import Creator from "./components/creator/Creator.jsx";
import AppliedJobsPage from "./components/components_lite/AppliedJobsPage.jsx";
import ResumeScreeningAI from "./admin/ResumeScreeningAI.jsx";

// Admin (Recruiter) Pages
=======
import SalaryCalculator from "./components/SalaryCalculator.jsx";

// NEW AI Tools Pages
import SkillGapAnalysis from "./components/SkillGapAnalysis.jsx";
import CoverLetterGenerator from "./components/CoverLetterGenerator.jsx";

// Admin Components
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
import Companies from "./components/admincomponent/Companies.jsx";
import CompanyCreate from "./components/admincomponent/CompanyCreate.jsx";
import CompanySetup from "./components/admincomponent/CompanySetup.jsx";
import AdminJobs from "./components/admincomponent/AdminJobs.jsx";
import PostJob from "./components/admincomponent/PostJob.jsx";
import Applicants from "./components/admincomponent/Applicants.jsx";
<<<<<<< HEAD
import InterviewScheduler from "./components/InterviewScheduler.jsx";
import ProtectedRoute from "./components/admincomponent/ProtectedRoute.jsx";
import EditJob from "./components/admincomponent/EditJob.jsx";
import AllApplicants from "./components/admincomponent/AllApplicants.jsx";
import ContentManagement from "./components/admin/ContentManagement.jsx";
import AdminProfile from "./components/admincomponent/AdminProfile.jsx";

const appRouter = createBrowserRouter([
    // Routes for general users with the public layout
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/career-coach", element: <CareerCoach /> },
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
            { path: "/description/:id", element: <Description /> },
            { path: "/Profile", element: <Profile /> },
            { path: "/PrivacyPolicy", element: <PrivacyPolicy /> },
            { path: "/TermsofService", element: <TermsofService /> },
            { path: "/Jobs", element: <Jobs /> },
            { path: "/Browse", element: <Browse /> },
            { path: "/placement-calculator", element: <PlacementCalculator /> },
            { path: "/skill-gap-analysis", element: <SkillGapAnalysis /> },
            { path: "/cover-letter-generator", element: <CoverLetterGenerator /> },
            { path: "/resume-builder", element: <ResumeBuilder /> },
            { path: "/resume-review", element: <ResumeAnalyzer /> },
            { path: "/mock-interview", element: <MockInterviewPrep /> },
            { path: "/interview-feedback", element: <InterviewFeedbackDashboard /> },
            { path: "/career-path-guidance", element: <CareerPathChatbot /> },
            { path: "/salary-predictor", element: <SalaryPredictor /> },
            { path: "/applied-jobs", element: <AppliedJobsPage /> },
            { path: "/home", element: <Home /> },
            { path: "/creator", element: <Creator /> },
            { path: "/jobs", element: <Jobs /> },
            { path: "/browse", element: <Browse /> },
            { path: "/profile", element: <Profile /> },
            { path: "/privacy-policy", element: <PrivacyPolicy /> },
            { path: "/terms-of-service", element: <TermsofService /> },
        ],
    },
    // All Admin routes now consolidated into a single dashboard
    {
        path: "/admin",
        element: (
            <ProtectedRoute>
                <AdminLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: "/admin", element: <Companies /> },
            { path: "/admin/companies", element: <Companies /> },
            { path: "/admin/companies/create", element: <CompanyCreate /> },
            { path: "/admin/companies/:id", element: <CompanySetup /> },
            { path: "/admin/jobs", element: <AdminJobs /> },
            { path: "/admin/jobs/post", element: <PostJob /> },
            { path: "/admin/jobs/:id/edit", element: <EditJob /> },
            { path: "/admin/jobs/:id/applicants", element: <Applicants /> },
            { path: "/admin/interview-scheduler", element: <InterviewScheduler /> },
            { path: "/admin/applicants", element: <AllApplicants /> },
            { path: "/admin/content", element: <ContentManagement /> },
            { path: "/admin/profile", element: <AdminProfile /> },
            { path: "/admin/settings", element: <AdminProfile /> },
            { path: "/admin/resume-screening", element: <ResumeScreeningAI /> },
        ],
    },
]);

function App() {
    // The App component is now simplified to just render the router
    return <RouterProvider router={appRouter} />;
=======
import ProtectedRoute from "./components/admincomponent/ProtectedRoute.jsx";
import CompanyJobs from "./components/admincomponent/CompanyJobs.jsx"; // <-- NEW IMPORT ADDED HERE

// Creator & Resume
import Creator from "./components/creator/Creator.jsx";
import ResumeBuilder from "./components/ResumeBuilder.jsx";
import ResumeScreening from "./components/ResumeScreening.jsx";
import ResumeReview from "./components/ResumeReview.jsx";
import CareerPathChatbot from "./components/CareerPathChatbot.jsx";
import MockInterview from "./components/MockInterview.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/career-coach", element: <CareerCoach /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/description/:id", element: <Description /> },
      { path: "/Profile", element: <Profile /> },
      { path: "/PrivacyPolicy", element: <PrivacyPolicy /> },
      { path: "/TermsofService", element: <TermsofService /> },
      { path: "/Jobs", element: <Jobs /> },
      { path: "/Browse", element: <Browse /> },
      { path: "/Creator", element: <Creator /> },
      { path: "/resume-builder", element: <ResumeBuilder /> },
      { path: "/resume-screening", element: <ResumeScreening /> },
      { path: "/resume-review", element: <ResumeReview /> },
      { path: "/career-path-guidance", element: <CareerPathChatbot /> },
      { path: "/mock-interview", element: <MockInterview /> },
      { path: "/salary-calculator", element: <SalaryCalculator /> },
      // --- NEW ROUTES ADDED ---
      { path: "/skill-gap-analysis", element: <SkillGapAnalysis /> },
      { path: "/cover-letter-generator", element: <CoverLetterGenerator /> },
    ],
  },

  // Admin routes
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
  // *** THIS ROUTE WAS MISSING/FAILING TO LOAD ***
  {
    path: "/admin/companies/:companyId/jobs",
    element: (
      <ProtectedRoute>
        <CompanyJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs",
    element: (
      <ProtectedRoute>
        <AdminJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/create",
    element: (
      <ProtectedRoute>
        <PostJob />
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
]);

function App() {
  return <RouterProvider router={appRouter} />;
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
}

export default App;
