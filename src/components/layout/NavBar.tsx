// src/components/layout/NavBar.tsx

import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Flower, CalendarCheck, Phone, Menu, X, LogOut, DollarSign } from "lucide-react"; // Imported DollarSign for pricing icon
import { useAuth } from "../AuthProvider";

// Define the appointment path constant
const APPOINTMENT_PATH = "/appointments";
// Define the new pricing path constant
const PRICING_PATH = "/pricing"; 


// --- Client Navigation Component ---

// This utility component contains the client-facing navigation logic
const ClientNavigation: React.FC<{
  location: ReturnType<typeof useLocation>;
}> = ({ location }) => {
  // Helper function to apply active styling to regular Link tags based on current location
  const getLinkClassName = (path: string) => {
    const isActive = location.pathname === path;
    // NOTE: We are manually applying the active style since Link doesn't have the isActive prop
    return `hover:text-theta-blue transition duration-150 ${
      isActive ? "text-theta-blue font-semibold" : ""
    }`;
  };

  return (
    <nav className="hidden lg:flex space-x-8 text-gray-600 font-display font-medium items-center">
      <Link
        to="/"
        className={getLinkClassName("/")} // Using Link for Home and applying active style manually
      >
        Home
      </Link>
      <Link
        to="/about"
        className={getLinkClassName("/about")}
      >
        About
      </Link>
      <Link
        to="/service"
        className={getLinkClassName("/service")}
      >
        Services
      </Link>
      {/* REPLACED Reviews with Pricing */}
      <Link
        to={PRICING_PATH}
        className={getLinkClassName(PRICING_PATH)}
      >
        Pricing
      </Link>
      {/* End Replacement */}

      <Link
        to="/blog"
        className={getLinkClassName("/blog")}
      >
        Blog
      </Link>
      <Link
        to="/contact-us"
        className={getLinkClassName("/contact-us")}
      >
        Contact us
      </Link>
    </nav>
  );
};

// --- Main NavBar Component ---

const NavBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Unified Navbar for the client site, replacing the old SecureApp bar.

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // NOTE: This NavBar now uses the styling and structure of the client-side Header
  // and is fixed/sticky for continuous display, just like the original Header.
  return (
    <header className="fixed top-0 left-0 w-full bg-white bg-opacity-95 shadow-lg z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-3 text-gray-800">
          <Flower className="w-7 h-7 text-theta-blue" />
          <div className="flex flex-col">
            <Link to="/" className="font-serif text-2xl font-bold tracking-tight hover:text-theta-blue transition-colors duration-300">
              Theta Lounge
            </Link>
            <span className="text-xs font-display text-gray-500 tracking-wider hidden sm:block">
              Physical Therapy
            </span>
          </div>
        </div>

        {/* Main Navigation Links - Desktop Only */}
        <ClientNavigation location={location} />

        {/* Action Buttons & Utility - Desktop Only */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Phone Number */}
          <span className="hidden xl:inline-flex text-gray-600 items-center text-sm font-display font-medium">
            <Phone className="w-4 h-4 mr-1 text-theta-blue" /> (422) 820 820
          </span>

          {/* Appointment Button */}
          <Link 
            to={APPOINTMENT_PATH}
            className="flex items-center px-5 py-2.5 bg-gradient-to-r from-theta-blue to-theta-blue-dark text-white font-display font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <CalendarCheck className="w-5 h-5 mr-2" />
            Appointment
          </Link>

          {/* Auth Button */}
          {isAuthenticated ? (
            // --- LOGOUT BUTTON (Matching Admin style/structure) ---
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 p-3 rounded-xl font-semibold text-sm bg-theta-blue text-white transition-all duration-200 hover:opacity-90 shadow-md"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2.5 bg-theta-blue-light text-theta-blue font-display font-semibold rounded-full hover:bg-gradient-to-r hover:from-theta-blue hover:to-theta-blue-dark hover:text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Log In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 text-gray-600 hover:text-theta-blue focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden fixed top-[72px] left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="px-4 py-6 space-y-4">
          {/* Mobile Navigation Links */}
          <Link to="/" onClick={closeMobileMenu} className={`block py-3 px-4 rounded-xl font-display font-medium transition-all duration-300 ${ location.pathname === "/" ? "bg-gradient-to-r from-theta-blue to-theta-blue-dark text-white shadow-lg" : "text-gray-700 hover:bg-blue-50 hover:text-theta-blue" }`}> Home </Link>
          <Link to="/about" onClick={closeMobileMenu} className={`block py-3 px-4 rounded-xl font-display font-medium transition-all duration-300 ${ location.pathname === "/about" ? "bg-gradient-to-r from-theta-blue to-theta-blue-dark text-white shadow-lg" : "text-gray-700 hover:bg-blue-50 hover:text-theta-blue" }`}> About </Link>
          <Link to="/service" onClick={closeMobileMenu} className={`block py-3 px-4 rounded-xl font-display font-medium transition-all duration-300 ${ location.pathname === "/service" ? "bg-gradient-to-r from-theta-blue to-theta-blue-dark text-white shadow-lg" : "text-gray-700 hover:bg-blue-50 hover:text-theta-blue" }`}> Services </Link>
          
          {/* REPLACED Reviews with Pricing (Mobile) */}
          <Link to={PRICING_PATH} onClick={closeMobileMenu} className={`block py-3 px-4 rounded-xl font-display font-medium transition-all duration-300 ${ location.pathname === PRICING_PATH ? "bg-gradient-to-r from-theta-blue to-theta-blue-dark text-white shadow-lg" : "text-gray-700 hover:bg-blue-50 hover:text-theta-blue" }`}> Pricing </Link>
          {/* End Replacement */}

          <Link to="/blog" onClick={closeMobileMenu} className={`block py-3 px-4 rounded-xl font-display font-medium transition-all duration-300 ${ location.pathname === "/blog" ? "bg-gradient-to-r from-theta-blue to-theta-blue-dark text-white shadow-lg" : "text-gray-700 hover:bg-blue-50 hover:text-theta-blue" }`}> Blog </Link>
          <Link to="/contact-us" onClick={closeMobileMenu} className={`block py-3 px-4 rounded-xl font-display font-medium transition-all duration-300 ${ location.pathname === "/contact-us" ? "bg-gradient-to-r from-theta-blue to-theta-blue-dark text-white shadow-lg" : "text-gray-700 hover:bg-blue-50 hover:text-theta-blue" }`}> Contact us </Link>
           
            <Link to={APPOINTMENT_PATH} onClick={closeMobileMenu} className={`block py-3 px-4 rounded-xl font-display font-medium transition-all duration-300 ${ location.pathname === APPOINTMENT_PATH ? "bg-gradient-to-r from-theta-blue to-theta-blue-dark text-white shadow-lg" : "text-gray-700 hover:bg-blue-50 hover:text-theta-blue" }`}> Appointments </Link>


            {/* Mobile Phone Number */}
          <div className="pt-4 border-t border-gray-200">
            <a
              href="tel:4228208200"
              className="flex items-center py-3 px-4 text-gray-600 hover:text-theta-blue transition-colors duration-300 rounded-lg hover:bg-blue-50"
            >
              <Phone className="w-5 h-5 mr-3 text-theta-blue" />
              <div>
                <p className="text-xs font-display text-gray-500">Call Us</p>
                <p className="font-display font-semibold">(422) 820 820</p>
              </div>
            </a>
          </div>

          {/* Mobile Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* Appointment Button */}
            <Link 
                to={APPOINTMENT_PATH}
                onClick={closeMobileMenu}
                className="w-full flex items-center justify-center px-4 py-3.5 bg-gradient-to-r from-theta-blue to-theta-blue-dark text-white font-display font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <CalendarCheck className="w-5 h-5 mr-2" />
              Book Appointment
            </Link>

            {isAuthenticated ? (
                // --- MOBILE LOGOUT BUTTON ---
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-white bg-theta-blue shadow-lg hover:opacity-90 transform transition-all duration-300"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="block text-center w-full px-4 py-3.5 bg-theta-blue-light text-theta-blue font-display font-semibold rounded-full hover:bg-gradient-to-r hover:from-theta-blue hover:to-theta-blue-dark hover:text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Log In
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;