
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import NavBar, { Layout } from "./components/layout/NavBar";
import ClientPage from "./pages/ClientPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import SignupPage from "./pages/SignUpPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* The root path applies the common Layout (NavBar, etc.) */}
          <Route path="/" element={<Layout />}>
            {/* PUBLIC ROUTES: Accessible to everyone */}
            <Route index element={<ClientPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="About" element={<AboutPage />} />
            <Route path="contact-us" element={<ContactPage />} />
            <Route path="blog" element={<BlogPage />} />
            {/* PROTECTED ADMIN ROUTES: Protected by the <ProtectedRoute /> element */}
            <Route path="admin" element={<ProtectedRoute />}>
              {/* These routes are only accessible if ProtectedRoute allows rendering the Outlet */}
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="products" element={<AdminProductsPage />} />

              {/* Redirect /admin to /admin/dashboard */}
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* 404 Catch-all: For any unmatched path */}
            <Route
              path="*"
              element={
                <div className="text-center text-xl p-10 text-gray-500">
                  404 | Page Not Found
                </div>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
