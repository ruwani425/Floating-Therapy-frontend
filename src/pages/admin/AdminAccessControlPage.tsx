"use client"

// src/pages/admin/AdminAccessControlPage.tsx

import type React from "react"
import { useState, useEffect } from "react"
import {
  Shield,
  Mail,
  CheckSquare,
  Square,
  UserPlus,
  Trash2,
  AlertTriangle,
  UserIcon,
  CalendarCheck,
  Bath,
  DollarSign,
  Settings,
  BookOpen,
  TrendingUp,
  Package,
  Users,
} from "lucide-react"
import Swal from "sweetalert2"
import apiRequest from "../../core/axios"


const THETA_COLORS = {
  darkestBlue: "#035C84",  
  darkBlue: "#0873A1",     
  mediumBlue: "#2DA0CC",   
  lightBlue: "#94CCE7",    
  white: "#FFFFFF",
  bgLight: "#F8FAFC",      
  bgLighter: "#FAFBFC",
}

const PERMISSION_OPTIONS = [
  {
    key: "reservations",
    title: "Appointment Bookings",
    description: "Manage all appointments and schedules.",
    icon: CalendarCheck,
    path: "/admin/reservations",
  },
  {
    key: "tanks",
    title: "Tank Management",
    description: "Monitor floating tank capacity and status.",
    icon: Bath,
    path: "/admin/tank-management",
  },
  {
    key: "users",
    title: "User Accounts",
    description: "Manage all system users and members.",
    icon: Users,
    path: "/admin/users",
  },
  {
    key: "packages",
    title: "Services & Pricing",
    description: "Update therapy services and package rates.",
    icon: DollarSign,
    path: "/admin/package-management",
  },
  {
    key: "activations",
    title: "Package Activations",
    description: "Manage customer package activation requests.",
    icon: Package,
    path: "/admin/package-activations",
  },
  {
    key: "reports",
    title: "Reports & Analytics",
    description: "View performance metrics and insights.",
    icon: TrendingUp,
    path: "/admin/reports",
  },
  {
    key: "content",
    title: "Content Management",
    description: "Edit website pages and blog posts.",
    icon: BookOpen,
    path: "/admin/content",
  },
  {
    key: "access_control",
    title: "Access Control (Self)",
    description: "Manage admin permissions and roles.",
    icon: Shield,
    path: "/admin/roles",
  },
  {
    key: "settings",
    title: "Global Settings",
    description: "Configure application settings.",
    icon: Settings,
    path: "/admin/system-settings",
  },
]

interface AdminUser {
  _id: string
  name: string
  email: string
  permissions: string[]
  createdAt: string
}

interface AdminListResponse {
  success: boolean
  data: AdminUser[]
  count: number
}

interface AdminOperationResponse {
  success: boolean
  data: AdminUser
}


