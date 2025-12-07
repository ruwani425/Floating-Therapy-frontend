// src/pages/admin/AdminUsersPage.tsx

import React, { useState, useEffect } from 'react';
import { Users, Mail, Shield, Package, Clock, Search, User as UserIcon } from 'lucide-react';
import apiRequest from '../../core/axios';
import Swal from 'sweetalert2';
import { getCookie, AUTH_TOKEN_KEY } from '../../utils/cookieUtils';
import Avatar from '../../components/Avatar';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
  profileImage?: string;
  createdAt: string;
}

interface PackageActivation {
  _id: string;
  packageName: string;
  status: 'Pending' | 'Contacted' | 'Confirmed' | 'Rejected';
  preferredDate: string;
  createdAt: string;
}

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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'admin' | 'client'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userPackages, setUserPackages] = useState<PackageActivation[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(false);

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

      const response = await apiRequest.get('/users');

      if (response.success) {
        setUsers(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to fetch users',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPackages = async (userId: string) => {
    try {
      setLoadingPackages(true);
      
      const response = await apiRequest.get(`/users/${userId}`);

      if (response.success) {
        setUserPackages(response.data.packageActivations);
      }
    } catch (error: any) {
      console.error('Error fetching user packages:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch user packages',
      });
    } finally {
      setLoadingPackages(false);
    }
  };

  const handleViewUser = async (user: User) => {
    setSelectedUser(user);
    await fetchUserPackages(user._id);
  };

  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'client') => {
    try {
      const result = await Swal.fire({
        title: 'Update User Role',
        text: `Change role to ${newRole}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: COLORS.primary,
        cancelButtonColor: COLORS.error,
        confirmButtonText: 'Yes, update it!',
      });

      if (result.isConfirmed) {
        const response = await apiRequest.patch(
          `/users/${userId}/role`,
          { role: newRole }
        );

        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'User role updated successfully',
            toast: true,
            position: 'top-end',
            timer: 2000,
            showConfirmButton: false,
          });
          fetchUsers();
          if (selectedUser && selectedUser._id === userId) {
            setSelectedUser({ ...selectedUser, role: newRole });
          }
        }
      }
    } catch (error: any) {
      console.error('Error updating role:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update user role',
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return COLORS.success;
      case 'Pending':
        return COLORS.warning;
      case 'Contacted':
        return COLORS.primary;
      case 'Rejected':
        return COLORS.error;
      default:
        return COLORS.gray600;
    }
  };

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
                Manage users and view their package activations
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Users List */}
          <div className="lg:col-span-2">
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
                    onClick={() => handleViewUser(user)}
                    className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                    style={{
                      backgroundColor: selectedUser?._id === user._id ? `${COLORS.primary}10` : COLORS.white,
                      borderColor: selectedUser?._id === user._id ? COLORS.primary : COLORS.gray200,
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
                          <p className="font-bold" style={{ color: COLORS.gray800 }}>{user.name}</p>
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

          {/* User Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border p-6 shadow-md sticky top-6" style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray200 }}>
              {selectedUser ? (
                <>
                  <div className="text-center mb-6">
                    <Avatar
                      src={selectedUser.profileImage}
                      name={selectedUser.name}
                      size="lg"
                      className="mx-auto mb-4"
                      fallbackColor={COLORS.primary}
                    />
                    <h3 className="text-xl font-bold" style={{ color: COLORS.gray800 }}>{selectedUser.name}</h3>
                    <p className="text-sm" style={{ color: COLORS.gray600 }}>{selectedUser.email}</p>
                    <div className="mt-3">
                      <span
                        className="px-4 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2"
                        style={{
                          backgroundColor: selectedUser.role === 'admin' ? `${COLORS.success}20` : `${COLORS.primary}20`,
                          color: selectedUser.role === 'admin' ? COLORS.success : COLORS.primary,
                        }}
                      >
                        {selectedUser.role === 'admin' ? <Shield className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                        {selectedUser.role.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Role Update Buttons */}
                  <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: COLORS.gray50 }}>
                    <p className="text-xs font-bold mb-3" style={{ color: COLORS.gray600 }}>CHANGE ROLE</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateRole(selectedUser._id, 'admin')}
                        disabled={selectedUser.role === 'admin'}
                        className="flex-1 py-2 px-4 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: selectedUser.role === 'admin' ? COLORS.success : COLORS.white,
                          color: selectedUser.role === 'admin' ? COLORS.white : COLORS.success,
                          border: `2px solid ${COLORS.success}`,
                        }}
                      >
                        <Shield className="w-4 h-4 inline mr-1" />
                        Admin
                      </button>
                      <button
                        onClick={() => handleUpdateRole(selectedUser._id, 'client')}
                        disabled={selectedUser.role === 'client'}
                        className="flex-1 py-2 px-4 rounded-lg font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: selectedUser.role === 'client' ? COLORS.primary : COLORS.white,
                          color: selectedUser.role === 'client' ? COLORS.white : COLORS.primary,
                          border: `2px solid ${COLORS.primary}`,
                        }}
                      >
                        <UserIcon className="w-4 h-4 inline mr-1" />
                        Client
                      </button>
                    </div>
                  </div>

                  {/* Package Activations */}
                  <div>
                    <h4 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: COLORS.gray800 }}>
                      <Package className="w-5 h-5" style={{ color: COLORS.primary }} />
                      Package Activations ({userPackages.length})
                    </h4>
                    {loadingPackages ? (
                      <p className="text-center text-sm" style={{ color: COLORS.gray600 }}>Loading...</p>
                    ) : userPackages.length > 0 ? (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {userPackages.map((pkg) => (
                          <div key={pkg._id} className="p-3 border rounded-lg" style={{ borderColor: COLORS.gray200 }}>
                            <p className="font-bold text-sm" style={{ color: COLORS.gray800 }}>{pkg.packageName}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span
                                className="px-2 py-1 rounded text-xs font-bold"
                                style={{
                                  backgroundColor: `${getStatusColor(pkg.status)}20`,
                                  color: getStatusColor(pkg.status),
                                }}
                              >
                                {pkg.status}
                              </span>
                              <div className="flex items-center gap-1 text-xs" style={{ color: COLORS.gray600 }}>
                                <Clock className="w-3 h-3" />
                                {new Date(pkg.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-sm py-4" style={{ color: COLORS.gray600 }}>No package activations</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.gray200 }} />
                  <p className="text-sm font-semibold" style={{ color: COLORS.gray600 }}>Select a user to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
