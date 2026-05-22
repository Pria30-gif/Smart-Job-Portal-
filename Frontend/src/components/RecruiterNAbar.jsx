<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
=======
import React from 'react';
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { USER_API_ENDPOINT } from '../utils/data';
import { setUser } from '../redux/authSlice';
import { toast } from 'sonner';
<<<<<<< HEAD
import { LogOut, User, Briefcase, Building2, File, Bell, Settings, ChevronDown } from 'lucide-react';
=======
import { LogOut, User, Briefcase, Building2 } from 'lucide-react';
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e

const RecruiterNavbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
<<<<<<< HEAD
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [notifications] = useState(3); // Placeholder for notification count
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e

    const logoutHandler = async () => {
        try {
            const res = await axios.post(`${USER_API_ENDPOINT}/logout`, {}, {
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Error logging out.");
        }
    };

    return (
        <div className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
<<<<<<< HEAD
                <div className="flex items-center gap-4">
                    <Link to="/admin" className="text-2xl font-bold text-blue-600">
                        Smart Job Portal
                    </Link>
                </div>
                <div className="flex items-center gap-6">
                    <nav className="flex items-center gap-8 text-gray-600 font-medium">
                        <Link to="/admin" className="hover:text-blue-600 transition-colors">Dashboard</Link>
                        <Link to="/admin/companies" className="hover:text-blue-600 transition-colors">Companies</Link>
                        <Link to="/admin/jobs" className="hover:text-blue-600 transition-colors">Jobs</Link>
                        <Link to="/admin/applicants" className="hover:text-blue-600 transition-colors">Applicants</Link>
                        <Link to="/admin/resume-screening" className="hover:text-blue-600 transition-colors">Resume Screening</Link>
                        <Link to="/admin/interview-scheduler" className="hover:text-blue-600 transition-colors">Interview Scheduler</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-gray-600 hover:text-blue-600">
                            <Bell size={20} />
                            {notifications > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {notifications}
                                </span>
                            )}
                        </button>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100"
                            >
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    {user?.fullname?.charAt(0).toUpperCase() || 'A'}
                                </div>
                                <ChevronDown size={16} />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                    <Link to="/admin/profile" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100">
                                        <User size={16} />
                                        Profile
                                    </Link>
                                    <Link to="/admin/settings" className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100">
                                        <Settings size={16} />
                                        Settings
                                    </Link>
                                    <button
                                        onClick={logoutHandler}
                                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
=======
                <Link to="/admin/companies" className="text-2xl font-bold text-blue-600">
                    Smart Job Portal <span className="text-gray-500 text-lg font-medium">- Admin Panel</span>
                </Link>
                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
                        <Link to="/admin/companies" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                            <Building2 size={18} /> Companies
                        </Link>
                        <Link to="/admin/jobs" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                            <Briefcase size={18} /> Jobs
                        </Link>
                        <Link to="/admin/jobs/1/applicants" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                            <User size={18} /> Applicants
                        </Link>
                        <Link to="/admin/interview-scheduler" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                            <User size={18} /> Interview Scheduler
                        </Link>
                        <Link to="/admin/profile" className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                            <User size={18} /> Profile
                        </Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={logoutHandler}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-semibold"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterNavbar;

