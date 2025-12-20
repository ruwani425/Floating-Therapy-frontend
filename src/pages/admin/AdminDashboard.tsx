// src/pages/admin/AdminDashboard.tsx

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // ADDED: Redux selector hook
import type { RootState } from "../../redux/store"; // ADDED: Redux type
import apiRequest from "../../core/axios";

// Import Firebase dependencies and utility functions (RUNTIME VALUES/FUNCTIONS)
import { auth, logout } from "../../firebase/firebase-config";

// Import runtime functions from firebase/auth (VALUES)
import { onAuthStateChanged } from "firebase/auth";

// Import type-only declarations from firebase/auth (TYPES)
import type { User as FirebaseAuthUser } from "firebase/auth";

import {
  User,
  CalendarCheck,
  Bath,
  DollarSign,
  Settings,
  Shield,
  BookOpen,
  TrendingUp,
  Clock,
  Wallet,
  ArrowUp,
  ArrowDown,
  Waves,
  LogOut,
  Package,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import AdminCard from "../../components/admin/AdminCard";

const THETA_COLORS = {
  darkestBlue: "#0F1F2E",
  darkBlue: "#1a3a52",
  mediumBlue: "#3a7ca5",
  lightBlue: "#6ab4dc",
  cyan: "#A0E7E5",
  lightCyan: "#D4F1F9",
  white: "#FFFFFF",
  bgLight: "#F5F8FC",
  bgLighter: "#FAFBFC",
};

const CHART_COLORS = ["#06B6D4", "#3B82F6", "#EC4899", "#F59E0B", "#10B981"];

// Interfaces for Dashboard Data
interface KPIData {
  value: string;
  change: string;
  trend: "up" | "down";
}

interface DashboardStats {
  kpis: {
    totalRevenue: KPIData;
    newBookings: KPIData;
    tankAvailability: KPIData;
    avgSession: KPIData;
  };
  weeklyTrends: Array<{ name: string; bookings: number }>;
  tankUtilization: Array<{ name: string; utilization: number; ideal: number }>;
  revenueBreakdown: Array<{ name: string; value: number }>;
}

// Map options to specific permission keys used in the backend
const dashboardOptions = [
  {
    title: "Appointment Bookings",
    path: "/admin/reservations",
    description: "Manage all appointments and schedules.",
    icon: CalendarCheck,
    permissionKey: "reservations",
  },
  {
    title: "Tank Management",
    path: "/admin/tank-management",
    description: "Monitor floating tank capacity and status.",
    icon: Bath,
    permissionKey: "tanks",
  },
  {
    title: "User Accounts",
    path: "/admin/users",
    description: "Manage all system users and members.",
    icon: User,
    permissionKey: "users",
  },
  {
    title: "Services & Pricing",
    path: "/admin/package-management",
    description: "Update therapy services and package rates.",
    icon: DollarSign,
    permissionKey: "packages",
  },
  {
    title: "Package Activations",
    path: "/admin/package-activations",
    description: "Manage customer package activation requests.",
    icon: Package,
    permissionKey: "activations",
  },
  {
    title: "Reports & Analytics",
    path: "/admin/reports",
    description: "View performance metrics and insights.",
    icon: TrendingUp,
    permissionKey: "reports",
  },
  {
    title: "Content Management",
    path: "/admin/content",
    description: "Edit website pages and blog posts.",
    icon: BookOpen,
    permissionKey: "content",
  },
  {
    title: "Access Control",
    path: "/admin/access-controll",
    description: "Manage admin permissions and roles.",
    icon: Shield,
    permissionKey: "access_control",
  },
  {
    title: "Global Settings",
    path: "/admin/system-settings",
    description: "Configure application settings.",
    icon: Settings,
    permissionKey: "settings",
  },
];

// --- CHART AND CARD COMPONENTS ---

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
}) => (
  <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col">
       {" "}
    <div className="flex items-start justify-between mb-4">
           {" "}
      <div className="flex-1">
               {" "}
        <p
          className="text-xs font-bold uppercase tracking-wider mb-3"
          style={{ color: THETA_COLORS.mediumBlue }}
        >
                    {title}       {" "}
        </p>
               {" "}
        <h4
          className="text-3xl font-bold mb-3"
          style={{ color: THETA_COLORS.darkestBlue }}
        >
                    {value}       {" "}
        </h4>
               {" "}
        <div
          className={`flex items-center text-xs font-semibold ${
            trend === "up" ? "text-emerald-600" : "text-red-600"
          }`}
        >
                   {" "}
          {trend === "up" ? (
            <ArrowUp className="w-3 h-3 mr-1" />
          ) : (
            <ArrowDown className="w-3 h-3 mr-1" />
          )}
                    {change} vs last period        {" "}
        </div>
             {" "}
      </div>
           {" "}
      <div
        className="p-4 rounded-xl"
        style={{ backgroundColor: THETA_COLORS.lightCyan }}
      >
               {" "}
        <Icon className="w-6 h-6" style={{ color: THETA_COLORS.darkestBlue }} />
             {" "}
      </div>
         {" "}
    </div>
     {" "}
  </div>
);

