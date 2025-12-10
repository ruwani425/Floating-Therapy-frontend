// src/pages/admin/AdminUsersPage.tsx

import React, { useState, useEffect } from 'react';
import { Users, Mail, Shield, Search, User as UserIcon } from 'lucide-react';
import apiRequest from '../../core/axios';
import Swal from 'sweetalert2';
import { getCookie, AUTH_TOKEN_KEY } from '../../utils/cookieUtils';
import Avatar from '../../components/Avatar';
import { useNavigate } from 'react-router-dom'; // NEW IMPORT

// Define base User interface from user.controller.ts response
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
  profileImage?: string;
  createdAt: string;
}

// Define the expected API Response structures
interface UsersResponse {
    success: true;
    message: string;
    data: User[];
    count: number;
}

// PackageActivation and UserDetailResponse interfaces are removed as they are no longer needed

const COLORS = {
  primary: '#5B8DC4',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  white: '#FFFFFF',
};

const AdminUsersPage: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'admin' | 'client'>('all');
  
  // State variables for the right sidebar (selectedUser, userPackages, loadingPackages) are removed

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = getCookie(AUTH_TOKEN_KEY);
      
      if (!token) {
        Swal.fire({
          icon: 'error',
          title: 'Authentication Required',
          text: 'Please log in to access this page',
        });
        return;
      }

      const response = await apiRequest.get<UsersResponse>('/users');

      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      const axiosError = error as any;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: axiosError.response?.data?.message || 'Failed to fetch users',
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle navigation to client dashboard
  const handleViewUserDashboard = (email: string) => {
    // Navigate to the same route used in ReservationPage: /admin/clients/:email
    navigate(`/admin/clients/${email}`);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });
  
  // getStatusColor function is removed

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.gray50 }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mx-auto mb-4" style={{ borderColor: COLORS.primary }}></div>
          <p className="text-xl font-semibold" style={{ color: COLORS.gray600 }}>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.gray50 }}>
      {/* Header */}
      <div className="p-6 border-b shadow-sm" style={{ backgroundColor: COLORS.white }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-extrabold flex items-center gap-3" style={{ color: COLORS.gray800 }}>
                <div className="p-2 rounded-xl" style={{ backgroundColor: `${COLORS.primary}20` }}>
                  <Users className="w-8 h-8" style={{ color: COLORS.primary }} />
                </div>
                User Management
              </h1>
              <p className="mt-2 text-sm font-medium" style={{ color: COLORS.gray600 }}>
                Manage users and view their roles
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border" style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray200 }}>
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6" style={{ color: COLORS.primary }} />
                <div>
                  <p className="text-xs font-bold" style={{ color: COLORS.gray600 }}>TOTAL USERS</p>
                  <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>{users.length}</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl border" style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray200 }}>
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6" style={{ color: COLORS.success }} />
                <div>
                  <p className="text-xs font-bold" style={{ color: COLORS.gray600 }}>ADMINS</p>
                  <p className="text-2xl font-bold" style={{ color: COLORS.success }}>
                    {users.filter((u) => u.role === 'admin').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl border" style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray200 }}>
              <div className="flex items-center gap-3">
                <UserIcon className="w-6 h-6" style={{ color: COLORS.warning }} />
                <div>
                  <p className="text-xs font-bold" style={{ color: COLORS.gray600 }}>CLIENTS</p>
                  <p className="text-2xl font-bold" style={{ color: COLORS.warning }}>
                    {users.filter((u) => u.role === 'client').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 gap-6"> 
          {/* Users List - now full width (lg:col-span-3 implicit) */}
          <div className="lg:col-span-3"> 
            <div className="rounded-xl border p-6 shadow-md" style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray200 }}>
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: COLORS.gray600 }} />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ borderColor: COLORS.gray200 }}
                  />
                </div>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as 'all' | 'admin' | 'client')}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ borderColor: COLORS.gray200 }}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="client">Client</option>
                </select>
              </div>

              {/* Users List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="p-4 border rounded-lg hover:shadow-md transition-all"
                    style={{
                      backgroundColor: COLORS.white,
                      borderColor: COLORS.gray200,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar
                          src={user.profileImage}
                          name={user.name}
                          size="md"
                          fallbackColor={COLORS.primary}
                        />
                        <div>
                          {/* MODIFIED: Make the user's name clickable */}
                          <button
                            type="button"
                            onClick={() => handleViewUserDashboard(user.email)}
                            className="font-bold cursor-pointer hover:underline"
                            style={{ color: COLORS.gray800 }}
                            title={`View dashboard for ${user.name}`}
                          >
                            {user.name}
                          </button>
                          
                          <div className="flex items-center gap-2 text-sm" style={{ color: COLORS.gray600 }}>
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: user.role === 'admin' ? `${COLORS.success}20` : `${COLORS.primary}20`,
                            color: user.role === 'admin' ? COLORS.success : COLORS.primary,
                          }}
                        >
                          {user.role === 'admin' ? <Shield className="w-3 h-3 inline mr-1" /> : <UserIcon className="w-3 h-3 inline mr-1" />}
                          {user.role.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Details Sidebar (Removed) */}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;