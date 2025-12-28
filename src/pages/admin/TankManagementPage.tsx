"use client"

import type React from "react"
// REMOVED: useCallback (unused since handleStatusUpdate is essentially disconnected or uses stale logic)
import { useEffect, useState } from "react" 
import { useNavigate } from "react-router-dom"
import { Bath, PlusCircle, ArrowLeft, Edit } from "lucide-react" 
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
  
  // REMOVED: updating and setUpdating state as they were only used in handleStatusUpdate 
  // which is currently not being called by the rendered UI.

  // --- API & State Handlers ---

  // 3. Handle Edit (Navigation)
  const handleEdit = (id: string) => {
    navigate(`/admin/add-tank/edit/${id}`); 
  };
  
  // 4. Fetch Tanks (Initial Data Load)
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
          text: 'Failed to fetch tanks data. Check console for details.',
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
          <div className="flex justify-between items-center mb-8 border-b border-cyan-200/60 pb-4">
            <h2 className="text-3xl font-bold text-cyan-900">Tank Inventory</h2>
            <button
              onClick={handleAddTank}
              className="px-5 py-2 text-white font-semibold rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-cyan-300/40 flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 active:scale-95"
            >
              <PlusCircle className="w-5 h-5" />
              Add New Tank
            </button>
          </div>

          {loading ? (
            <p className="text-slate-600 col-span-full text-center py-8">Loading tanks...</p>
          ) : tanks.length === 0 ? (
            <p className="text-slate-600 col-span-full text-center py-8">No tanks found. Click "Add New Tank" to get started.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl shadow-lg border border-cyan-200/50">
              <table className="min-w-full divide-y divide-cyan-200/60">
                <thead className="bg-cyan-50/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-800 w-[10rem]">
                      Tank Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-800 hidden sm:table-cell w-[8rem]">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-800 hidden lg:table-cell w-[8rem]">
                      Dimensions (m)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-800 hidden md:table-cell w-[8rem]">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-800 hidden lg:table-cell w-full">
                      Benefits
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-cyan-800 w-[6rem]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-100 bg-white">
                  {tanks.map((tank) => {
                    const formatDate = (dateString: string | undefined) => 
                      dateString ? new Date(dateString).toLocaleDateString() : 'N/A';

                    return (
                      <tr key={tank._id} className="hover:bg-blue-50/30 transition-colors duration-150">
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900 align-top">
                          {tank.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 hidden sm:table-cell align-top">
                          {tank.capacity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 hidden lg:table-cell align-top">
                          {tank.length} x {tank.width}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 hidden md:table-cell align-top">
                          {formatDate(tank.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 hidden lg:table-cell whitespace-normal max-w-lg align-top">
                          {tank.benefits}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium align-top">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(tank._id)}
                              title="Edit Tank"
                              className="p-2 rounded-lg transition-all duration-200 hover:bg-cyan-200/40 text-cyan-700 hover:text-cyan-900"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TankManagementPage