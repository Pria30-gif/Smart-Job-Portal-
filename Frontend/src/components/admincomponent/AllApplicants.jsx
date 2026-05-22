import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { APPLICATION_API_ENDPOINT } from '@/utils/data';
import { toast } from 'react-hot-toast';
import { Check, X, Edit, Users, Search, Filter, SortAsc, SortDesc, Download } from 'lucide-react';

const AllApplicants = () => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    // Enhanced features state
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedApplicants, setSelectedApplicants] = useState([]);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [bulkActionLoading, setBulkActionLoading] = useState(false);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${APPLICATION_API_ENDPOINT}/get`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    // Flatten all applications from all jobs
                    const allApplications = res.data.applications.flatMap(jobApp =>
                        jobApp.applications.map(app => ({
                            ...app,
                            jobTitle: jobApp.job.title,
                            jobId: jobApp.job._id
                        }))
                    );
                    setApplicants(allApplications);
                }
            } catch (error) {
                console.error("Failed to fetch applicants:", error);
                toast.error(error.response?.data?.message || "Failed to fetch applicants.");
                setApplicants([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAllApplicants();
    }, []);

    const handleUpdateStatus = async (applicationId, status) => {
        try {
            const res = await axios.post(`${APPLICATION_API_ENDPOINT}/status/${applicationId}/update`, { status }, {
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(res.data.message);
                setApplicants(prevApplicants =>
                    prevApplicants.map(app =>
                        app._id === applicationId ? { ...app, status } : app
                    )
                );
                setSelectedApplicant(null);
            }
        } catch (error) {
            console.error("Failed to update status:", error);
            toast.error(error.response?.data?.message || "Failed to update status.");
        }
    };

    const handleBulkAction = async (action) => {
        if (selectedApplicants.length === 0) {
            toast.error("Please select applicants first");
            return;
        }

        setBulkActionLoading(true);
        try {
            const promises = selectedApplicants.map(appId =>
                axios.post(`${APPLICATION_API_ENDPOINT}/status/${appId}/update`, { status: action }, {
                    withCredentials: true,
                })
            );

            await Promise.all(promises);

            toast.success(`${selectedApplicants.length} applicants ${action} successfully`);
            setSelectedApplicants([]);
            setShowBulkActions(false);

            // Refresh applicants list
            const res = await axios.get(`${APPLICATION_API_ENDPOINT}/get`, {
                withCredentials: true,
            });
            if (res.data.success) {
                const allApplications = res.data.applications.flatMap(jobApp =>
                    jobApp.applications.map(app => ({
                        ...app,
                        jobTitle: jobApp.job.title,
                        jobId: jobApp.job._id
                    }))
                );
                setApplicants(allApplications);
            }
        } catch (error) {
            console.error("Bulk action failed:", error);
            toast.error("Failed to perform bulk action");
        } finally {
            setBulkActionLoading(false);
        }
    };

    const handleExportData = () => {
        const filteredApplicants = getFilteredAndSortedApplicants();
        const csvData = filteredApplicants.map(app => ({
            Job: app.jobTitle,
            Name: app.applicant.fullname,
            Email: app.applicant.email,
            Status: app.status,
            AppliedDate: new Date(app.createdAt).toLocaleDateString(),
            Resume: app.applicant?.profile?.resumes?.[0]?.url ? 'Available' : 'Not Available'
        }));

        const csvContent = [
            Object.keys(csvData[0]).join(','),
            ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `all_applicants_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("Data exported successfully");
    };

    const handleSelectApplicant = (appId) => {
        setSelectedApplicants(prev =>
            prev.includes(appId)
                ? prev.filter(id => id !== appId)
                : [...prev, appId]
        );
    };

    const handleSelectAll = () => {
        const filteredApplicants = getFilteredAndSortedApplicants();
        const allIds = filteredApplicants.map(app => app._id);
        setSelectedApplicants(prev =>
            prev.length === allIds.length ? [] : allIds
        );
    };

    const getFilteredAndSortedApplicants = () => {
        let filtered = applicants.filter(app => {
            const matchesSearch = searchTerm === '' ||
                app.applicant.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'name':
                    aValue = a.applicant.fullname.toLowerCase();
                    bValue = b.applicant.fullname.toLowerCase();
                    break;
                case 'email':
                    aValue = a.applicant.email.toLowerCase();
                    bValue = b.applicant.email.toLowerCase();
                    break;
                case 'job':
                    aValue = a.jobTitle.toLowerCase();
                    bValue = b.jobTitle.toLowerCase();
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                case 'date':
                    aValue = new Date(a.createdAt);
                    bValue = new Date(b.createdAt);
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    };

    return (
        <div className="max-w-7xl mx-auto my-10 p-8 bg-white rounded-lg shadow-md">
            <div className="border-b pb-4 mb-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">All Applicants</h1>
                        <p className="text-lg text-gray-600 mt-2">Manage applicants across all your job postings</p>
                    </div>
                </div>
            </div>

            {/* Enhanced Features Bar */}
            {applicants.length > 0 && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or job..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Filter size={20} className="text-gray-500" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="name">Sort by Name</option>
                                    <option value="email">Sort by Email</option>
                                    <option value="job">Sort by Job</option>
                                    <option value="status">Sort by Status</option>
                                    <option value="date">Sort by Date</option>
                                </select>
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
                                >
                                    {sortOrder === 'asc' ? <SortAsc size={20} /> : <SortDesc size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {selectedApplicants.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">{selectedApplicants.length} selected</span>
                                    {!showBulkActions ? (
                                        <button
                                            onClick={() => setShowBulkActions(true)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors"
                                        >
                                            Bulk Actions
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleBulkAction('accepted')}
                                                disabled={bulkActionLoading}
                                                className="px-3 py-2 bg-green-600 text-white rounded-md text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                                            >
                                                {bulkActionLoading ? 'Processing...' : 'Accept All'}
                                            </button>
                                            <button
                                                onClick={() => handleBulkAction('rejected')}
                                                disabled={bulkActionLoading}
                                                className="px-3 py-2 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                                            >
                                                {bulkActionLoading ? 'Processing...' : 'Reject All'}
                                            </button>
                                            <button
                                                onClick={() => setShowBulkActions(false)}
                                                className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-semibold hover:bg-gray-300"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={handleExportData}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition-colors"
                            >
                                <Download size={20} />
                                Export CSV
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                        <span>
                            Showing {getFilteredAndSortedApplicants().length} of {applicants.length} applicants
                        </span>
                        {selectedApplicants.length > 0 && (
                            <button
                                onClick={() => setSelectedApplicants([])}
                                className="text-blue-600 hover:underline"
                            >
                                Clear selection
                            </button>
                        )}
                    </div>
                </div>
            )}

            {loading ? (
                <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm animate-pulse">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 rounded-full bg-gray-200"></div>
                                    <div>
                                        <div className="h-6 w-32 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-4 w-48 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                                <div className="h-5 w-24 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : applicants.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No applicants found across all your job postings.</p>
            ) : (
                <div className="space-y-6">
                    {getFilteredAndSortedApplicants().length > 0 && (
                        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <input
                                type="checkbox"
                                checked={selectedApplicants.length === getFilteredAndSortedApplicants().length && getFilteredAndSortedApplicants().length > 0}
                                onChange={handleSelectAll}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">
                                Select All ({getFilteredAndSortedApplicants().length} applicants)
                            </span>
                        </div>
                    )}

                    {getFilteredAndSortedApplicants().map((app) => (
                        <div key={app._id} className={`bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${selectedApplicants.includes(app._id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedApplicants.includes(app._id)}
                                        onChange={() => handleSelectApplicant(app._id)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                    />

                                    <img
                                        src={app.applicant.profile?.profilePhoto || 'https://via.placeholder.com/150'}
                                        alt={app.applicant.fullname}
                                        className="h-16 w-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">{app.applicant.fullname}</h2>
                                        <p className="text-sm text-gray-500">{app.applicant.email}</p>
                                        <p className="text-xs text-blue-600 font-medium">Applied for: {app.jobTitle}</p>
                                        <p className="text-xs text-gray-400">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="mb-2">
                                        {app.applicant?.profile?.resumes?.[0]?.url ? (
                                            <a
                                                href={app.applicant.profile.resumes[0].url.startsWith('http') ? app.applicant.profile.resumes[0].url : `http://localhost:5011${app.applicant.profile.resumes[0].url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline font-medium text-sm"
                                            >
                                                View Resume
                                            </a>
                                        ) : (
                                            <span className="text-gray-500 text-sm">No Resume</span>
                                        )}
                                    </div>
                                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${app.status === 'accepted' ? 'bg-green-100 text-green-800' : app.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Application ID: {app._id}
                                </div>
                                <div className="flex items-center gap-4">
                                    {app.status === "pending" ? (
                                        selectedApplicant === app._id ? (
                                            <>
                                                <button
                                                    onClick={() => handleUpdateStatus(app._id, "accepted")}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition-colors"
                                                >
                                                    <Check size={18} /> Accept
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(app._id, "rejected")}
                                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
                                                >
                                                    <X size={18} /> Reject
                                                </button>
                                                <button
                                                    onClick={() => setSelectedApplicant(null)}
                                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold hover:bg-gray-300"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => setSelectedApplicant(app._id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition-colors"
                                            >
                                                <Edit size={18} /> Update Status
                                            </button>
                                        )
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span className={`font-semibold text-lg ${app.status === "accepted" ? 'text-green-600' : 'text-red-600'}`}>
                                                Status: {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                            </span>
                                            {app.status !== "pending" && (
                                                <button
                                                    onClick={() => handleUpdateStatus(app._id, "pending")}
                                                    className="px-3 py-1 bg-yellow-500 text-white rounded-md text-sm font-semibold hover:bg-yellow-600 transition-colors"
                                                >
                                                    Reset to Pending
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllApplicants;
