"use client"

import type React from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { Bath, PlusCircle, ArrowLeft, Info, Trash2, Edit, Clock } from "lucide-react"

// --- MOCK DATA ---
const MOCK_TANKS = [
  {
    id: 1,
    name: "Neptune Chamber",
    status: "Ready",
    capacity: 1,
    lastCleaned: "2 hours ago",
    imageUrl: "/float-tank-water.jpg",
  },
  {
    id: 2,
    name: "Orion Pod",
    status: "Occupied",
    capacity: 1,
    lastCleaned: "Yesterday",
    imageUrl: "/float-tank-water.jpg",
  },
  {
    id: 3,
    name: "Zen Floater XL",
    status: "Maintenance",
    capacity: 2,
    lastCleaned: "4 days ago",
    imageUrl: "/float-tank-water.jpg",
  },
  {
    id: 4,
    name: "Aqua Retreat",
    status: "Ready",
    capacity: 1,
    lastCleaned: "1 hour ago",
    imageUrl: "/float-tank-water.jpg",
  },
]

const TankManagementPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen p-6 md:p-8 lg:p-10"
      style={{
        background: "linear-gradient(135deg, #6BA3C5 0%, #475D73 50%, #0F3A52 100%)",
      }}
    >
      <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-10">
        <NavLink
          to="/admin/dashboard"
          className="inline-flex items-center mb-8 text-base font-semibold transition-colors hover:opacity-80"
          style={{ color: "#233547" }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </NavLink>

        <header className="mb-10 pb-6 border-b-2" style={{ borderColor: "#92B8D9" }}>
          <div className="flex items-center gap-3 mb-2">
            <Bath className="w-8 h-8" style={{ color: "#0F3A52" }} />
            <h1 className="text-4xl font-bold" style={{ color: "#233547" }}>
              Tank Management Hub
            </h1>
          </div>
          <p className="text-lg" style={{ color: "#5A7A95" }}>
            View current tank status and manage configurations.
          </p>
        </header>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-8" style={{ color: "#0F3A52" }}>
            Tank Inventory
          </h2>

          {/* Tank Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              onClick={() => navigate("/admin/add-tank")}
              className="p-8 rounded-xl shadow-md transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center h-full min-h-[280px] border-2 border-dashed hover:shadow-lg hover:scale-105"
              style={{
                backgroundColor: "#E8F0F5",
                borderColor: "#5A7A95",
              }}
            >
              <div className="mb-4 p-3 rounded-full" style={{ backgroundColor: "#92B8D9" }}>
                <PlusCircle className="w-8 h-8" style={{ color: "#0F3A52" }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: "#0F3A52" }}>
                Add New Tank
              </h3>
              <p style={{ color: "#5A7A95" }}>Configure a new floating pod</p>
            </div>

            {MOCK_TANKS.map((tank) => {
            const statusColors: { [key: string]: { bg: string; text: string; border: string } } = {
                Ready: { bg: "#E3F2FD", text: "#92B8D9", border: "#92B8D9" },
                Occupied: { bg: "#EEF4F9", text: "#5A7A95", border: "#5A7A95" },
                Maintenance: { bg: "#F5EBE6", text: "#C4956D", border: "#C4956D" },
            }


              const colors = statusColors[tank.status] || statusColors.Ready

              return (
                <div
                  key={tank.id}
                  className="rounded-xl shadow-md transition-all duration-300 overflow-hidden hover:shadow-lg hover:scale-105 flex flex-col bg-white"
                  style={{
                    borderLeft: `4px solid ${colors.border}`,
                  }}
                >
                  {/* Tank Image */}
                  <div className="relative w-full h-32 overflow-hidden">
                    <img
                      src={tank.imageUrl || "/placeholder.svg"}
                      alt={tank.name}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className="absolute bottom-2 left-2 px-3 py-1 text-xs font-bold text-white rounded-full"
                      style={{ backgroundColor: colors.text }}
                    >
                      {tank.status}
                    </span>
                  </div>

                  {/* Tank Details */}
                  <div className="flex-grow p-4">
                    <h3 className="text-lg font-bold mb-2" style={{ color: "#0F3A52" }}>
                      {tank.name}
                    </h3>
                    <p className="text-sm font-semibold mb-3" style={{ color: colors.text }}>
                      {tank.status === "Ready"
                        ? "Available for booking"
                        : tank.status === "Occupied"
                          ? "Currently in use"
                          : "Under maintenance"}
                    </p>
                    <div className="text-sm space-y-1 border-t pt-3" style={{ borderColor: "#E0E0E0", color: "#666" }}>
                      <p className="flex items-center">
                        <Info className="w-4 h-4 mr-2" style={{ color: "#5A7A95" }} />
                        Capacity: {tank.capacity} person
                      </p>
                      <p className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" style={{ color: "#5A7A95" }} />
                        Last Cleaned: {tank.lastCleaned}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 border-t flex justify-end gap-2" style={{ borderColor: "#E0E0E0" }}>
                    <button
                      title="Edit Tank"
                      className="p-2 rounded-full transition-all duration-200 hover:bg-opacity-100"
                      style={{
                        color: "#5A7A95",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#E8F0F5")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      title="Delete Tank"
                      className="p-2 rounded-full transition-all duration-200"
                      style={{
                        color: "#FF8042",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FFE8E0")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TankManagementPage
