<<<<<<< HEAD
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
import { LogOut, Briefcase, Building, User, FileText, Users, BarChart3, TrendingUp, PenTool, Calendar } from 'lucide-react';
=======
import { LogOut, Briefcase, Building, User } from 'lucide-react';
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e

const RecruiterNavbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        <div className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/admin/companies" className="text-2xl font-bold text-blue-600">
                    Smart Job Portal - <span className="text-indigo-500">Recruiter</span>
                </Link>
                <div className="flex items-center gap-6">
<<<<<<< HEAD
                    <nav className="flex items-center gap-6 text-gray-600 font-medium">
                        <Link to="/admin" className="hover:text-blue-600 flex items-center gap-2"><BarChart3 size={16}/> Admin Dashboard</Link>
=======
                    <nav className="hidden md:flex items-center gap-6 text-gray-600 font-medium">
                        <Link to="/admin/companies" className="hover:text-blue-600 flex items-center gap-2"><Building size={16}/> Companies</Link>
                        <Link to="/admin/jobs" className="hover:text-blue-600 flex items-center gap-2"><Briefcase size={16}/> Jobs</Link>
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
                    </nav>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <Link to="/admin/profile">
                                    <button className="flex items-center gap-2 px-4 py-2 text-blue-600 font-semibold">
                                        <User size={18}/> Profile
                                    </button>
                                </Link>
                                <button
                                    onClick={logoutHandler}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login">
                                <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                                    Login
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruiterNavbar;

