"use client"

import type React from "react"
import { useEffect, useState } from "react" 
import { useNavigate } from "react-router-dom"
import { Bath, PlusCircle, ArrowLeft, Edit, Ruler, Droplets, Calendar, Star } from "lucide-react" 
import apiRequest from "../../core/axios" 
import Swal from 'sweetalert2';

// --- INTERFACE DEFINITION ---

interface Tank {
  _id: string
  name: string
  capacity: number
  length: number
  width: number
  benefits: string 
  createdAt: string
  updatedAt: string 
  status?: "Ready" | "Occupied" | "Maintenance"
}

// --- MAIN COMPONENT ---

const TankManagementPage: React.FC = () => {
  const navigate = useNavigate()
  const [tanks, setTanks] = useState<Tank[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  
  const handleEdit = (id: string) => {
    navigate(`/admin/add-tank/edit/${id}`); 
  };
  
  useEffect(() => {
    const fetchTanks = async () => {
      try {
        setLoading(true)
        const response = await apiRequest.get<Tank[]>("/tanks")

        const mappedTanks: Tank[] = response.map((tank) => ({
          ...tank,
          status: (tank.status || "Ready") as "Ready" | "Occupied" | "Maintenance", 
        }))

        setTanks(mappedTanks)
      } catch (error) {
        console.error("Failed to fetch tanks:", error)
        Swal.fire({
          icon: 'error',
          title: 'Load Error',
          text: 'Failed to fetch tanks data.',
          confirmButtonText: 'OK'
        });
      } finally {
        setLoading(false)
      }
    }

    fetchTanks()
  }, [])

  const handleAddTank = () => {
    navigate("/admin/add-tank");
  };

  const formatDate = (dateString: string | undefined) => 
    dateString ? new Date(dateString).toLocaleDateString() : 'N/A';

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-10 bg-gradient-to-br from-[#F0F8FB] via-[#E8F4F9] to-[#F5FAFC]">
      <div className="w-full max-w-7xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-lg p-5 sm:p-8 md:p-10 border border-cyan-100/50">
        
        {/* Navigation Section */}
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="inline-flex items-center mb-6 md:mb-8 text-sm md:text-base font-semibold transition-all duration-300 hover:text-cyan-600 hover:translate-x-1 text-slate-700"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2" />
          Back to Dashboard
        </button>

        {/* Header Section */}
        <header className="mb-8 md:mb-10 pb-6 border-b-2 border-cyan-200/60">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 mb-3">
            <div className="p-2 w-fit rounded-lg bg-cyan-100/40 border border-cyan-300/50">
              <Bath className="w-6 h-6 md:w-8 md:h-8 text-cyan-700" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-800 to-blue-900 bg-clip-text text-transparent">
              Tank Management
            </h1>
          </div>
          <p className="text-sm md:text-lg text-slate-600 sm:ml-14">View status and manage configurations.</p>
        </header>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-cyan-200/60 pb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-cyan-900">Inventory</h2>
          <button
            onClick={handleAddTank}
            className="w-full sm:w-auto px-5 py-3 md:py-2 text-white font-semibold rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-cyan-300/40 flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            Add New Tank
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-700 mb-4"></div>
            <p className="text-slate-600 font-medium">Loading tanks...</p>
          </div>
        ) : tanks.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500 mb-4">No tanks found in the inventory.</p>
            <button onClick={handleAddTank} className="text-cyan-600 font-bold hover:underline">Add your first tank</button>
          </div>
        ) : (
          <>
            {/* Desktop Table View (Hidden on Mobile) */}
            <div className="hidden md:block overflow-hidden rounded-xl shadow-md border border-cyan-200/50">
              <table className="min-w-full divide-y divide-cyan-200/60">
                <thead className="bg-cyan-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-cyan-800">Tank Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-cyan-800">Capacity</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-cyan-800">Dimensions</th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-cyan-800">Created</th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-cyan-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-100 bg-white">
                  {tanks.map((tank) => (
                    <tr key={tank._id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{tank.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{tank.capacity}L</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{tank.length}m x {tank.width}m</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{formatDate(tank.createdAt)}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleEdit(tank._id)}
                          className="p-2 rounded-lg hover:bg-cyan-100 text-cyan-700"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (Hidden on Desktop) */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {tanks.map((tank) => (
                <div key={tank._id} className="bg-white border border-cyan-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-slate-900">{tank.name}</h3>
                    <button
                      onClick={() => handleEdit(tank._id)}
                      className="p-2 rounded-lg bg-cyan-50 text-cyan-700 active:bg-cyan-100"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-slate-600">
                      <Droplets className="w-4 h-4 mr-3 text-cyan-500" />
                      <span className="font-medium mr-2">Capacity:</span> {tank.capacity}L
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Ruler className="w-4 h-4 mr-3 text-cyan-500" />
                      <span className="font-medium mr-2">Size:</span> {tank.length}m x {tank.width}m
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Calendar className="w-4 h-4 mr-3 text-cyan-500" />
                      <span className="font-medium mr-2">Added:</span> {formatDate(tank.createdAt)}
                    </div>
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-start text-sm text-slate-700">
                        <Star className="w-4 h-4 mr-3 mt-0.5 text-cyan-500 shrink-0" />
                        <p className="leading-relaxed line-clamp-3">{tank.benefits}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default TankManagementPage