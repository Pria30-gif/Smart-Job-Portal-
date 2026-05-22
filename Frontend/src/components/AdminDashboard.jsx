import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import useGetPostedJobs from '@/hooks/useGetPostedJobs';
import axios from 'axios';
import { JOB_API_ENDPOINT, APPLICATION_API_ENDPOINT } from '@/utils/data';
import { toast } from 'sonner';
import { setPostedJobs } from '@/redux/jobSlice';
import { useDispatch } from 'react-redux';
import {
    Briefcase,
    Users,
    Calendar,
    FileText,
    Building,
    TrendingUp,
    BarChart3,
    Plus,
    Edit,
    Trash2,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Search,
    Filter,
    Download,
    Settings
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList } from 'recharts';

const AdminDashboard = () => {
    const { loading: jobsLoading } = useGetPostedJobs();
    const { postedJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview');
    const [applicants, setApplicants] = useState([]);
    const [interviews, setInterviews] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalApplicants: 0,
        activeInterviews: 0,
        totalCompanies: 0
    });
    const [funnelData, setFunnelData] = useState([]);
    const [jobPerformanceData, setJobPerformanceData] = useState([]);
    const [companyEngagementData, setCompanyEngagementData] = useState([]);

    // Fetch all data
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Derive applicants from postedJobs
            const allApplications = postedJobs.flatMap(job =>
                (job.applications || []).map(app => ({
                    ...app,
                    jobTitle: job.title,
                    jobId: job._id
                }))
            );
            setApplicants(allApplications);

            // Fetch interviews (placeholder - adjust endpoint as needed)
            try {
                const interviewsRes = await axios.get('/api/interview/', {
                    withCredentials: true,
                });
                if (interviewsRes.data.success) {
                    setInterviews(interviewsRes.data.interviews);
                }
            } catch (err) {
                console.log('Interviews endpoint not available');
            }

            // Fetch companies
            const companiesRes = await axios.get('/api/company/', {
                withCredentials: true,
            });
            if (companiesRes.data.success) {
                setCompanies(companiesRes.data.companies);
            }

            // Calculate stats
            setStats({
                totalJobs: postedJobs.length,
                totalApplicants: allApplications.length,
                activeInterviews: interviews.filter(i => i.status === 'scheduled').length,
                totalCompanies: companies.length
            });

            // Calculate funnel data
            const statusCounts = allApplications.reduce((acc, app) => {
                acc[app.status || 'applied'] = (acc[app.status || 'applied'] || 0) + 1;
                return acc;
            }, {});
            const funnel = [
                { name: 'Applied', value: statusCounts.applied || 0, fill: '#8884d8' },
                { name: 'Screened', value: statusCounts.screened || 0, fill: '#82ca9d' },
                { name: 'Interviewed', value: statusCounts.interviewed || 0, fill: '#ffc658' },
                { name: 'Hired', value: statusCounts.hired || 0, fill: '#ff7300' }
            ];
            setFunnelData(funnel);

            // Job performance data
            const jobPerf = postedJobs.map(job => ({
                name: job.title.length > 20 ? job.title.substring(0, 20) + '...' : job.title,
                applications: job.applications?.length || 0,
                conversion: job.applications?.filter(app => app.status === 'hired').length || 0
            }));
            setJobPerformanceData(jobPerf);

            // Company engagement data
            const companyCounts = postedJobs.reduce((acc, job) => {
                const companyName = job.company?.name || 'Unknown';
                acc[companyName] = (acc[companyName] || 0) + 1;
                return acc;
            }, {});
            const topCompanies = Object.entries(companyCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([name, value]) => ({ name, value }));
            setCompanyEngagementData(topCompanies);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (window.confirm("Are you sure you want to delete this job?")) {
            try {
                const res = await axios.delete(`${JOB_API_ENDPOINT}/delete/${jobId}`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    toast.success(res.data.message);
                    dispatch(setPostedJobs(postedJobs.filter(job => job._id !== jobId)));
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Error deleting job.");
            }
        }
    };

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${color}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <Icon className="h-8 w-8 text-gray-400" />
            </div>
        </div>
    );

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'jobs', label: 'Jobs', icon: Briefcase },
        { id: 'applicants', label: 'Applicants', icon: Users },
        { id: 'interviews', label: 'Interviews', icon: Calendar },
        { id: 'companies', label: 'Companies', icon: Building },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-600">Manage your job portal efficiently</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                Quick Actions
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column: Analytics Overview */}
                        <div className="space-y-6">
                            {/* Applicants Funnel Chart */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Applicants Funnel</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={funnelData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Job Posting Performance */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Posting Performance</h3>
                                <div className="space-y-3">
                                    {jobPerformanceData.slice(0, 5).map((job, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                            <div>
                                                <p className="font-medium text-gray-900">{job.name}</p>
                                                <p className="text-sm text-gray-600">{job.applications} applications</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium">{job.conversion} hired</p>
                                                <p className="text-xs text-gray-500">
                                                    {job.applications > 0 ? ((job.conversion / job.applications) * 100).toFixed(1) : 0}% conversion
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Company Engagement */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Engagement</h3>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={companyEngagementData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={60}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {companyEngagementData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'][index % 5]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Right Column: Actionable Insights */}
                        <div className="space-y-6">
                            {/* Upcoming Interviews */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Interviews</h3>
                                <div className="space-y-3">
                                    {interviews.slice(0, 5).map((interview) => (
                                        <div key={interview._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                                            <div>
                                                <p className="font-medium text-gray-900">{interview.applicant?.fullname || 'Unknown'}</p>
                                                <p className="text-sm text-gray-600">{interview.job?.title || 'Unknown Job'}</p>
                                            </div>
                                            <span className="text-sm text-gray-500">{new Date(interview.date).toLocaleDateString()}</span>
                                        </div>
                                    ))}
                                    {interviews.length === 0 && (
                                        <p className="text-gray-500 text-center py-4">No upcoming interviews</p>
                                    )}
                                </div>
                            </div>

                            {/* Resume Screening Alerts */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Screening Alerts</h3>
                                <div className="space-y-3">
                                    <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                                        <p className="text-sm text-yellow-800">5 resumes flagged for missing skills</p>
                                    </div>
                                    <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded-md">
                                        <p className="text-sm text-red-800">3 resumes with low match percentage</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <Link to="/admin/jobs/post" className="flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                        <Plus className="h-4 w-4" />
                                        Add Job
                                    </Link>
                                    <Link to="/admin/companies/create" className="flex items-center justify-center gap-2 p-3 bg-green-600 text-white rounded-md hover:bg-green-700">
                                        <Building className="h-4 w-4" />
                                        Add Company
                                    </Link>
                                    <Link to="/admin/interview-scheduler" className="flex items-center justify-center gap-2 p-3 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                                        <Calendar className="h-4 w-4" />
                                        Schedule Interview
                                    </Link>
                                    <Link to="/admin/resume-screening" className="flex items-center justify-center gap-2 p-3 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                                        <FileText className="h-4 w-4" />
                                        Screen Resumes
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'jobs' && (
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-900">Jobs Management</h2>
                                <Link to="/admin/jobs/post">
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Post New Job
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {postedJobs.map((job) => (
                                        <tr key={job._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{job.title}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {job.applications?.length || 0}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    job.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {job.status || 'active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Link to={`/admin/jobs/${job._id}/applicants`}>
                                                        <button className="text-blue-600 hover:text-blue-900">
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                    </Link>
                                                    <Link to={`/admin/jobs/${job._id}/edit`}>
                                                        <button className="text-yellow-600 hover:text-yellow-900">
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteJob(job._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'applicants' && (
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-900">Applicants Management</h2>
                                <div className="flex gap-2">
                                    <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2">
                                        <Download className="h-4 w-4" />
                                        Export
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {applicants.slice(0, 20).map((app) => (
                                        <tr key={app._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{app.applicant?.fullname || 'Unknown'}</div>
                                                <div className="text-sm text-gray-500">{app.applicant?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {app.jobTitle}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    app.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                    app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {app.status || 'pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(app.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <button className="text-green-600 hover:text-green-900">
                                                        <CheckCircle className="h-4 w-4" />
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-900">
                                                        <XCircle className="h-4 w-4" />
                                                    </button>
                                                    <Link to={`/admin/resume-screening?applicant=${app._id}`}>
                                                        <button className="text-blue-600 hover:text-blue-900">
                                                            <FileText className="h-4 w-4" />
                                                        </button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'interviews' && (
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-900">Interview Management</h2>
                                <button
                                    onClick={() => setActiveTab('overview')} // Placeholder - could open modal
                                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Schedule Interview
                                </button>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {interviews.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        No interviews scheduled yet
                                    </div>
                                ) : (
                                    interviews.map((interview) => (
                                        <div key={interview._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <Calendar className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="font-medium text-gray-900">{interview.candidateName || 'Candidate'}</p>
                                                    <p className="text-sm text-gray-600">{interview.jobTitle || 'Job'}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(interview.date).toLocaleDateString()} at {interview.time}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`px-2 py-1 rounded text-xs ${
                                                    interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                                    interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    interview.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {interview.status || 'scheduled'}
                                                </span>
                                                <div className="flex gap-2">
                                                    <button className="text-yellow-600 hover:text-yellow-900">
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-900">
                                                        <XCircle className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'companies' && (
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-900">Companies Management</h2>
                                <Link to="/admin/companies/create">
                                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        Add Company
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {companies.map((company) => (
                                    <div key={company._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Building className="h-8 w-8 text-gray-400" />
                                            <div>
                                                <h3 className="font-medium text-gray-900">{company.name}</h3>
                                                <p className="text-sm text-gray-600">{company.location}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-3">{company.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">{company.jobs?.length || 0} jobs</span>
                                            <Link to={`/admin/companies/${company._id}`}>
                                                <button className="text-blue-600 hover:text-blue-900 text-sm">
                                                    Manage
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;