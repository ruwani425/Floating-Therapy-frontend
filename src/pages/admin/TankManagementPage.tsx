"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Bath, PlusCircle, ArrowLeft, Info, Trash2, Edit, Clock } from "lucide-react"
import apiRequest from "../../core/axios" // Assuming this path is correct

// --- INTERFACE DEFINITION ---

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
  updatedAt: string // Added updatedAt based on your data example
  status?: "Ready" | "Occupied" | "Maintenance"
  lastCleaned?: string // Front-end generated field
}

// --- STATUS COLORS (Kept for the status tag styling) ---

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  Ready: { bg: "rgba(106, 180, 220, 0.1)", text: "#1a5f7a", border: "#6AB4DC" },
  Occupied: { bg: "rgba(70, 150, 180, 0.1)", text: "#154a5f", border: "#4696B4" },
  Maintenance: { bg: "rgba(40, 100, 140, 0.1)", text: "#0d2e3d", border: "#28648C" },
}

// --- MAIN COMPONENT ---

const TankManagementPage: React.FC = () => {
  const navigate = useNavigate()
  const [tanks, setTanks] = useState<Tank[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchTanks = async () => {
      try {
        setLoading(true)
        // Assuming apiRequest.get<Tank[]>("/tanks") returns the raw database data
        const response = await apiRequest.get<Tank[]>("/tanks")

        const mappedTanks: Tank[] = response.map((tank) => ({
          ...tank,
          // Default status to "Ready" if not provided by API
          status: "Ready", 
          
          // FIX: Using a placeholder since the database lacks a dedicated 'lastCleaned' field.
          lastCleaned: "N/A (Log Missing)", 
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

  return (
    <div className="min-h-screen p-6 md:p-8 lg:p-10 bg-gradient-to-br from-[#F0F8FB] via-[#E8F4F9] to-[#F5FAFC]">
      <div className="w-full max-w-7xl mx-auto bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg p-8 md:p-10 border border-cyan-100/50 hover:border-cyan-200/70 transition-colors duration-300">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="inline-flex items-center mb-8 text-base font-semibold transition-all duration-300 hover:text-cyan-600 hover:translate-x-1 text-slate-700"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Dashboard
        </button>

        <header className="mb-10 pb-8 border-b-2 border-cyan-200/60 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-cyan-100/40 border border-cyan-300/50">
              <Bath className="w-8 h-8 text-cyan-700" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-800 to-blue-900 bg-clip-text text-transparent">
              Tank Management Hub
            </h1>
            </div>
          <p className="text-lg text-slate-600 ml-11">View current tank status and manage configurations.</p>
        </header>

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-8 text-cyan-900 border-b border-cyan-200/60 pb-3">Tank Inventory</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              onClick={() => navigate("/admin/add-tank")}
              className="p-8 rounded-2xl shadow-md transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center h-full min-h-[280px] border-2 border-dashed bg-gradient-to-br from-cyan-50/60 to-blue-50/40 border-cyan-300/50 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-200/30 hover:scale-105 hover:bg-gradient-to-br hover:from-cyan-100/60 hover:to-blue-100/40"
            >
              <div className="mb-4 p-4 rounded-full bg-gradient-to-br from-cyan-200/40 to-blue-200/20 border border-cyan-300/60">
                <PlusCircle className="w-8 h-8 text-cyan-700" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-800">Add New Tank</h3>
              <p className="text-slate-600">Configure a new floating pod</p>
            </div>

            {loading ? (
              <p className="text-slate-600 col-span-full text-center py-8">Loading tanks...</p>
            ) : tanks.length === 0 ? (
              <p className="text-slate-600 col-span-full text-center py-8">No tanks found.</p>
            ) : (
              tanks.map((tank) => {
                // Get colors for the status tag
                const colors = statusColors[tank.status || "Ready"] 

                return (
                  <div
                    key={tank._id}
                    className="rounded-2xl shadow-md transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-cyan-200/40 hover:scale-105 flex flex-col bg-gradient-to-br from-white to-blue-50/30 border border-cyan-200/50 hover:border-cyan-300/70"
                  >
                    <div className="flex-grow p-6">
                      <h3 className="text-xl font-bold mb-3 text-slate-800">{tank.name}</h3>
                      <p 
                        className="text-sm font-semibold mb-4 px-3 py-1 rounded-full w-fit border"
                        style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }} // Uses statusColors for tag styling
                      >
                        {tank.status === "Ready"
                          ? "Available for booking"
                          : tank.status === "Occupied"
                            ? "Currently in use"
                            : "Under maintenance"}
                      </p>
                      <div className="text-sm space-y-2 border-t border-cyan-200/40 pt-4 text-slate-600">
                        <p className="flex items-center gap-2">
                          <Info className="w-4 h-4 text-cyan-600" />
                          Capacity: {tank.capacity} person
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-cyan-600" />
                          Last Cleaned: {tank.lastCleaned}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 border-t border-cyan-200/40 flex justify-end gap-2 bg-slate-50/60">
                      <button
                        title="Edit Tank"
                        className="p-2 rounded-lg transition-all duration-200 hover:bg-cyan-200/40 text-cyan-700 hover:text-cyan-900"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        title="Delete Tank"
                        className="p-2 rounded-lg transition-all duration-200 hover:bg-red-200/40 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
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