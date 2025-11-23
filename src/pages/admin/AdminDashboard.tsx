import type React from "react"
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
} from "lucide-react"

import {
  PieChart,
  Pie,
  Cell,
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
} from "recharts"
import AdminCard from "../../components/admin/AdminCard"

// --- THETA LOUNGE COLOR PALETTE ---
const THETA_COLORS = {
  lightestBlue: "#92B8D9",
  lightBlue: "#92B8D9",
  mediumBlue: "#475D73",
  darkBlue: "#233547",
  white: "#FFFFFF",
  bgLight: "#F5F8FC",
  darkGray: "#1a1a1a",
}

const CHART_COLORS = [
  "#0FA3B1", // Teal
  "#1E90FF", // Dodger Blue
  "#FF6B9D", // Pink
  "#FFA500", // Orange
  "#20B2AA", // Light Sea Green
]

// --- MOCK DATA & COLORS ---
const PIE_DATA = [
  { name: "60 Min Float", value: 400 },
  { name: "90 Min Float", value: 300 },
  { name: "Package Deal", value: 300 },
  { name: "Add-on Service", value: 200 },
]

const BAR_DATA = [
  { name: "Tank 1 (Neptune)", utilization: 85, ideal: 90 },
  { name: "Tank 2 (Orion)", utilization: 72, ideal: 90 },
  { name: "Tank 3 (Zen)", utilization: 92, ideal: 90 },
]

const LINE_DATA = [
  { name: "Wk 1", bookings: 45 },
  { name: "Wk 2", bookings: 60 },
  { name: "Wk 3", bookings: 52 },
  { name: "Wk 4", bookings: 75 },
]

const KPI_DATA = [
  { title: "Total Revenue", value: "$12,450", change: "+5.1%", trend: "up", icon: Wallet, color: "#233547" },
  { title: "New Bookings", value: "145", change: "+12%", trend: "up", icon: CalendarCheck, color: "#475D73" },
  { title: "Tank Availability", value: "82%", change: "-2%", trend: "down", icon: Bath, color: "#92B8D9" },
  { title: "Avg Session", value: "75 min", change: "+3%", trend: "up", icon: Clock, color: "#B8D4E8" },
]

const dashboardOptions = [
  {
    title: "Appointment Bookings",
    path: "/admin/reservations",
    description: "Manage all appointments and schedules.",
    icon: CalendarCheck,
    iconColor: "#233547",
  },
  {
    title: "Tank Management",
    path: "/admin/tank-management",
    description: "Monitor floating tank capacity and status.",
    icon: Bath,
    iconColor: "#233547", // Changed from #475D73 to #233547 (dark blue)
  },
  {
    title: "User Accounts",
    path: "/admin/users",
    description: "Manage all system users and members.",
    icon: User,
    iconColor: "#233547", // Changed from #92B8D9 to #233547 (dark blue)
  },
  {
    title: "Services & Pricing",
    path: "/admin/pricing",
    description: "Update therapy services and package rates.",
    icon: DollarSign,
    iconColor: "#233547", // Changed from #B8D4E8 to #233547 (dark blue)
  },
  {
    title: "Reports & Analytics",
    path: "/admin/reports",
    description: "View performance metrics and insights.",
    icon: TrendingUp,
    iconColor: "#233547",
  },
  {
    title: "Content Management",
    path: "/admin/content",
    description: "Edit website pages and blog posts.",
    icon: BookOpen,
    iconColor: "#233547", // Changed from #475D73 to #233547 (dark blue)
  },
  {
    title: "Access Control",
    path: "/admin/roles",
    description: "Manage admin permissions and roles.",
    icon: Shield,
    iconColor: "#233547", // Changed from #92B8D9 to #233547 (dark blue)
  },
  {
    title: "Global Settings",
    path: "/admin/system-settings",
    description: "Configure application settings.",
    icon: Settings,
    iconColor: "#233547", // Changed from #B8D4E8 to #233547 (dark blue)
  },
]

interface PieLabelRenderProps {
  name?: string
  percent?: number
}