const BookingTrendLineChart: React.FC<{
  data: Array<{ name: string; bookings: number }>;
}> = ({ data }) => {
  const hasData = data.some((item) => item.bookings > 0);

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
      <div className="relative z-10">
        <h3
          className="text-lg font-bold mb-6"
          style={{ color: THETA_COLORS.darkestBlue }}
        >
          Weekly Booking Trends
        </h3>
        {hasData || data.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: THETA_COLORS.white,
                  border: `1px solid ${THETA_COLORS.lightBlue}`,
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke={CHART_COLORS[0]}
                strokeWidth={3}
                activeDot={{ r: 8 }}
                name="Total Bookings"
                dot={{ fill: CHART_COLORS[0], r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-[280px]">
            <CalendarCheck
              className="w-16 h-16 mb-4 opacity-30"
              style={{ color: THETA_COLORS.mediumBlue }}
            />
            <p
              className="text-sm font-semibold"
              style={{ color: THETA_COLORS.mediumBlue }}
            >
              No booking data yet
            </p>
            <p
              className="text-xs mt-2 opacity-70"
              style={{ color: THETA_COLORS.mediumBlue }}
            >
              Booking trends will appear once appointments are made
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const TankUtilizationBarChart: React.FC<{
  data: Array<{ name: string; utilization: number; ideal: number }>;
}> = ({ data }) => {
  const hasData = data && data.length > 0;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
      <div className="relative z-10">
        <h3
          className="text-lg font-bold mb-6"
          style={{ color: THETA_COLORS.darkestBlue }}
        >
          Tank Utilization
        </h3>
        {hasData ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis
                unit="%"
                domain={[0, 100]}
                stroke="#64748b"
                allowDecimals={false}
              />
              <Tooltip
                formatter={(value) => [`${value}%`, ""]}
                contentStyle={{ backgroundColor: THETA_COLORS.white }}
              />
              <Legend />
              <Bar
                dataKey="utilization"
                fill={CHART_COLORS[1]}
                name="Actual Utilization"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="ideal"
                fill={CHART_COLORS[3]}
                name="Ideal Target"
                radius={[8, 8, 0, 0]}
                opacity={0.5}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-[280px]">
            <Bath
              className="w-16 h-16 mb-4 opacity-30"
              style={{ color: THETA_COLORS.mediumBlue }}
            />
            <p
              className="text-sm font-semibold"
              style={{ color: THETA_COLORS.mediumBlue }}
            >
              No tank data available
            </p>
            <p
              className="text-xs mt-2 opacity-70"
              style={{ color: THETA_COLORS.mediumBlue }}
            >
              Tank utilization will be calculated once system is configured
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- ADMIN DASHBOARD MAIN COMPONENT ---

const AdminDashboard: React.FC = () => {
  // 1. STATE TO HOLD CURRENT FIREBASE USER
  const [currentUser, setCurrentUser] = useState<FirebaseAuthUser | null>(null);

  // Hook for navigation (Requires 'react-router-dom')
  const navigate = useNavigate();

  // 2. GET PERMISSIONS FROM REDUX STATE
  const adminPermissions = useSelector(
    (state: RootState) => state.auth.adminPermissions
  );

  // 3. STATE FOR DASHBOARD DATA
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // 4. DETERMINE VISIBLE OPTIONS BASED ON PERMISSIONS
  const visibleDashboardOptions = useMemo(() => {
    console.log("🔍 Checking admin permissions:", {
      permissionsArray: adminPermissions,
      permissionsLength: adminPermissions?.length || 0,
      isArray: Array.isArray(adminPermissions),
    });

    // If permissions haven't loaded or are empty, return an empty array
    if (!adminPermissions || adminPermissions.length === 0) {
      console.warn("⚠️ No admin permissions found");
      return [];
    }

    // Filter options where the option's permissionKey is present in the adminPermissions array
    const visible = dashboardOptions.filter((option) =>
      adminPermissions.includes(option.permissionKey)
    );

    console.log(
      "✅ Visible dashboard options:",
      visible.map((o) => o.title)
    );
    return visible;
  }, [adminPermissions]);

  // 5. FETCH DASHBOARD STATISTICS
  const fetchDashboardStats = async () => {
    try {
      setIsLoadingStats(true);
      console.log("📊 Fetching dashboard statistics...");

      const response = await apiRequest.get<{
        success: boolean;
        data: DashboardStats;
      }>("/dashboard/stats");

      if (response.success && response.data) {
        setDashboardStats(response.data);
        console.log("✅ Dashboard statistics loaded successfully");
      }
    } catch (error) {
      console.error("❌ Failed to fetch dashboard statistics:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // 6. EFFECT TO LISTEN FOR AUTH CHANGES
  useEffect(() => {
    // Use the exported 'auth' instance
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // 7. EFFECT TO FETCH DASHBOARD STATS ON MOUNT
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // 8. HANDLERS
  const handleProfileClick = () => {
    console.log("Navigating to user profile.");
  };

  const handleLogoutClick = async () => {
    try {
      await logout(); // Call the exported Firebase logout utility
      console.log("Logout Successful. Redirecting...");
      navigate("/"); // Redirect to the main page or login page
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  // 9. PREPARE KPI DATA FROM API
  const KPI_DATA = dashboardStats
    ? [
        {
          title: "Total Revenue",
          value: dashboardStats.kpis.totalRevenue.value,
          change: dashboardStats.kpis.totalRevenue.change,
          trend: dashboardStats.kpis.totalRevenue.trend,
          icon: Wallet,
          color: THETA_COLORS.darkestBlue,
        },
        {
          title: "New Bookings",
          value: dashboardStats.kpis.newBookings.value,
          change: dashboardStats.kpis.newBookings.change,
          trend: dashboardStats.kpis.newBookings.trend,
          icon: CalendarCheck,
          color: THETA_COLORS.darkestBlue,
        },
        {
          title: "Tank Availability",
          value: dashboardStats.kpis.tankAvailability.value,
          change: dashboardStats.kpis.tankAvailability.change,
          trend: dashboardStats.kpis.tankAvailability.trend,
          icon: Bath,
          color: THETA_COLORS.darkestBlue,
        },
        {
          title: "Avg Session",
          value: dashboardStats.kpis.avgSession.value,
          change: dashboardStats.kpis.avgSession.change,
          trend: dashboardStats.kpis.avgSession.trend,
          icon: Clock,
          color: THETA_COLORS.darkestBlue,
        },
      ]
    : []; // --- JSX RENDER ---

  return (
    <div
      style={{ backgroundColor: THETA_COLORS.bgLight }}
      className="min-h-screen"
    >
           {" "}
      <div className="w-full mx-auto p-6 md:p-8 max-w-7xl">
               {" "}
        <header className="mb-10">
                   {" "}
          <div className="flex justify-between items-start">
                        {/* Logo/Title Section */}           {" "}
            <div>
                           {" "}
              <div className="flex items-center gap-4 mb-2">
                               {" "}
                <div
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: THETA_COLORS.lightCyan }}
                >
                                   {" "}
                  <Waves
                    className="w-7 h-7"
                    style={{ color: THETA_COLORS.darkestBlue }}
                  />
                                 {" "}
                </div>
                               {" "}
                <h1
                  className="text-4xl font-bold"
                  style={{ color: THETA_COLORS.darkestBlue }}
                >
                                    Admin Dashboard                {" "}
                </h1>
                             {" "}
              </div>
                           {" "}
              <p
                className="text-sm font-semibold uppercase tracking-wider ml-16"
                style={{ color: THETA_COLORS.mediumBlue }}
              >
                                Manage Your Theta Lounge Operations            
                 {" "}
              </p>
                         {" "}
            </div>
                        {/* Profile and Logout Section */}           {" "}
            <div className="flex items-center gap-4 mt-1">
                           {" "}
              {/* Profile Icon Button: CONDITIONAL RENDER FOR GOOGLE PHOTO */} 
                         {" "}
              <button
                onClick={handleProfileClick}
                className="p-1 rounded-full transition-all duration-200 hover:opacity-85 overflow-hidden border-2 border-slate-300 shadow-md"
                style={{
                  backgroundColor: THETA_COLORS.darkestBlue,
                  width: "48px",
                  height: "48px",
                }}
                aria-label="View Profile"
                title={
                  currentUser
                    ? `View Profile (${currentUser.displayName || "Admin"})`
                    : "View Profile"
                }
              >
                               {" "}
                {currentUser && currentUser.photoURL ? (
                  // Display Google Profile Image
                  <img
                    src={currentUser.photoURL}
                    alt="User Profile"
                    referrerPolicy="no-referrer" // Important for Google images
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  // Fallback User Icon
                  <User
                    className="w-8 h-8 mx-auto"
                    style={{ color: THETA_COLORS.white }}
                  />
                )}
                             {" "}
              </button>
                            {/* Logout Button */}             {" "}
              <button
                onClick={handleLogoutClick}
                className="flex items-center gap-2 p-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 shadow-md"
                style={{
                  backgroundColor: THETA_COLORS.mediumBlue,
                  color: THETA_COLORS.white,
                }}
                aria-label="Logout"
              >
                                <LogOut className="w-5 h-5" />               {" "}
                <span className="hidden sm:inline">Logout</span>             {" "}
              </button>
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </header>
                {/* --- QUICK ACCESS SECTION --- */}       {" "}
        <section className="mb-12">
                   {" "}
          <div className="mb-8">
                       {" "}
            <p
              className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: THETA_COLORS.mediumBlue }}
            >
                            Quick Access            {" "}
            </p>
                       {" "}
            <h2
              className="text-3xl font-bold"
              style={{ color: THETA_COLORS.darkestBlue }}
            >
                            Management Tools            {" "}
            </h2>
                     {" "}
          </div>
                   {" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                       {" "}
            {visibleDashboardOptions.map((option, index) => (
              <AdminCard
                key={option.title}
                title={option.title}
                path={option.path}
                description={option.description}
                Icon={option.icon}
                animationDelay={index * 0.05}
              />
            ))}
          </div>
          {adminPermissions &&
            adminPermissions.length > 0 &&
            visibleDashboardOptions.length === 0 && (
              <p
                className="text-lg p-6 rounded-xl text-center"
                style={{
                  color: THETA_COLORS.mediumBlue,
                  backgroundColor: THETA_COLORS.lightCyan,
                }}
              >
                You do not have permissions to access any management tools.
              </p>
            )}
                 {" "}
        </section>
        {/* --- PERFORMANCE OVERVIEW SECTION --- */}
        <section className="mb-12">
          <div className="mb-8">
            <p
              className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: THETA_COLORS.mediumBlue }}
            >
              Performance Overview
            </p>
            <h2
              className="text-3xl font-bold"
              style={{ color: THETA_COLORS.darkestBlue }}
            >
              Quick Stats
            </h2>
          </div>
          {isLoadingStats ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {KPI_DATA.map((kpi) => (
                <StatCard
                  key={kpi.title}
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change}
                  trend={kpi.trend}
                  icon={kpi.icon}
                  color={kpi.color}
                />
              ))}
            </div>
          )}
        </section>
        {/* --- ANALYTICS SECTION --- */}
        <section>
          <div className="mb-8">
            <p
              className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: THETA_COLORS.mediumBlue }}
            >
              Analytics
            </p>
            <h2
              className="text-3xl font-bold"
              style={{ color: THETA_COLORS.darkestBlue }}
            >
              Performance Insights
            </h2>
          </div>
          {isLoadingStats ? (
            <div className="flex justify-center items-center h-80">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : dashboardStats ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BookingTrendLineChart data={dashboardStats.weeklyTrends} />
              <TankUtilizationBarChart data={dashboardStats.tankUtilization} />
              <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center hover:shadow-lg transition-all duration-300 relative overflow-hidden">
                <div className="relative z-10">
                  <TrendingUp
                    className="w-12 h-12 mb-4"
                    style={{ color: THETA_COLORS.darkestBlue }}
                  />
                  <p
                    className="font-bold text-lg"
                    style={{ color: THETA_COLORS.darkestBlue }}
                  >
                    More analytics coming soon
                  </p>
                  <p
                    className="text-sm mt-2"
                    style={{ color: THETA_COLORS.mediumBlue }}
                  >
                    Enhanced reporting features in development
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-slate-200 text-center">
              <p className="text-lg" style={{ color: THETA_COLORS.mediumBlue }}>
                Unable to load analytics data. Please try refreshing the page.
              </p>
            </div>
          )}
        </section>
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default AdminDashboard;
