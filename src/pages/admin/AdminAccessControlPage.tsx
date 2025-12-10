// src/pages/admin/AdminAccessControlPage.tsx

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Mail, 
  CheckSquare, 
  Square, 
  UserPlus,
  Trash2,
  AlertTriangle,
  User as UserIcon,
  CalendarCheck,
  Bath,
  DollarSign,
  Settings,
  BookOpen,
  TrendingUp,
  Package,
  Users,
} from 'lucide-react';
import Swal from 'sweetalert2';
import apiRequest from '../../core/axios'; // Assuming this handles API calls

// --- THEME & DATA CONSTANTS (Copied from AdminDashboard.tsx) ---

const THETA_COLORS = {
  darkestBlue: "#0F1F2E",
  darkBlue: "#1a3a52",
  mediumBlue: "#3a7ca5",
  lightBlue: "#6ab4dc",
  cyan: "#A0E7E5",
  lightCyan: "#D4F1F9",
  white: "#FFFFFF",
  bgLight: "#F5F8FC",
  bgLighter: "#FAFBFC",
}

// Map the Admin Dashboard options to a structure suitable for permissions
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

// Assuming the Admin User structure for display
interface AdminUser {
  _id: string;
  name: string;
  email: string;
  // NOTE: In a real system, 'permissions' would be an array of keys (e.g., string[])
  // For simplicity here, we'll assume a dummy list for display purposes
  permissions: string[]; 
  createdAt: string;
}

const DUMMY_ADMIN_USERS: AdminUser[] = [
    { _id: '1', name: 'Master Admin', email: 'master.admin@lounge.com', permissions: PERMISSION_OPTIONS.map(p => p.key), createdAt: '2023-01-01T10:00:00Z' },
    { _id: '2', name: 'Bookings Manager', email: 'book.mgr@lounge.com', permissions: ['reservations', 'users', 'activations'], createdAt: '2023-05-15T10:00:00Z' },
    { _id: '3', name: 'Content Editor', email: 'content.edit@lounge.com', permissions: ['content', 'settings'], createdAt: '2024-02-20T10:00:00Z' },
]

// --- ACCESS CONTROL PAGE COMPONENT ---

