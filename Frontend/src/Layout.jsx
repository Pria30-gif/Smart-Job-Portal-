<<<<<<< HEAD
=======
import React from "react";
>>>>>>> 6618275fdd35b182832587422b0561aa353c758e
import { Outlet } from "react-router-dom";
import Navbar from "./components/components_lite/Navbar";
import Footer from "./components/components_lite/Footer"; // Import the Footer

const Layout = () => {
  return (
    // This container ensures the layout takes up the full screen height
    // and arranges children (Navbar, main, Footer) vertically.
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* The 'main' area will grow to fill available space, pushing the footer down. */}
      {/* 'container mx-auto' centers your content with appropriate padding. */}
      <main className="flex-grow container mx-auto px-4 py-8">
        
        {/* The Outlet is crucial: it renders the specific page component 
            (e.g., Home, Login, Jobs) based on the current URL. */}
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;

