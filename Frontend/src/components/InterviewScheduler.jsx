import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
<<<<<<< HEAD
import { Calendar, Clock, User, MessageSquare, Edit, X, Check, AlertCircle, Search, Filter } from 'lucide-react';
=======
import { Calendar, Clock, User, MessageSquare } from 'lucide-react';
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e

const InterviewScheduler = () => {
    const [interviews, setInterviews] = useState([]);
    const [formData, setFormData] = useState({
        candidateId: '',
        jobId: '',
        date: '',
        time: '',
<<<<<<< HEAD
        notes: '',
        interviewType: 'technical'
    });
    const [loading, setLoading] = useState(false);
    const [editingInterview, setEditingInterview] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
=======
        notes: ''
    });
    const [loading, setLoading] = useState(false);
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            const res = await axios.get('/api/interview/', {
                withCredentials: true,
            });
            if (res.data.success) {
                setInterviews(res.data.interviews);
            }
        } catch (error) {
            console.error('Failed to fetch interviews:', error);
        }
    };
<<<<<<< HEAD

=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
<<<<<<< HEAD
            const url = editingInterview ? `/api/interview/${editingInterview._id}` : '/api/interview/schedule';
            const method = editingInterview ? axios.put : axios.post;
            
            const res = await method(url, formData, {
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(editingInterview ? 'Interview updated successfully!' : 'Interview scheduled successfully!');
                resetForm();
                fetchInterviews();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save interview');
=======
            const res = await axios.post('/api/interview/schedule', formData, {
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success('Interview scheduled successfully!');
                setFormData({
                    candidateId: '',
                    jobId: '',
                    date: '',
                    time: '',
                    notes: ''
                });
                fetchInterviews();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to schedule interview');
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
        } finally {
            setLoading(false);
        }
    };

<<<<<<< HEAD
    const resetForm = () => {
        setFormData({
            candidateId: '',
            jobId: '',
            date: '',
            time: '',
            notes: '',
            interviewType: 'technical'
        });
        setEditingInterview(null);
        setShowForm(false);
    };

    const handleEdit = (interview) => {
        setFormData({
            candidateId: interview.candidateId,
            jobId: interview.jobId,
            date: interview.date.split('T')[0],
            time: interview.time,
            notes: interview.notes || '',
            interviewType: interview.interviewType || 'technical'
        });
        setEditingInterview(interview);
        setShowForm(true);
    };

    const handleCancel = async (interviewId) => {
        if (window.confirm('Are you sure you want to cancel this interview?')) {
            try {
                const res = await axios.put(`/api/interview/${interviewId}`, { status: 'cancelled' }, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    toast.success('Interview cancelled successfully');
                    fetchInterviews();
                }
            } catch (error) {
                toast.error('Failed to cancel interview');
            }
        }
    };

    const handleStatusUpdate = async (interviewId, status) => {
        try {
            const res = await axios.put(`/api/interview/${interviewId}`, { status }, {
                withCredentials: true,
            });
            if (res.data.success) {
                toast.success(`Interview marked as ${status}`);
                fetchInterviews();
            }
        } catch (error) {
            toast.error('Failed to update interview status');
        }
    };

    const filteredInterviews = interviews.filter(interview => {
        const matchesSearch = searchTerm === '' || 
            interview.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            interview.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || interview.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
<<<<<<< HEAD
        <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Interview Scheduler</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    {showForm ? 'Cancel' : 'Schedule Interview'}
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by candidate or job..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="w-48">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {showForm && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">
                        {editingInterview ? 'Edit Interview' : 'Schedule New Interview'}
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
=======
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Interview Scheduler</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Schedule Interview Form */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Schedule New Interview</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Candidate ID
                            </label>
                            <input
                                type="text"
                                name="candidateId"
                                value={formData.candidateId}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Job ID
                            </label>
                            <input
                                type="text"
                                name="jobId"
                                value={formData.jobId}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Time
                            </label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
<<<<<<< HEAD
                                Interview Type
                            </label>
                            <select
                                name="interviewType"
                                value={formData.interviewType}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="technical">Technical</option>
                                <option value="behavioral">Behavioral</option>
                                <option value="system">System Design</option>
                                <option value="hr">HR</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
<<<<<<< HEAD
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Additional notes..."
                            />
                        </div>
                        <div className="md:col-span-2 flex gap-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : (editingInterview ? 'Update Interview' : 'Schedule Interview')}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Interviews List */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700">Scheduled Interviews</h3>
                {filteredInterviews.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No interviews found
                    </div>
                ) : (
                    filteredInterviews.map((interview) => (
                        <div key={interview._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-2">
                                        <User className="h-5 w-5 text-gray-500" />
                                        <span className="font-medium">{interview.candidateName || 'Candidate'}</span>
                                        <span className={`px-2 py-1 rounded text-xs ${
                                            interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                            interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            interview.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {interview.status || 'scheduled'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(interview.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            {interview.time}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageSquare className="h-4 w-4" />
                                            {interview.interviewType || 'Technical'}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">{interview.jobTitle || 'Job Title'}</p>
                                    {interview.notes && (
                                        <p className="text-sm text-gray-500 mt-1">{interview.notes}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {interview.status === 'scheduled' && (
                                        <>
                                            <button
                                                onClick={() => handleEdit(interview)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                                                title="Edit"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(interview._id, 'completed')}
                                                className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                                                title="Mark Completed"
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleCancel(interview._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                                title="Cancel"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </>
                                    )}
                                    {interview.status === 'completed' && (
                                        <span className="text-green-600 text-sm">Completed</span>
                                    )}
                                    {interview.status === 'cancelled' && (
                                        <span className="text-red-600 text-sm">Cancelled</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
=======
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {loading ? 'Scheduling...' : 'Schedule Interview'}
                        </button>
                    </form>
                </div>

                {/* Scheduled Interviews */}
                <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700">Scheduled Interviews</h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {interviews.length === 0 ? (
                            <p className="text-gray-500">No interviews scheduled yet.</p>
                        ) : (
                            interviews.map((interview) => (
                                <div key={interview._id} className="bg-white p-4 rounded-md shadow-sm border">
                                    <div className="flex items-center gap-2 mb-2">
                                        <User size={16} className="text-blue-600" />
                                        <span className="font-medium">{interview.candidateId}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar size={16} className="text-green-600" />
                                        <span>{new Date(interview.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock size={16} className="text-purple-600" />
                                        <span>{interview.time}</span>
                                    </div>
                                    {interview.notes && (
                                        <div className="flex items-start gap-2">
                                            <MessageSquare size={16} className="text-gray-600 mt-0.5" />
                                            <span className="text-sm text-gray-600">{interview.notes}</span>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
            </div>
        </div>
    );
};

export default InterviewScheduler;
