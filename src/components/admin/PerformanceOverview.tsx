"use client"

import type React from "react"
import { motion, type Variants } from "framer-motion"
import { Wallet, CalendarCheck, Bath, Clock, ArrowUp, ArrowDown } from "lucide-react"

const THETA_COLORS = {
  darkestBlue: "#035C84",
  darkBlue: "#0873A1",
  mediumBlue: "#2DA0CC",
  lightBlue: "#94CCE7",
  white: "#FFFFFF",
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

interface KPIData {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ElementType
}

const StatCard: React.FC<KPIData> = ({ title, value, change, trend, icon: Icon }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow duration-300 flex flex-col"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: THETA_COLORS.mediumBlue }}>
          {title}
        </p>
        <h4 className="text-3xl font-bold mb-2" style={{ color: THETA_COLORS.darkestBlue }}>
          {value}
        </h4>
        <div
          className={`flex items-center text-xs font-semibold ${trend === "up" ? "text-emerald-600" : "text-red-600"}`}
        >
          {trend === "up" ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
          {change} vs last period
        </div>
      </div>
      <div className="p-3 rounded-xl shadow-inner" style={{ backgroundColor: `${THETA_COLORS.lightBlue}20` }}>
        <Icon className="w-6 h-6" style={{ color: THETA_COLORS.darkBlue }} />
      </div>
    </div>
  </motion.div>
)

interface PerformanceOverviewProps {
  stats: {
    totalRevenue: { value: string; change: string; trend: "up" | "down" }
    newBookings: { value: string; change: string; trend: "up" | "down" }
    tankAvailability: { value: string; change: string; trend: "up" | "down" }
    avgSession: { value: string; change: string; trend: "up" | "down" }
  }
}

export const PerformanceOverview: React.FC<PerformanceOverviewProps> = ({ stats }) => {
  const kpis = [
    { title: "Total Revenue", ...stats.totalRevenue, icon: Wallet },
    { title: "New Bookings", ...stats.newBookings, icon: CalendarCheck },
    { title: "Tank Availability", ...stats.tankAvailability, icon: Bath },
    { title: "Avg Session", ...stats.avgSession, icon: Clock },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {kpis.map((kpi) => (
        <StatCard key={kpi.title} {...kpi} />
      ))}
    </div>
  )
}
