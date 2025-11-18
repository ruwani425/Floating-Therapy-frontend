// src/components/layout/NavBar.tsx

import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import type { AdminCardProps } from "../../types";

const NavBar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Use the new color classes for NavLink status
  const getNavLinkClass = (
    { isActive, isPending }: { isActive: boolean; isPending: boolean },
    checkPrefix: string = ""
  ): string => {
    const pathPrefixMatch =
      checkPrefix &&
      location.pathname.toLowerCase().startsWith(checkPrefix.toLowerCase());

    // Applying palette: Active is Dark Blue (#035C84), Base Text is Light Blue (#E6F3FF), Hover is Medium Blue (#0873A1)
    const activeClassName = "text-white bg-dark-blue-600";
    const baseClassName = "text-light-blue-100 hover:bg-dark-blue-700";
    const pendingClassName = "opacity-75";
    const isLinkActive = checkPrefix ? pathPrefixMatch : isActive;

    return `px-3 py-2 rounded-lg font-medium transition duration-150 ${
      isPending ? pendingClassName : ""
    } ${isLinkActive ? activeClassName : baseClassName}`;
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-dark-blue-800 p-4 shadow-lg sticky top-0 z-10 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <NavLink
          to="/"
          className="text-2xl font-bold text-white tracking-wider"
        >
          SecureApp
        </NavLink>
        <div className="flex space-x-4">
          <NavLink
            to="/"
            className={({ isActive, isPending }) => {
              const isExactRoot = location.pathname.toLowerCase() === "/";
              // Applying palette: Active is Dark Blue (#035C84), Base Text is Light Blue (#E6F3FF), Hover is Medium Blue (#0873A1)
              const activeClassName = "text-white bg-dark-blue-600";
              const baseClassName = "text-light-blue-100 hover:bg-dark-blue-700";
              const pendingClassName = "opacity-75";

              return `px-3 py-2 rounded-lg font-medium transition duration-150 ${
                isPending ? pendingClassName : ""
              } ${isExactRoot ? activeClassName : baseClassName}`;
            }}
          >
            Client Web
          </NavLink>
          <NavLink
            to="/admin/dashboard"
            className={(state) => getNavLinkClass(state, "/admin")}
          >
            Admin Panel
          </NavLink>

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              // Logout is a critical action, keeping red but can be themed if desired
              className="px-3 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition duration-150"
            >
              Logout
            </button>
          ) : (
            <NavLink to="/login" className={(state) => getNavLinkClass(state)}>
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export const Layout: React.FC = () => {
  const location = useLocation();

  const noNavbarRoutes = ["/login", "/signup"];

  const shouldHideNavbar = noNavbarRoutes.includes(
    location.pathname.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-light-blue-50 font-inter w-screen overflow-x-hidden">
      {/* Inject Custom Style Block here to ensure the classes used in NavBar are defined */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* NavBar Custom Palette */
            .bg-dark-blue-800 { background-color: #003F5C; } 
            .bg-dark-blue-600 { background-color: #035C84; }
            .hover\\:bg-dark-blue-700:hover { background-color: #0873A1; } 
            .text-light-blue-100 { color: #E6F3FF; }
            .bg-light-blue-50 { background-color: #F0F8FF; }
          `,
        }}
      />
      {!shouldHideNavbar && <NavBar />}{" "}
      <main className="w-full mx-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default NavBar;