<<<<<<< HEAD
=======
import React from 'react';
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
import { Outlet } from 'react-router-dom';
import RecruiterNavbar from './RecruiterNAbar';

const AdminLayout = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <RecruiterNavbar />
            <main className="p-4 md-p-8">
                {/* This Outlet will render the specific admin page */}
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;

<<<<<<< HEAD
 
=======
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
