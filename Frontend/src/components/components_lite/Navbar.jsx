import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
<<<<<<< HEAD
import { setUser } from '../../redux/authSlice';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';
import Notification from '../Notification';

// ✅ Always use backend URL from env (NO hardcoded ports)
const API_BASE_URL = import.meta.env.VITE_API_URL || '';
=======
import { USER_API_ENDPOINT } from '../../utils/data';
import { setUser } from '../../redux/authSlice';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
<<<<<<< HEAD
            const res = await axios.post(
                `${API_BASE_URL}/api/user/logout`,
                {},
                { withCredentials: true }
            );

            if (res.data?.success) {
                dispatch(setUser(null));
                toast.success(res.data.message || 'Logged out successfully');
                navigate('/login');
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error(error.response?.data?.message || "Logout failed");
=======
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
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
        }
    };

    return (
        <div className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
<<<<<<< HEAD
                
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    Smart Job Portal
                </Link>

=======
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    Smart Job Portal
                </Link>
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex items-center gap-6 text-gray-600 font-medium">
                        <Link to="/" className="hover:text-blue-600">Home</Link>
                        <Link to="/jobs" className="hover:text-blue-600">Jobs</Link>
<<<<<<< HEAD
                        <Link to="/salary-predictor" className="hover:text-blue-600">💰 Salary Predictor</Link>
                        <Link to="/placement-calculator" className="hover:text-blue-600">Placement Calculator</Link>
                        <Link to="/career-coach" className="hover:text-blue-600">Career Coach</Link>
                    </nav>

=======
                        {/* --- LINK ADDED BACK --- */}
                        <Link to="/salary-calculator" className="hover:text-blue-600">Salary Calculator</Link>
                        <Link to="/career-coach" className="hover:text-blue-600">Career Coach</Link>
                    </nav>
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
                    <div className="flex items-center gap-4">
                        {!user ? (
                            <>
                                <Link to="/login">
                                    <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                                        Login
                                    </button>
                                </Link>
                                <Link to="/register">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                        Register
                                    </button>
                                </Link>
                            </>
                        ) : (
                            <>
<<<<<<< HEAD
                                <Notification />

                                {user?.role === "Recruiter" && (
                                    <Link to="/admin">
                                        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                                            Admin Panel
                                        </button>
                                    </Link>
                                )}

=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
                                <Link to="/profile">
                                    <button className="px-4 py-2 text-blue-600 font-semibold">
                                        Profile
                                    </button>
                                </Link>
<<<<<<< HEAD

=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
                                <button
                                    onClick={logoutHandler}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;