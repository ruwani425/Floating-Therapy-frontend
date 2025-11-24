import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useEffect } from "react";

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, userRole, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/login");
      } else if (userRole !== "admin") {
        navigate("/");
      }
    }
  }, [isAuthenticated, userRole, isLoading, navigate]);

  if (isLoading) return null;

  if (isAuthenticated && userRole === "admin") {
    return <Outlet />;
  }

  return null;
};