const AdminAccessControlPage: React.FC = () => {
  const [newAdminEmail, setNewAdminEmail] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [existingAdmins, setExistingAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(false)

  const fetchExistingAdmins = async () => {
    try {
      const response = await apiRequest.get<AdminListResponse>("/users/admin/list")
      if (response.success) {
        setExistingAdmins(response.data)
      }
    } catch (error) {
      const axiosError = error as any
      Swal.fire({
        icon: "error",
        title: "Error",
        text: axiosError.response?.data?.message || "Failed to fetch existing admins.",
      })
    }
  }

  useEffect(() => {
    fetchExistingAdmins()
  }, [])

  const handleTogglePermission = (key: string) => {
    setSelectedPermissions((prev) => (prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]))
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAdminEmail || selectedPermissions.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Missing Data",
        text: "Please enter an email and select at least one permission.",
      })
      return
    }
    setLoading(true)
    try {
      const response = await apiRequest.post<AdminOperationResponse>("/users/admin/add", {
        email: newAdminEmail,
        permissions: selectedPermissions,
      })
      if (response.success) {
        await fetchExistingAdmins()
        Swal.fire({
          icon: "success",
          title: "Admin User Added",
          text: `${newAdminEmail} has been added.`,
          toast: true,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false,
        })
        setNewAdminEmail("")
        setSelectedPermissions([])
      }
    } catch (error) {
      const axiosError = error as any
      Swal.fire({
        icon: "error",
        title: "Error",
        text: axiosError.response?.data?.message || "Failed to add admin user.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveAdmin = (adminId: string, adminEmail: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to remove admin access for ${adminEmail}. This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: THETA_COLORS.darkestBlue,
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, remove access",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiRequest.delete<AdminOperationResponse>(`/users/admin/${adminId}`)
          await fetchExistingAdmins()
          Swal.fire({
            icon: "success",
            title: "Access Revoked!",
            text: `${adminEmail} is no longer an admin.`,
            toast: true,
            position: "top-end",
            timer: 3000,
            showConfirmButton: false,
          })
        } catch (error) {
          const axiosError = error as any
          Swal.fire("Failed!", axiosError.response?.data?.message || "Failed to remove admin access.", "error")
        }
      }
    })
  }

  return (
    <div style={{ backgroundColor: THETA_COLORS.bgLight }} className="min-h-screen">
      <div className="w-full mx-auto px-4 py-8 sm:p-10 md:p-12 max-w-7xl">
        
        <div
          className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 border-b-2 pb-8"
          style={{ borderColor: `${THETA_COLORS.lightBlue}40` }}
        >
          <div className="p-4 rounded-2xl shadow-sm bg-white border border-slate-100">
            <Shield className="w-10 h-10" style={{ color: THETA_COLORS.darkestBlue }} />
          </div>
          <div>
            <h1
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ color: THETA_COLORS.darkestBlue }}
            >
              Access Control
            </h1>
            <p
              className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mt-1 opacity-80"
              style={{ color: THETA_COLORS.mediumBlue }}
            >
              Assign Administrator Roles & Permissions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          <div className="xl:col-span-4">
            <div
              className="p-8 rounded-3xl shadow-sm border border-slate-200 sticky top-8"
              style={{ backgroundColor: THETA_COLORS.white }}
            >
              <h2
                className="text-xl font-bold mb-6 flex items-center gap-2"
                style={{ color: THETA_COLORS.darkestBlue }}
              >
                <UserPlus className="w-5 h-5" /> Add New Admin
              </h2>
              
              <form onSubmit={handleAddAdmin} className="space-y-5">
                <div>
                  <label
                    className="block text-[10px] font-black uppercase tracking-widest mb-2"
                    style={{ color: THETA_COLORS.darkBlue }}
                  >
                    Google Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: THETA_COLORS.mediumBlue }}
                    />
                    <input
                      type="email"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="admin@thetalounge.com"
                      required
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-sky-100 transition-all text-sm outline-none font-medium"
                      style={{ borderColor: `${THETA_COLORS.lightBlue}60` }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
                  style={{ backgroundColor: THETA_COLORS.darkestBlue, color: THETA_COLORS.white }}
                >
                  {loading ? "Processing..." : "Grant Admin Access"}
                </button>

                <div
                  className="p-4 rounded-xl flex items-start gap-3 border"
                  style={{ 
                    backgroundColor: `${THETA_COLORS.lightBlue}10`, 
                    borderColor: `${THETA_COLORS.lightBlue}30` 
                  }}
                >
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: THETA_COLORS.darkBlue }} />
                  <p className="text-[11px] leading-relaxed font-medium" style={{ color: THETA_COLORS.darkBlue }}>
                    New admins must log in via Google to activate these permissions.
                  </p>
                </div>
              </form>
            </div>
          </div>

          <div className="xl:col-span-8">
            <div
              className="p-8 rounded-3xl shadow-sm border border-slate-200"
              style={{ backgroundColor: THETA_COLORS.white }}
            >
              <h2
                className="text-xl font-bold mb-6 flex items-center gap-2"
                style={{ color: THETA_COLORS.darkestBlue }}
              >
                <CheckSquare className="w-5 h-5" /> Select Permissions
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {PERMISSION_OPTIONS.map((option) => {
                  const isSelected = selectedPermissions.includes(option.key)
                  const Icon = option.icon
                  return (
                    <div
                      key={option.key}
                      onClick={() => handleTogglePermission(option.key)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all border-2 flex flex-col h-full group ${
                        isSelected ? "shadow-sm" : "hover:bg-slate-50"
                      }`}
                      style={{
                        borderColor: isSelected ? THETA_COLORS.mediumBlue : `${THETA_COLORS.lightBlue}30`,
                        backgroundColor: isSelected ? `${THETA_COLORS.lightBlue}15` : THETA_COLORS.white,
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className={`p-2 rounded-lg ${isSelected ? "bg-white" : "bg-slate-50"}`}>
                          <Icon className="w-4 h-4" style={{ color: THETA_COLORS.darkestBlue }} />
                        </div>
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4" style={{ color: THETA_COLORS.darkestBlue }} />
                        ) : (
                          <Square className="w-4 h-4 opacity-20" style={{ color: THETA_COLORS.mediumBlue }} />
                        )}
                      </div>
                      <p className="font-bold text-sm mb-1" style={{ color: THETA_COLORS.darkestBlue }}>
                        {option.title}
                      </p>
                      <p className="text-[10px] leading-relaxed font-medium opacity-70" style={{ color: THETA_COLORS.darkBlue }}>
                        {option.description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="xl:col-span-12 mt-4">
            <div className="mb-6">
              <h2 className="text-xl font-bold" style={{ color: THETA_COLORS.darkestBlue }}>
                Current Team <span className="text-sm font-medium opacity-50 ml-2">({existingAdmins.length} Members)</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {existingAdmins.map((admin) => (
                <div
                  key={admin._id}
                  className="p-5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between gap-4 transition-hover hover:border-sky-200 hover:shadow-md"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${THETA_COLORS.lightBlue}20` }}>
                      <UserIcon className="w-5 h-5" style={{ color: THETA_COLORS.darkBlue }} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate" style={{ color: THETA_COLORS.darkestBlue }}>
                        {admin.name || "Pending User"}
                      </p>
                      <p className="text-[11px] font-medium truncate opacity-60 mb-1.5" style={{ color: THETA_COLORS.darkBlue }}>
                        {admin.email}
                      </p>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[9px] font-black uppercase tracking-wider text-slate-500 border border-slate-200">
                        {admin.permissions.length} Roles
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveAdmin(admin._id, admin.email)}
                    className="p-2.5 rounded-lg text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminAccessControlPage
