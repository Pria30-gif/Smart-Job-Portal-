<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "@/redux/applicationSlice";
import { APPLICATION_API_ENDPOINT } from "@/utils/data";
import { toast } from "react-hot-toast";
import {
  Check,
  X,
  Users,
  CheckCircle,
  XCircle,
  Download,
  TrendingUp,
  Scale,
  AlertTriangle,
  BarChart3,
  RefreshCw,
  Star,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const Applicants = () => {
  const { id: jobId } = useParams();
  const dispatch = useDispatch();
  const { applicants } = useSelector((store) => store.application);
  const [loading, setLoading] = useState(true);
  const [fairnessData, setFairnessData] = useState(null);
  const [showFairness, setShowFairness] = useState(false);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showShortlisted, setShowShortlisted] = useState(false);
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  const [sortBy, setSortBy] = useState("score"); // "score" or "date"

  useEffect(() => {
    fetchAllApplicants();
    fetchFairnessMetrics();
  }, [jobId]);

  const fetchAllApplicants = async () => {
    if (!jobId || jobId.length !== 24) {
      console.warn("Invalid or missing jobId for applicants fetch:", jobId);
      toast.error("Invalid job selected for applicants.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${APPLICATION_API_ENDPOINT}/${jobId}/applicants`,
        { withCredentials: true }
      );
      dispatch(setAllApplicants(res.data.job));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching applicants:", error);
      toast.error("Failed to fetch applicants");
      setLoading(false);
    }
  };

  const fetchFairnessMetrics = async () => {
    try {
      const res = await axios.get(`/api/fairness/metrics/${jobId}`, {
        withCredentials: true,
      });
      setFairnessData(res.data);
    } catch (error) {
      console.error("Failed to fetch fairness metrics:", error);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await axios.post(
        `${APPLICATION_API_ENDPOINT}/status/${applicationId}/update`,
        { status: newStatus },
        { withCredentials: true }
      );
      toast.success(`Application ${newStatus}`);
      fetchAllApplicants();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const toggleSelectApplicant = (id) => {
    setSelectedApplicants((prev) =>
      prev.includes(id) ? prev.filter((aid) => aid !== id) : [...prev, id]
    );
  };

  const handleShortlistTopCandidates = (count = 5) => {
    const sorted = [...(applicants?.applications || [])].sort(
      (a, b) => (b.resumeScore || 0) - (a.resumeScore || 0)
    );
    const topCandidates = sorted.slice(0, count).map((app) => app._id);
    setShortlistedCandidates(topCandidates);
    toast.success(`Top ${count} candidates shortlisted!`);
  };

  const toggleShortlistCandidate = (applicationId) => {
    setShortlistedCandidates((prev) =>
      prev.includes(applicationId)
        ? prev.filter((id) => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  const isShortlisted = (applicationId) => {
    return shortlistedCandidates.includes(applicationId);
  };

  const filteredApplicants = applicants?.applications?.filter((app) => {
    const matchesStatus =
      statusFilter === "all" || app.status === statusFilter;
    const matchesSearch =
      app.applicant?.fullname
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      app.applicant?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesShortlist = showShortlisted
      ? isShortlisted(app._id)
      : true;
    return matchesStatus && matchesSearch && matchesShortlist;
  }) || [];

  // Sort applicants
  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    if (sortBy === "score") {
      return (b.resumeScore || 0) - (a.resumeScore || 0);
    }
    return (
      new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );
  });

  const stats = {
    total: applicants?.applications?.length || 0,
    accepted: applicants?.applications?.filter(
      (app) => app.status === "accepted"
    ).length || 0,
    pending: applicants?.applications?.filter(
      (app) => !app.status || app.status === "pending"
    ).length || 0,
    rejected: applicants?.applications?.filter(
      (app) => app.status === "rejected"
    ).length || 0,
  };

  const chartData = [
    { name: "Accepted", value: stats.accepted, color: "#10b981" },
    { name: "Pending", value: stats.pending, color: "#f59e0b" },
    { name: "Rejected", value: stats.rejected, color: "#ef4444" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading applicants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Applicants Management
          </h1>
          <p className="text-gray-600">
            Review and manage job applicants | Total: {stats.total}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Accepted</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.accepted}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Rejected</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.rejected}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Fairness Analysis Toggle */}
        <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                setShowFairness(!showFairness);
                if (!showFairness) fetchFairnessMetrics();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              <Scale className="h-4 w-4" />
              {showFairness ? "Hide" : "Show"} Fairness
            </button>
            <button
              onClick={() => setShowShortlisted(!showShortlisted)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors shadow-md ${
                showShortlisted
                  ? "bg-yellow-600 text-white hover:bg-yellow-700"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              <Star className="h-4 w-4" />
              {showShortlisted ? "Hide" : "Show"} Shortlisted ({shortlistedCandidates.length})
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleShortlistTopCandidates(3)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors shadow-md"
            >
              <Star className="h-4 w-4" />
              Top 3 Candidates
            </button>
            <button
              onClick={() => handleShortlistTopCandidates(5)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors shadow-md"
            >
              <Star className="h-4 w-4" />
              Top 5 Candidates
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 hover:border-gray-400 transition-colors"
            >
              <option value="score">Sort by Score</option>
              <option value="date">Sort by Date</option>
            </select>
          </div>
        </div>

        {/* Fairness Analysis Section */}
        {showFairness && fairnessData && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-t-4 border-indigo-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-indigo-600" />
              Fairness Analysis
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Bias Level
                </h3>
                <p
                  className={`text-3xl font-bold ${
                    fairnessData.biasLevel === "Low"
                      ? "text-green-600"
                      : fairnessData.biasLevel === "Moderate"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {fairnessData.biasLevel}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Selection Rate Diff
                </h3>
                <p className="text-3xl font-bold text-purple-600">
                  {fairnessData.maxRateDiff}%
                </p>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Score Difference
                </h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {fairnessData.maxScoreDiff}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-900 mb-4">
                  Demographic Parity
                </h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={fairnessData.demographicParity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="group" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="selectionRate" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-900 mb-4">
                  Average Scores by Group
                </h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={fairnessData.demographicParity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="group" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgScore" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Fairness Table */}
            <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
              <h4 className="text-md font-semibold text-gray-900 mb-4">
                Detailed Metrics
              </h4>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-200 border-b">
                    <th className="px-4 py-2 text-left font-semibold">
                      Group
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Total
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Accepted
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Selection Rate
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Avg Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fairnessData.demographicParity.map((item, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {item.group}
                      </td>
                      <td className="px-4 py-3">{item.totalApplicants}</td>
                      <td className="px-4 py-3">{item.shortlisted}</td>
                      <td className="px-4 py-3 font-medium text-indigo-600">
                        {item.selectionRate}%
                      </td>
                      <td className="px-4 py-3 font-medium text-green-600">
                        {item.avgScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Application Status Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Filters and Search */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Filters
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-2 flex-wrap">
                {["all", "pending", "accepted", "rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      statusFilter === status
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Applicants Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Applicants List ({filteredApplicants.length})
            </h3>
          </div>

          {filteredApplicants.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">
                {showShortlisted ? "No shortlisted applicants found" : "No applicants found"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Shortlist
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Resume Score
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedApplicants.map((applicant, idx) => (
                    <tr
                      key={applicant._id}
                      className={`hover:bg-gray-50 transition-colors ${
                        isShortlisted(applicant._id) ? "bg-yellow-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleShortlistCandidate(applicant._id)}
                          className={`p-2 rounded-lg transition-colors ${
                            isShortlisted(applicant._id)
                              ? "bg-yellow-200 text-yellow-600"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          title={isShortlisted(applicant._id) ? "Remove from shortlist" : "Add to shortlist"}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              isShortlisted(applicant._id) ? "fill-yellow-600" : ""
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-medium text-gray-900">
                          {applicant.applicant?.fullname || "Unknown"}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-600">
                          {applicant.applicant?.email || "N/A"}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-semibold text-indigo-600">
                          {applicant.resumeScore || "N/A"}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            applicant.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : applicant.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {applicant.status || "pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(applicant.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleStatusUpdate(applicant._id, "accepted")
                            }
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                            title="Accept"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(applicant._id, "rejected")
                            }
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
=======
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import Navbar from "../components_lite/Navbar";
import { useDispatch } from "react-redux";
import { setAllApplicants } from "@/redux/applicationSlice";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FileText, Download, UserCheck, UserX } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from "sonner";

// Define the Scoring Domains/Models (Frontend labels for Backend logic)
const SHORTLISTING_DOMAINS = [ 
    { value: 'cosine_similarity', label: 'Technical & Engineering' },
    { value: 'skill_matching', label: 'Marketing & Sales' },
    { value: 'experience_ranking', label: 'Finance & Management' },
];

// Placeholder for the shortlisting API endpoint (replace with your actual API path)
const APPLICATION_API_ENDPOINT = "/api/application"; 

// Helper Component for Resume Viewing Modal
const ResumeViewer = ({ resumeUrl, fullname }) => (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="mt-2 text-sm bg-red-50 hover:bg-red-100 text-red-600 border-red-300">
                <FileText className="w-4 h-4 mr-2" /> View Resume
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-scroll">
            <DialogHeader>
                <DialogTitle>Resume Preview: {fullname}</DialogTitle>
                <div className='flex gap-2 pt-2'>
                    <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="default" size="sm" className='bg-green-600 hover:bg-green-700'>
                            <Download className="w-4 h-4 mr-2" /> Download File
                        </Button>
                    </a>
                </div>
            </DialogHeader>
            <div className="border border-gray-300 h-[60vh] flex items-center justify-center bg-gray-50 text-gray-500 p-4 rounded-lg">
                <p>
                    Resume content cannot be rendered directly in this preview environment. 
                    Please use the **Download File** button above to view the resume.
                </p>
            </div>
        </DialogContent>
    </Dialog>
);


const Applicants = () => {
    const [applicants, setApplicantsState] = useState([]);
    const [jobTitle, setJobTitle] = useState('');
    const [selectedModel, setSelectedModel] = useState(SHORTLISTING_DOMAINS[0].value);
    const [isFetching, setIsFetching] = useState(false);
    const { id: jobId } = useParams();
    const dispatch = useDispatch();
    
    // Handler for Shortlist/Reject buttons
    const shortlistingStatusHandler = async (status, applicantId) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(
                `${APPLICATION_API_ENDPOINT}/status/${applicantId}/update`,
                { status }
            );
            if (res.data.success) {
                toast.success(`Applicant status updated to: ${status}`);
                // Re-fetch to update the UI, maintaining the current ranking
                fetchApplicants(selectedModel); 
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating status");
        }
    };


    const fetchApplicants = async (modelType) => {
        try {
            setIsFetching(true);
            
            // 1. **CORRECT API CALL TO TRIGGER ML BACKEND LOGIC**
            // Hitting the job-specific endpoint and passing the domain model as a query parameter
            const res = await axios.get(`/api/recruiter/jobs/${jobId}/applicants`, {
                params: { shortlisting_model: modelType }, 
                withCredentials: true,
            });
            
            // Assuming the API returns a 'rankedApplicants' list with matchPercentage and matchedSkills
            setApplicantsState(res.data.rankedApplicants);
            setJobTitle(res.data.jobTitle);
            dispatch(setAllApplicants(res.data.rankedApplicants)); 
        } catch (error) {
            console.error(`Failed to fetch applicants for model ${modelType}:`, error);
            setApplicantsState([]);
            dispatch(setAllApplicants([]));
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        // Fetch applicants automatically on component load
        fetchApplicants(selectedModel); 
    }, [jobId, dispatch]); 
    
    // Handler for when the Model selection changes
    const handleModelChange = (value) => {
        setSelectedModel(value);
    };
    
    // Find the currently selected domain label for display
    const currentDomainLabel = SHORTLISTING_DOMAINS.find(d => d.value === selectedModel)?.label;


    return (
        <div>
            <Navbar />
            <div className="max-w-5xl mx-auto py-10 px-4">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Applicants</h1>
                {jobTitle && <p className="text-xl text-gray-600 mb-6">For: <span className="font-semibold text-red-600">{jobTitle}</span></p>}

                {/* Domain Selector & Filter Button */}
                <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-red-50 border border-red-200 rounded-xl shadow-inner">
                    <label className="text-sm font-medium text-red-700 whitespace-nowrap">Shortlisting Domain:</label>
                    <Select value={selectedModel} onValueChange={handleModelChange}>
                        <SelectTrigger className="w-[280px] bg-white border-red-300 focus:ring-red-500">
                            <SelectValue placeholder="Select Domain" />
                        </SelectTrigger>
                        <SelectContent>
                            {SHORTLISTING_DOMAINS.map((domain) => (
                                <SelectItem key={domain.value} value={domain.value}>
                                    {domain.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button 
                        onClick={() => fetchApplicants(selectedModel)}
                        className="bg-red-600 hover:bg-red-700 transition-colors shadow-md"
                        disabled={isFetching}
                    >
                        {isFetching ? 'Applying Filter...' : 'Apply Filter & Rank'}
                    </Button>
                </div>

                {/* Applicant List */}
                {applicants.length === 0 && !isFetching ? (
                    <p className="text-center text-lg py-10 text-gray-500">No applicants found for this job or selected domain.</p>
                ) : (
                    <div className="space-y-6">
                        {applicants.map((app) => (
                            <div key={app._id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-14 w-14 border-2 border-red-500">
                                            <AvatarImage src={app.applicant.profile?.profilePhoto} alt={app.applicant.fullname} />
                                        </Avatar>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-800">{app.applicant.fullname}</h2>
                                            <p className="text-sm text-gray-500">{app.applicant.email}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col items-end gap-2'>
                                        <Badge
                                            className={`text-lg font-bold py-1 px-4 rounded-full text-white shadow-md ${app.matchPercentage > 75 ? 'bg-green-600 hover:bg-green-700' : app.matchPercentage > 50 ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-red-600 hover:bg-red-700'}`}
                                        >
                                            {app.matchPercentage}% Match
                                        </Badge>
                                        
                                        {/* Shortlist/Reject Actions */}
                                        <div className="flex gap-2">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="border-green-500 text-green-600 hover:bg-green-50"
                                                onClick={() => shortlistingStatusHandler("Accepted", app._id)}
                                            >
                                                <UserCheck className="w-4 h-4 mr-1" /> Shortlist
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="border-red-500 text-red-600 hover:bg-red-50"
                                                onClick={() => shortlistingStatusHandler("Rejected", app._id)}
                                            >
                                                <UserX className="w-4 h-4 mr-1" /> Reject
                                            </Button>
                                        </div>

                                        {/* Resume Viewer/Download Button */}
                                        {app.applicant.profile?.resume && (
                                            <ResumeViewer resumeUrl={app.applicant.profile.resume} fullname={app.applicant.fullname} />
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <h3 className="font-semibold text-base mb-3 text-gray-700">
                                        Shortlisting Details (Scoring Model: <span className="text-red-600">{currentDomainLabel}</span>):
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {app.matchedSkills?.length > 0 ? (
                                            app.matchedSkills.map((skill, index) => (
                                                <Badge key={index} variant="secondary" className="bg-red-100 text-red-700 border border-red-300 hover:bg-red-200">
                                                    {skill}
                                                </Badge>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500">No key skills matched based on the selected scoring model.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
};

export default Applicants;
