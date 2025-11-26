"use client"

import React, { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { Bath, PlusCircle, ArrowLeft, Info, Trash2, Edit, Clock } from "lucide-react"
import apiRequest from "../../core/axios"

// Frontend Tank type
interface Tank {
  _id: string
  name: string
  capacity: number
  length: number
  width: number
  sessionDuration: number
  basePrice: number
  benefits: string
  createdAt: string

  // Optional frontend-only fields
  status?: "Ready" | "Occupied" | "Maintenance"
  lastCleaned?: string
}

const TankManagementPage: React.FC = () => {
  const navigate = useNavigate()
  const [tanks, setTanks] = useState<Tank[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchTanks = async () => {
      try {
        setLoading(true)
        const response = await apiRequest.get<Tank[]>("/tanks")

        const mappedTanks: Tank[] = response.map((tank) => ({
          ...tank,
          status: "Ready",
          lastCleaned: new Date(tank.createdAt).toLocaleDateString(),
        }))

        setTanks(mappedTanks)
      } catch (error) {
        console.error("Failed to fetch tanks:", error)
        alert("Failed to fetch tanks. Check console for details.")
      } finally {
        setLoading(false)
      }
    }

    fetchTanks()
  }, [])

  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    Ready: { bg: "#F0F0F0", text: "#333", border: "#333" },
    Occupied: { bg: "#F5F5F5", text: "#555", border: "#555" },
    Maintenance: { bg: "#FAFAFA", text: "#777", border: "#777" },
  }

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-10 bg-gray-100">
      <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-10">
        <NavLink
          to="/admin/dashboard"
          className="inline-flex items-center mb-8 text-base font-semibold transition-colors hover:opacity-80"
          style={{ color: "#233547" }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </NavLink>

        <header className="mb-10 pb-6 border-b-2" style={{ borderColor: "#ccc" }}>
          <div className="flex items-center gap-3 mb-2">
            <Bath className="w-8 h-8" style={{ color: "#333" }} />
            <h1 className="text-4xl font-bold" style={{ color: "#233547" }}>
              Tank Management Hub
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            View current tank status and manage configurations.
          </p>
        </header>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-8" style={{ color: "#333" }}>
            Tank Inventory
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Add New Tank Card */}
            <div
              onClick={() => navigate("/admin/add-tank")}
              className="p-8 rounded-xl shadow-md transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center h-full min-h-[280px] border-2 border-dashed hover:shadow-lg hover:scale-105"
              style={{ borderColor: "#888", backgroundColor: "#f9f9f9" }}
            >
              <div className="mb-4 p-3 rounded-full bg-gray-300">
                <PlusCircle className="w-8 h-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                Add New Tank
              </h3>
              <p className="text-gray-600">Configure a new floating pod</p>
            </div>

            {loading ? (
              <p className="text-gray-700 col-span-full">Loading tanks...</p>
            ) : tanks.length === 0 ? (
              <p className="text-gray-700 col-span-full">No tanks found.</p>
            ) : (
              tanks.map((tank) => {
                const colors = statusColors[tank.status || "Ready"]
                return (
                  <div
                    key={tank._id}
                    className="rounded-xl shadow-md transition-all duration-300 overflow-hidden hover:shadow-lg hover:scale-105 flex flex-col bg-white"
                    style={{ borderLeft: `4px solid ${colors.border}` }}
                  >
                    {/* Tank Details */}
                    <div className="flex-grow p-4">
                      <h3 className="text-lg font-bold mb-2 text-gray-800">{tank.name}</h3>
                      <p className="text-sm font-semibold mb-3 text-gray-600">
                        {tank.status === "Ready"
                          ? "Available for booking"
                          : tank.status === "Occupied"
                          ? "Currently in use"
                          : "Under maintenance"}
                      </p>
                      <div className="text-sm space-y-1 border-t pt-3" style={{ borderColor: "#E0E0E0", color: "#666" }}>
                        <p className="flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          Capacity: {tank.capacity} person
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Last Cleaned: {tank.lastCleaned}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 border-t flex justify-end gap-2" style={{ borderColor: "#E0E0E0" }}>
                      <button
                        title="Edit Tank"
                        className="p-2 rounded-full transition-all duration-200 hover:bg-gray-200"
                      >
                        <Edit className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        title="Delete Tank"
                        className="p-2 rounded-full transition-all duration-200 hover:bg-red-100"
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TankManagementPage