const AdminAccessControlPage: React.FC = () => {
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [existingAdmins, setExistingAdmins] = useState<AdminUser[]>(DUMMY_ADMIN_USERS);
  const [loading, setLoading] = useState(false);

  // In a real application, you would fetch the list of existing admins here.
  // useEffect(() => {
  //   fetchExistingAdmins();
  // }, []);

  const handleTogglePermission = (key: string) => {
    setSelectedPermissions(prev => 
      prev.includes(key)
        ? prev.filter(p => p !== key)
        : [...prev, key]
    );
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newAdminEmail || selectedPermissions.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Data',
        text: 'Please enter an email and select at least one permission.',
      });
      return;
    }
    
    setLoading(true);

    try {
      // NOTE: This API endpoint must be created on the backend (e.g., POST /api/users/admin)
      // This endpoint would: 
      // 1. Create a user (if not exists) with role: 'admin'
      // 2. Save the granular permissions array to a new field on the User model
      // 3. The auth middleware/route guard will need to check this new 'permissions' field
      
      // Since we don't have the backend implementation for this, we'll simulate success.
      // const response = await apiRequest.post('/users/admin', { 
      //   email: newAdminEmail, 
      //   permissions: selectedPermissions 
      // });

      // Simulate successful API response
      await new Promise(resolve => setTimeout(resolve, 800)); 
      
      const newAdmin: AdminUser = {
        _id: Date.now().toString(),
        name: newAdminEmail.split('@')[0], // Simple name extraction
        email: newAdminEmail,
        permissions: selectedPermissions,
        createdAt: new Date().toISOString(),
      };
      
      setExistingAdmins(prev => [...prev, newAdmin]);
      
      Swal.fire({
        icon: 'success',
        title: 'Admin User Added',
        text: `${newAdminEmail} has been added with ${selectedPermissions.length} permissions.`,
        toast: true,
        position: 'top-end',
        timer: 3000,
        showConfirmButton: false,
      });

      // Reset form
      setNewAdminEmail('');
      setSelectedPermissions([]);

    } catch (error) {
      console.error('Error adding admin:', error);
      const axiosError = error as any;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: axiosError.response?.data?.message || 'Failed to add admin user.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = (adminId: string, adminEmail: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to remove admin access for ${adminEmail}. This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: THETA_COLORS.darkestBlue,
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'Yes, remove access',
    }).then(async (result) => {
      if (result.isConfirmed) {
        // NOTE: In a real system, you would call an API endpoint here (e.g., DELETE /api/users/admin/:id)
        // This endpoint would likely change the user's role back to 'client' and clear permissions.
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500)); 

            setExistingAdmins(prev => prev.filter(admin => admin._id !== adminId));

            Swal.fire({
                icon: 'success',
                title: 'Access Revoked!',
                text: `${adminEmail} is no longer an admin.`,
                toast: true,
                position: 'top-end',
                timer: 3000,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire('Failed!', 'Failed to remove admin access.', 'error');
        }
      }
    });
  };

  return (
    <div style={{ backgroundColor: THETA_COLORS.bgLight }} className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 border-b pb-4" style={{ borderColor: THETA_COLORS.lightCyan }}>
          <div className="p-3 rounded-xl" style={{ backgroundColor: THETA_COLORS.lightCyan }}>
            <Shield className="w-8 h-8" style={{ color: THETA_COLORS.darkestBlue }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: THETA_COLORS.darkestBlue }}>
              Admin Access Control
            </h1>
            <p className="text-sm font-medium" style={{ color: THETA_COLORS.mediumBlue }}>
              Assign new administrator roles and granular permissions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Add New Admin Form */}
          <div className="lg:col-span-1">
            <div className="p-6 rounded-xl shadow-md border" style={{ backgroundColor: THETA_COLORS.white, borderColor: THETA_COLORS.lightCyan }}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: THETA_COLORS.darkestBlue }}>
                <UserPlus className="w-5 h-5" />
                Add New Admin
              </h2>
              
              <form onSubmit={handleAddAdmin}>
                {/* Email Input */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-2" style={{ color: THETA_COLORS.darkBlue }}>
                    Admin Email (Must be Google-linked)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: THETA_COLORS.mediumBlue }} />
                    <input
                      type="email"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="e.g., john.doe@lounge.com"
                      required
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{ borderColor: THETA_COLORS.lightCyan }}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-3 mt-4 rounded-xl font-bold transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: THETA_COLORS.darkestBlue, color: THETA_COLORS.white }}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent" style={{ borderColor: THETA_COLORS.white }}></div>
                  ) : (
                    <UserPlus className="w-5 h-5" />
                  )}
                  {loading ? 'Adding Admin...' : 'Confirm & Add Admin'}
                </button>
                
                <div className="mt-4 p-3 rounded-lg flex items-start text-xs" style={{ backgroundColor: THETA_COLORS.lightCyan, color: THETA_COLORS.darkBlue }}>
                    <AlertTriangle className="w-4 h-4 mr-2 mt-0.5" />
                    Permissions only apply after the user logs in as an admin for the first time.
                </div>
              </form>
            </div>
          </div>

          {/* Column 2: Permission Selection */}
          <div className="lg:col-span-2">
            <div className="p-6 rounded-xl shadow-md border h-full" style={{ backgroundColor: THETA_COLORS.white, borderColor: THETA_COLORS.lightCyan }}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: THETA_COLORS.darkestBlue }}>
                <CheckSquare className="w-5 h-5" />
                Select Permissions
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                {PERMISSION_OPTIONS.map((option) => {
                  const isSelected = selectedPermissions.includes(option.key);
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.key}
                      onClick={() => handleTogglePermission(option.key)}
                      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border flex items-center gap-3 ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50 shadow-md' 
                          : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                      style={{ borderColor: isSelected ? THETA_COLORS.mediumBlue : THETA_COLORS.lightCyan, backgroundColor: isSelected ? THETA_COLORS.lightCyan : THETA_COLORS.white }}
                    >
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5" style={{ color: THETA_COLORS.darkestBlue }} />
                      ) : (
                        <Square className="w-5 h-5" style={{ color: THETA_COLORS.mediumBlue }} />
                      )}
                      
                      <div className="flex-1">
                          <p className="font-bold text-sm" style={{ color: THETA_COLORS.darkestBlue }}>{option.title}</p>
                          <p className="text-xs" style={{ color: THETA_COLORS.mediumBlue }}>{option.description}</p>
                      </div>
                      
                      <div className="p-2 rounded-full" style={{ backgroundColor: `${THETA_COLORS.darkestBlue}10` }}>
                          <Icon className="w-4 h-4" style={{ color: THETA_COLORS.darkestBlue }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Column 3: Existing Admins List (Full Width on its own line) */}
          <div className="lg:col-span-3">
             <div className="p-6 rounded-xl shadow-md border" style={{ backgroundColor: THETA_COLORS.white, borderColor: THETA_COLORS.lightCyan }}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: THETA_COLORS.darkestBlue }}>
                <Shield className="w-5 h-5" />
                Existing Admin Users ({existingAdmins.length})
              </h2>
              
              <div className="space-y-3">
                  {existingAdmins.map((admin) => (
                      <div 
                        key={admin._id} 
                        className="p-4 border rounded-lg flex items-center justify-between"
                        style={{ borderColor: THETA_COLORS.lightCyan }}
                      >
                          <div className="flex items-center gap-3">
                              <UserIcon className="w-5 h-5" style={{ color: THETA_COLORS.mediumBlue }} />
                              <div>
                                  <p className="font-bold" style={{ color: THETA_COLORS.darkestBlue }}>{admin.name}</p>
                                  <p className="text-sm" style={{ color: THETA_COLORS.mediumBlue }}>{admin.email}</p>
                                  <p className="text-xs mt-1" style={{ color: THETA_COLORS.mediumBlue }}>
                                      Permissions: {admin.permissions.length} options
                                  </p>
                              </div>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveAdmin(admin._id, admin.email)}
                            className="p-2 rounded-lg transition-all duration-200 hover:bg-red-100"
                            style={{ color: '#EF4444' }}
                            title="Revoke Admin Access"
                          >
                              <Trash2 className="w-5 h-5" />
                          </button>
                      </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccessControlPage;