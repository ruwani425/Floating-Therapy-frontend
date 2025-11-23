"use client"

import type React from "react"

import { useState } from "react"
import { Search, Check, Clock, X, CheckCircle, Calendar } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface Booking {
  id: number
  clientName: string
  email: string
  phone: string
  sessionDate: string
  sessionTime: string
  duration: string
  sessionType: string
  status: "confirmed" | "pending" | "completed" | "cancelled"
  amount: string
}

export default function ReservationsPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const bookings: Booking[] = [
    {
      id: 1,
      clientName: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+1 (555) 123-4567",
      sessionDate: "2025-12-15",
      sessionTime: "10:00 AM",
      duration: "60 min",
      sessionType: "Single Float",
      status: "confirmed",
      amount: "$70.00",
    },
    {
      id: 2,
      clientName: "Michael Chen",
      email: "michael@example.com",
      phone: "+1 (555) 234-5678",
      sessionDate: "2025-12-16",
      sessionTime: "2:00 PM",
      duration: "60 min",
      sessionType: "Couples Float",
      status: "confirmed",
      amount: "$140.00",
    },
    {
      id: 3,
      clientName: "Emma Davis",
      email: "emma@example.com",
      phone: "+1 (555) 345-6789",
      sessionDate: "2025-12-17",
      sessionTime: "11:00 AM",
      duration: "90 min",
      sessionType: "Extended Float",
      status: "pending",
      amount: "$105.00",
    },
    {
      id: 4,
      clientName: "James Wilson",
      email: "james@example.com",
      phone: "+1 (555) 456-7890",
      sessionDate: "2025-12-18",
      sessionTime: "3:30 PM",
      duration: "60 min",
      sessionType: "Single Float",
      status: "cancelled",
      amount: "$70.00",
    },
    {
      id: 5,
      clientName: "Lisa Anderson",
      email: "lisa@example.com",
      phone: "+1 (555) 567-8901",
      sessionDate: "2025-12-19",
      sessionTime: "9:00 AM",
      duration: "60 min",
      sessionType: "Single Float",
      status: "completed",
      amount: "$70.00",
    },
  ]

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      confirmed: "bg-green-50 text-green-700 border-green-200",
      pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
      completed: "bg-blue-50 text-blue-700 border-blue-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
    }
    const statusIcons: Record<string, React.ReactNode> = {
      confirmed: <Check className="h-4 w-4" />,
      pending: <Clock className="h-4 w-4" />,
      completed: <CheckCircle className="h-4 w-4" />,
      cancelled: <X className="h-4 w-4" />,
    }
    return {
      styles: statusStyles[status] || statusStyles.pending,
      icon: statusIcons[status],
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Reservations</h1>
          <p className="mt-2 text-muted-foreground">Manage and view all client booking sessions</p>
        </div>

        {/* Top Controls */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by client name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filter & Calendar Buttons */}
          <div className="flex gap-3">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-input bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Calendar Toggle Button */}
            <button
              onClick={() => navigate("/admin/calendar-management")}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-opacity-90 transition-all"
            >
              <Calendar className="h-5 w-5" />
              <span className="hidden sm:inline">View Calendar</span>
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="rounded-lg border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="px-6 py-4 text-left font-semibold text-foreground">Client Name</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Email</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Session Date</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Time</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Session Type</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const { styles, icon } = getStatusBadge(booking.status)
                return (
                  <tr key={booking.id} className="border-b border-border hover:bg-muted transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{booking.clientName}</td>
                    <td className="px-6 py-4 text-muted-foreground">{booking.email}</td>
                    <td className="px-6 py-4 text-foreground">
                      {new Date(booking.sessionDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-foreground">{booking.sessionTime}</td>
                    <td className="px-6 py-4 text-foreground">{booking.sessionType}</td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${styles}`}
                      >
                        {icon}
                        <span className="capitalize">{booking.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">{booking.amount}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="mt-8 rounded-lg border border-border bg-card p-12 text-center">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">No bookings found</h3>
            <p className="mt-2 text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
