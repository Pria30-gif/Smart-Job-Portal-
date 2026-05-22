import { useSelector } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Mail, User, Building, Calendar } from "lucide-react";

const AdminProfile = () => {
    const { user } = useSelector((store) => store.auth);

    const getInitials = (name) => {
        if (!name) return "A";
        const names = name.split(' ');
        return names.length > 1 ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase() : name[0].toUpperCase();
    };

    return (
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8 shadow-lg">
            <div className="flex items-center gap-8 mb-8">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                    <AvatarFallback className="text-2xl font-bold">
                        {getInitials(user?.fullname)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.fullname}</h1>
                    <p className="text-lg text-blue-600 font-semibold mb-2">Recruiter</p>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Mail size={18} />
                        <span>{user?.email}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <User className="text-blue-600" size={24} />
                        <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium text-gray-900">{user?.fullname}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email Address</p>
                            <p className="font-medium text-gray-900">{user?.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Role</p>
                            <p className="font-medium text-gray-900">{user?.role}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <Building className="text-green-600" size={24} />
                        <h3 className="text-xl font-semibold text-gray-900">Account Information</h3>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-500">Account Type</p>
                            <p className="font-medium text-gray-900">Recruiter Account</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Member Since</p>
                            <p className="font-medium text-gray-900">
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recruiter Dashboard Access</h3>
                <p className="text-gray-700 mb-4">
                    As a recruiter, you have access to comprehensive job management tools including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Company management and setup</li>
                    <li>Job posting and editing</li>
                    <li>Applicant review and management</li>
                    <li>Interview scheduling</li>
                    <li>Resume screening with AI assistance</li>
                    <li>Content management</li>
                </ul>
            </div>
        </div>
    );
};

export default AdminProfile;