// --- STAT CARD COMPONENT ---
const StatCard: React.FC<(typeof KPI_DATA)[0] & { icon: React.ElementType }> = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
}) => (
  <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 flex flex-col">
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <p
          className="text-xs font-display font-bold uppercase tracking-wider mb-2"
          style={{ color: THETA_COLORS.mediumBlue }}
        >
          {title}
        </p>
        <h4 className="text-3xl font-serif font-bold mb-3" style={{ color: THETA_COLORS.darkBlue }}>
          {value}
        </h4>
        <div
          className={`flex items-center text-xs font-semibold ${trend === "up" ? "text-green-600" : "text-red-600"}`}
        >
          {trend === "up" ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
          {change} vs last period
        </div>
      </div>
      <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
        <Icon className="w-6 h-6" style={{ color: color }} />
      </div>
    </div>
  </div>
)

// --- CHART COMPONENTS ---
const BookingTrendLineChart: React.FC = () => (
  <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
    <div
      className="absolute inset-0 opacity-5 pointer-events-none"
      style={{
        backgroundImage: `url(/placeholder.svg?height=280&width=560&query=floating therapy meditation water)`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    ></div>
    <div className="relative z-10">
      <h3 className="text-xl font-serif font-bold mb-6" style={{ color: THETA_COLORS.darkBlue }}>
        Weekly Booking Trends
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={LINE_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8f0f7" />
          <XAxis dataKey="name" stroke={THETA_COLORS.mediumBlue} />
          <YAxis stroke={THETA_COLORS.mediumBlue} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="bookings"
            stroke={CHART_COLORS[0]}
            strokeWidth={3}
            activeDot={{ r: 8 }}
            name="Total Bookings"
            dot={{ fill: CHART_COLORS[0], r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
)

const TankUtilizationBarChart: React.FC = () => (
  <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
    <div
      className="absolute inset-0 opacity-5 pointer-events-none"
      style={{
        backgroundImage: `url(/placeholder.svg?height=280&width=560&query=floating tank spa water)`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    ></div>
    <div className="relative z-10">
      <h3 className="text-xl font-serif font-bold mb-6" style={{ color: THETA_COLORS.darkBlue }}>
        Tank Utilization
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={BAR_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8f0f7" />
          <XAxis dataKey="name" stroke={THETA_COLORS.mediumBlue} />
          <YAxis unit="%" domain={[0, 100]} stroke={THETA_COLORS.mediumBlue} />
          <Tooltip formatter={(value, name) => [`${value}%`, name]} />
          <Legend />
          <Bar dataKey="utilization" fill={CHART_COLORS[1]} name="Actual Utilization" radius={[8, 8, 0, 0]} />
          <Bar dataKey="ideal" fill={CHART_COLORS[3]} name="Ideal Target" radius={[8, 8, 0, 0]} opacity={0.6} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
)

const RevenuePieChart: React.FC = () => (
  <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 relative overflow-hidden">
    <div
      className="absolute inset-0 opacity-5 pointer-events-none"
      style={{
        backgroundImage: `url(/placeholder.svg?height=280&width=280&query=wellness therapy relaxation)`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    ></div>
    <div className="relative z-10">
      <h3 className="text-xl font-serif font-bold mb-6" style={{ color: THETA_COLORS.darkBlue }}>
        Revenue Breakdown by Service
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={PIE_DATA}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            labelLine={false}
            label={(props: any) => {
              if (props.name && props.percent !== undefined) {
                return `${(props.percent * 100).toFixed(0)}%`
              }
              return ""
            }}
          >
            {PIE_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
)

// --- MAIN DASHBOARD COMPONENT ---
const AdminDashboard: React.FC = () => {
  return (
    <div style={{ backgroundColor: THETA_COLORS.bgLight }} className="min-h-screen">
      <div className="w-full mx-auto p-6 md:p-10 max-w-7xl">
        <header className="mb-12 relative">
          <div
            className="absolute -inset-8 opacity-10 rounded-3xl pointer-events-none"
            style={{
              backgroundImage: `url(/placeholder.svg?height=200&width=800&query=floating therapy water meditation relaxation)`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          ></div>
          <div className="relative z-10">
            <div className="flex items-end gap-4 mb-3">
              <div className="p-3 rounded-full" style={{ backgroundColor: `${THETA_COLORS.lightBlue}25` }}>
                <Waves className="w-8 h-8" style={{ color: THETA_COLORS.darkBlue }} />
              </div>
              <h1 className="text-5xl font-serif font-bold leading-tight" style={{ color: THETA_COLORS.darkBlue }}>
                Admin Dashboard
              </h1>
            </div>
            <p
              className="text-base font-display font-bold uppercase tracking-wider ml-16"
              style={{ color: THETA_COLORS.lightBlue }}
            >
              Manage Your Theta Lounge Operations
            </p>
          </div>
        </header>

        {/* Management Tools Section */}
        <section className="mb-14">
          <div className="mb-8">
            <p
              className="text-xs font-display font-bold uppercase tracking-wider mb-2"
              style={{ color: THETA_COLORS.lightBlue }}
            >
              Quick Access
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold" style={{ color: THETA_COLORS.darkBlue }}>
              Management Tools
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardOptions.map((option, index) => (
              <AdminCard
                key={option.title}
                title={option.title}
                path={option.path}
                description={option.description}
                Icon={option.icon}
                animationDelay={index * 0.05}
                iconColor={option.iconColor}
              />
            ))}
          </div>
        </section>

        {/* KPI Cards */}
        <section className="mb-14">
          <div className="mb-8">
            <p
              className="text-xs font-display font-bold uppercase tracking-wider mb-2"
              style={{ color: THETA_COLORS.lightBlue }}
            >
              Performance Overview
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold" style={{ color: THETA_COLORS.darkBlue }}>
              Quick Stats
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </section>

        {/* Charts Grid */}
        <section>
          <div className="mb-8">
            <p
              className="text-xs font-display font-bold uppercase tracking-wider mb-2"
              style={{ color: THETA_COLORS.lightBlue }}
            >
              Analytics
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold" style={{ color: THETA_COLORS.darkBlue }}>
              Performance Insights
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BookingTrendLineChart />
            <TankUtilizationBarChart />
            <RevenuePieChart />
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center hover:shadow-lg transition-all duration-300 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                  backgroundImage: `url(/placeholder.svg?height=280&width=280&query=floating therapy wellness)`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }}
              ></div>
              <div className="relative z-10">
                <TrendingUp className="w-12 h-12 mb-4" style={{ color: THETA_COLORS.lightBlue }} />
                <p className="font-serif font-bold text-lg" style={{ color: THETA_COLORS.darkBlue }}>
                  More analytics coming soon
                </p>
                <p className="text-sm mt-2" style={{ color: THETA_COLORS.mediumBlue }}>
                  Enhanced reporting features in development
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AdminDashboard
