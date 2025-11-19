// src/components/layout/NavBar.tsx

import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Outlet, NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import {
    Flower,
    Star,
    CalendarCheck,
    Phone,
} from "lucide-react";
import type { AdminCardProps } from "../../types"; // Assuming this type is available

// --- Client Navigation Component ---

// This utility component contains the client-facing navigation logic
const ClientNavigation: React.FC<{ location: ReturnType<typeof useLocation> }> = ({ location }) => {
    // Determine if we are on the Home Page to use anchor links correctly
    const isHomePage = location.pathname === '/';

    // Helper function to apply active styling to regular Link tags based on current location
    const getLinkClassName = (path: string) => {
        const isActive = location.pathname === path;
        // NOTE: We are manually applying the active style since Link doesn't have the isActive prop
        return `hover:text-dark-blue-600 transition duration-150 ${isActive ? 'text-dark-blue-600 font-semibold' : ''}`;
    };

    return (
        <nav className="hidden lg:flex space-x-8 text-gray-600 font-medium items-center">
            <Link
                to="/"
                className={getLinkClassName('/')} // Using Link for Home and applying active style manually
            >
                Home
            </Link>
            <Link
                to="/about"
                className={getLinkClassName('/about')} // Changed from NavLink to Link
            >
                About
            </Link>
            <a
                href={isHomePage ? "#services" : "/#services"}
                className="hover:text-dark-blue-600 transition duration-150"
            >
                Services
            </a>
            <a
                href={isHomePage ? "#reviews" : "/#reviews"}
                className="hover:text-dark-blue-600 transition duration-150"
            >
                Reviews
            </a>
            
            <Link
                to="/blog" 
                className={getLinkClassName('/blog')} // Changed from NavLink to Link
            >
                Blog
            </Link>
            <Link
                to="/contact-us" 
                className={getLinkClassName('/contact-us')} // Changed from NavLink to Link
            >
                Contact us
            </Link>
            {/* Keeping Admin access hidden or under a different condition for a pure client nav */}
        </nav>
    );
}


// --- Main NavBar Component ---

const NavBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Unified Navbar for the client site, replacing the old SecureApp bar.

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  // NOTE: This NavBar now uses the styling and structure of the client-side Header
  // and is fixed/sticky for continuous display, just like the original Header.
  return (
    <header className="fixed top-0 left-0 w-full bg-white bg-opacity-95 shadow-lg z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            
            {/* Logo Section */}
            <div className="flex items-center space-x-2 text-xl font-serif text-gray-800">
                <Flower className="w-6 h-6 text-dark-blue-600" />
                <Link to="/" className="font-bold tracking-wider"> 
                    Theta Lounge
                </Link>
                <span className="text-sm text-gray-500 ml-4 hidden sm:inline">
                    Physical Therapy
                </span>
            </div>

            {/* Main Navigation Links */}
            <ClientNavigation location={location} />

            {/* Action Buttons & Utility (Phone, Appointment, Auth) */}
            <div className="flex items-center space-x-4">
                
                {/* Phone Number (Optional addition based on a common client need) */}
                <span className="hidden md:inline text-gray-600 flex items-center text-sm font-medium">
                    <Phone className="w-4 h-4 mr-1 text-dark-blue-600" /> (422) 820 820
                </span>

                {/* Appointment Button */}
                <button className="flex items-center px-4 py-2 bg-dark-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-dark-blue-700 transition duration-300">
                    <CalendarCheck className="w-5 h-5 mr-2" />
                    Appointment
                </button>
                
                {/* Auth/Utility Button (Buy Now or Admin Login Placeholder) */}
                {isAuthenticated ? (
                    <button
                        onClick={handleLogout}
                        className="hidden sm:inline px-4 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition duration-300"
                    >
                        Logout
                    </button>
                ) : (
                    <Link to="/login" className="hidden sm:inline px-4 py-2 bg-light-blue-200 text-dark-blue-600 font-semibold rounded-full hover:bg-light-blue-400 hover:text-white transition duration-300">
                        Log In
                    </Link>
                )}
            </div>
        </div>
    </header>
  );
};

// --- Layout Component (where styles are injected) ---

export const Layout: React.FC = () => {
  const location = useLocation();

  const noNavbarRoutes = ["/login", "/signup"];

  const shouldHideNavbar = noNavbarRoutes.includes(
    location.pathname.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-light-blue-50 font-inter w-screen overflow-x-hidden">
      {/* Inject Custom Style Block here to define custom colors globally */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* CUSTOM COLOR PALETTE MAPPING */
            .text-dark-blue-600 { color: #035C84; } 
            .bg-dark-blue-600 { background-color: #035C84; }
            .hover\\:bg-dark-blue-700:hover { background-color: #0873A1; } 
            .text-dark-blue-800 { color: #003F5C; } 
            .border-dark-blue-600 { border-color: #035C84; } 
            
            .text-light-blue-200 { color: #94CCE7; } 
            .bg-light-blue-50 { background-color: #F0F8FF; }
            .bg-light-blue-100 { background-color: #E6F3FF; } 
            .bg-light-blue-200 { background-color: #94CCE7; } 
             .bg-light-blue-400 { background-color: #2DA0CC; } 
            .hover\\:bg-light-blue-300:hover { background-color: #79BDE1; } 
             .hover\\:bg-light-blue-400:hover { background-color: #2DA0CC; } 
          `,
        }}
      />
      
      {!shouldHideNavbar && <NavBar />}{" "}
      
      <main className="w-full mx-auto pb-0"> 
        <Outlet />
      </main>
    </div>
  );
};

export default NavBar;