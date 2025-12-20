// src/pages/admin/ReportsPage.tsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../core/axios";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Package,
  Download,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Clock,
  Bath,
  XCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const THETA_COLORS = {
  darkestBlue: "#0F1F2E",
  darkBlue: "#1a3a52",
  mediumBlue: "#3a7ca5",
  lightBlue: "#6ab4dc",
  cyan: "#A0E7E5",
  lightCyan: "#D4F1F9",
  white: "#FFFFFF",
  bgLight: "#F5F8FC",
};

const CHART_COLORS = [
  "#06B6D4",
  "#3B82F6",
  "#EC4899",
  "#F59E0B",
  "#10B981",
  "#8B5CF6",
];

interface ReportMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  totalBookings: number;
  bookingsGrowth: number;
  avgSessionValue: number;
  cancellationRate: number;
  topPackage: string;
  utilizationRate: number;
}

interface BookingTrend {
  date: string;
  bookings: number;
  revenue: number;
}

interface StatusBreakdown {
  status: string;
  count: number;
  percentage: number;
}

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30"); // 7, 30, 90 days
  const [metrics, setMetrics] = useState<ReportMetrics | null>(null);
  const [bookingTrends, setBookingTrends] = useState<BookingTrend[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<StatusBreakdown[]>([]);

  useEffect(() => {
    fetchReportsData();
  }, [dateRange]);

  const fetchReportsData = async () => {
    try {
      setIsLoading(true);
      console.log("📊 Fetching reports data for:", dateRange, "days");

      // Fetch real reports data from backend
      const response = await apiRequest.get<{
        success: boolean;
        data: {
          metrics: ReportMetrics;
          bookingTrends: BookingTrend[];
          statusBreakdown: StatusBreakdown[];
          dailyTrends: any[];
          topPackages: any[];
          dateRange: any;
        };
      }>("/reports/analytics", {
        params: { dateRange },
      });

      if (response.success && response.data) {
        console.log("✅ Reports data loaded:", response.data);

        setMetrics(response.data.metrics);
        setBookingTrends(response.data.bookingTrends);
        setStatusBreakdown(response.data.statusBreakdown);

        console.log("📈 Metrics:", response.data.metrics);
        console.log("📊 Trends:", response.data.bookingTrends);
        console.log("📋 Status:", response.data.statusBreakdown);
      }
    } catch (error) {
      console.error("❌ Failed to fetch reports data:", error);
      // Set empty data on error
      setMetrics({
        totalRevenue: 0,
        revenueGrowth: 0,
        totalBookings: 0,
        bookingsGrowth: 0,
        avgSessionValue: 0,
        cancellationRate: 0,
        topPackage: "N/A",
        utilizationRate: 0,
      });
      setBookingTrends([]);
      setStatusBreakdown([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = () => {
    console.log("Exporting report...");
    // Implement export functionality
  };

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change?: number;
    icon: React.ElementType;
    color: string;
  }> = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            {title}
          </p>
          <h3
            className="text-2xl font-bold"
            style={{ color: THETA_COLORS.darkestBlue }}
          >
            {value}
          </h3>
          {change !== undefined && (
            <div
              className={`flex items-center mt-2 text-sm font-semibold ${
                change >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {change >= 0 ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              {Math.abs(change)}% vs last period
            </div>
          )}
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: color }}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{ backgroundColor: THETA_COLORS.bgLight }}
      className="min-h-screen"
    >
      <div className="w-full mx-auto p-6 md:p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center text-sm font-semibold mb-4 hover:opacity-70 transition-opacity"
            style={{ color: THETA_COLORS.mediumBlue }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>

          <div className="flex justify-between items-start">
            <div>
              <h1
                className="text-4xl font-bold mb-2"
                style={{ color: THETA_COLORS.darkestBlue }}
              >
                Reports & Analytics
              </h1>
              <p
                className="text-sm font-semibold"
                style={{ color: THETA_COLORS.mediumBlue }}
              >
                Comprehensive insights into your business performance
              </p>
            </div>

            <div className="flex gap-3">
              {/* Date Range Filter */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ color: THETA_COLORS.darkestBlue }}
              >
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
              </select>

              {/* Export Button */}
              <button
                onClick={handleExportReport}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90 shadow-sm"
                style={{ backgroundColor: THETA_COLORS.mediumBlue }}
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Key Metrics Grid */}
            <section className="mb-8">
              <h2
                className="text-xl font-bold mb-4"
                style={{ color: THETA_COLORS.darkestBlue }}
              >
                Key Performance Indicators
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <MetricCard
                  title="Total Revenue"
                  value={`Rs ${metrics?.totalRevenue.toLocaleString()}`}
                  change={metrics?.revenueGrowth}
                  icon={DollarSign}
                  color={THETA_COLORS.mediumBlue}
                />
                <MetricCard
                  title="Total Bookings"
                  value={metrics?.totalBookings || 0}
                  change={metrics?.bookingsGrowth}
                  icon={Calendar}
                  color="#10B981"
                />
                <MetricCard
                  title="Avg Session Value"
                  value={`Rs ${metrics?.avgSessionValue}`}
                  icon={TrendingUp}
                  color="#EC4899"
                />
                <MetricCard
                  title="Utilization Rate"
                  value={`${metrics?.utilizationRate}%`}
                  icon={Bath}
                  color="#F59E0B"
                />
              </div>
            </section>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Booking Trends Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3
                  className="text-lg font-bold mb-4"
                  style={{ color: THETA_COLORS.darkestBlue }}
                >
                  Booking & Revenue Trends
                </h3>
                {bookingTrends.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={bookingTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" />
                      <YAxis stroke="#64748b" allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: THETA_COLORS.white,
                          border: `1px solid ${THETA_COLORS.lightBlue}`,
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="bookings"
                        stackId="1"
                        stroke={CHART_COLORS[0]}
                        fill={CHART_COLORS[0]}
                        fillOpacity={0.6}
                        name="Bookings"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px]">
                    <Calendar
                      className="w-16 h-16 mb-4 opacity-30"
                      style={{ color: THETA_COLORS.mediumBlue }}
                    />
                    <p
                      className="text-sm font-semibold"
                      style={{ color: THETA_COLORS.mediumBlue }}
                    >
                      No booking data available
                    </p>
                  </div>
                )}
              </div>

              {/* Status Breakdown Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h3
                  className="text-lg font-bold mb-4"
                  style={{ color: THETA_COLORS.darkestBlue }}
                >
                  Booking Status Breakdown
                </h3>
                {statusBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusBreakdown as any[]}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(props: any) => {
                          if (props.percent !== undefined) {
                            return `${(props.percent * 100).toFixed(1)}%`;
                          }
                          return "";
                        }}
                      >
                        {statusBreakdown.map((_entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} bookings`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px]">
                    <TrendingUp
                      className="w-16 h-16 mb-4 opacity-30"
                      style={{ color: THETA_COLORS.mediumBlue }}
                    />
                    <p
                      className="text-sm font-semibold"
                      style={{ color: THETA_COLORS.mediumBlue }}
                    >
                      No status data available
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Metrics */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Top Performing Package */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: THETA_COLORS.lightCyan }}
                  >
                    <Package
                      className="w-6 h-6"
                      style={{ color: THETA_COLORS.darkestBlue }}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Top Package
                    </p>
                    <h3
                      className="text-lg font-bold"
                      style={{ color: THETA_COLORS.darkestBlue }}
                    >
                      {metrics?.topPackage}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Revenue Contribution</span>
                  <span className="font-bold text-emerald-600">42%</span>
                </div>
              </div>

              {/* Cancellation Rate */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-red-50">
                    <XCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Cancellation Rate
                    </p>
                    <h3
                      className="text-lg font-bold"
                      style={{ color: THETA_COLORS.darkestBlue }}
                    >
                      {metrics?.cancellationRate}%
                    </h3>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Industry Average</span>
                  <span className="font-bold text-slate-600">7.2%</span>
                </div>
              </div>

              {/* Avg Response Time */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "#FEF3C7" }}
                  >
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Avg Response Time
                    </p>
                    <h3
                      className="text-lg font-bold"
                      style={{ color: THETA_COLORS.darkestBlue }}
                    >
                      2.5 hours
                    </h3>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Target</span>
                  <span className="font-bold text-emerald-600">
                    {"< 4 hours"}
                  </span>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
