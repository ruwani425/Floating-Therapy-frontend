import React, { useState, useEffect } from 'react';
import { User, Mail, Package, Clock, CheckCircle, XCircle, AlertCircle, Phone, Calendar } from 'lucide-react';
import apiRequest from '../core/axios';
import Swal from 'sweetalert2';
import { useAuth } from '../components/AuthProvider';
import { getCookie, AUTH_TOKEN_KEY } from '../utils/cookieUtils';
import Avatar from '../components/Avatar';
import type { AuthUser } from '../redux/authSlice';

// --- Interfaces for Typing ---
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface UserProfile extends AuthUser {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

// 🛑 MODIFIED INTERFACE: Added optional startDate and expiryDate
interface PackageActivation {
  _id: string;
  packageName: string;
  status: 'Pending' | 'Contacted' | 'Confirmed' | 'Rejected';
  preferredDate: string;
  createdAt: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  message?: string;
    // 🆕 NEW: startDate and expiryDate fields are included here
    startDate?: string;
    expiryDate?: string;
  packageId: {
    name: string;
    duration: string;
    sessions: number;
    totalPrice: number;
  };
}

interface Appointment {
  _id: string;
  reservationId: string; // Added field
  date: string; // YYYY-MM-DD format
  time: string; // HH:mm format
  status: 'pending' | 'confirmed' | 'canceled' | 'completed'; // Matches controller output
  name: string;
  contactNumber: string;
  specialNote?: string;
  isPackageUser: boolean; 
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

const UserProfilePage: React.FC = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [packages, setPackages] = useState<PackageActivation[]>([]);
  const [reservations, setReservations] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [loadingReservations, setLoadingReservations] = useState(true);
  const [activeTab, setActiveTab] = useState<'packages' | 'reservations'>('packages');

  useEffect(() => {
    fetchProfile();
    fetchMyPackages();
    fetchMyReservations();
  }, []);

  const fetchProfile = async () => {
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

      const response: ApiResponse<UserProfile> = await apiRequest.get('/users/me');

      if (response.success) {
        setProfile(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to fetch profile',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPackages = async () => {
    try {
      setLoadingPackages(true);
      
      // Assuming /users/me/packages returns PackageActivation[] which includes startDate and expiryDate for Confirmed packages
      const response: ApiResponse<PackageActivation[]> = await apiRequest.get('/users/me/packages');

      if (response.success) {
        setPackages(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoadingPackages(false);
    }
  };

  const fetchMyReservations = async () => {
    try {
      setLoadingReservations(true);
      
      const response: ApiResponse<Appointment[]> = await apiRequest.get('/appointments/me');

      if (response.success) {
        setReservations(response.data); 
      }
    } catch (error: any) {
      console.error('Error fetching reservations:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to fetch reservations',
      });
    } finally {
      setLoadingReservations(false);
    }
  };

    // Helper function for date formatting
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };


  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="w-5 h-5" style={{ color: COLORS.success }} />;
      case 'pending':
        return <Clock className="w-5 h-5" style={{ color: COLORS.warning }} />;
      case 'contacted':
        return <Phone className="w-5 h-5" style={{ color: COLORS.primary }} />;
      case 'rejected':
      case 'canceled':
        return <XCircle className="w-5 h-5" style={{ color: COLORS.error }} />;
      default:
        return <AlertCircle className="w-5 h-5" style={{ color: COLORS.gray600 }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return COLORS.success;
      case 'pending':
        return COLORS.warning;
      case 'contacted':
        return COLORS.primary;
      case 'rejected':
      case 'canceled':
        return COLORS.error;
      default:
        return COLORS.gray600;
    }
  };

  const getReservationStatusColor = (status: string) => {
    return getStatusColor(status);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.gray50 }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent mx-auto mb-4" style={{ borderColor: COLORS.primary }}></div>
          <p className="text-xl font-semibold" style={{ color: COLORS.gray600 }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  // --- RENDER FUNCTIONS FOR TABS ---

  const renderPackagesTab = () => {
    if (loadingPackages) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-4" style={{ borderColor: COLORS.primary }}></div>
          <p className="text-sm" style={{ color: COLORS.gray600 }}>Loading packages...</p>
        </div>
      );
    }

    if (packages.length === 0) {
      return (
        <div className="text-center py-16">
          <Package className="w-20 h-20 mx-auto mb-4" style={{ color: COLORS.gray200 }} />
          <h4 className="text-xl font-bold mb-2" style={{ color: COLORS.gray800 }}>No Package Activations Yet</h4>
          <p className="text-sm mb-6" style={{ color: COLORS.gray600 }}>
            You haven't activated any packages yet. Browse our pricing page to get started!
          </p>
          <a
            href="/pricing"
            className="inline-block px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: COLORS.primary }}
          >
            View Packages
          </a>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {packages.map((pkg) => (
          <div 
            key={pkg._id} 
            className="border-2 rounded-xl p-6 hover:shadow-lg transition-all"
            style={{ borderColor: COLORS.gray200 }}
          >
            {/* Package Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-xl font-bold mb-2" style={{ color: COLORS.gray800 }}>
                  {pkg.packageName}
                </h4>
                {pkg.packageId && (
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="flex items-center gap-1" style={{ color: COLORS.gray600 }}>
                      <Clock className="w-4 h-4" />
                      {pkg.packageId.duration}
                    </span>
                    <span className="flex items-center gap-1" style={{ color: COLORS.gray600 }}>
                      <Package className="w-4 h-4" />
                      {pkg.packageId.sessions} Sessions
                    </span>
                    <span className="font-bold" style={{ color: COLORS.primary }}>
                      Rs. {pkg.packageId.totalPrice.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(pkg.status)}
                <span
                  className="px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap"
                  style={{
                    backgroundColor: `${getStatusColor(pkg.status)}20`,
                    color: getStatusColor(pkg.status),
                  }}
                >
                  {pkg.status}
                </span>
              </div>
            </div>

            {/* Package Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t" style={{ borderColor: COLORS.gray200 }}>
                {/* 🛑 MODIFIED LOGIC: Display Start/Expiry Date if Confirmed, otherwise display Created Date */}
                
                {pkg.status === 'Confirmed' && pkg.startDate && pkg.expiryDate ? (
                    <>
                        <div className='md:col-span-1'>
                            <p className="text-xs font-bold mb-1" style={{ color: COLORS.gray600 }}>START DATE</p>
                            <p className="text-sm font-semibold" style={{ color: COLORS.success }}>
                                {formatDate(pkg.startDate)}
                            </p>
                        </div>
                        <div className='md:col-span-1'>
                            <p className="text-xs font-bold mb-1" style={{ color: COLORS.gray600 }}>EXPIRY DATE</p>
                            <p className="text-sm font-semibold" style={{ color: COLORS.error }}>
                                {formatDate(pkg.expiryDate)}
                            </p>
                        </div>
                        <div className='md:col-span-1'>
                            <p className="text-xs font-bold mb-1" style={{ color: COLORS.gray600 }}>CONTACT</p>
                            <p className="text-sm font-semibold" style={{ color: COLORS.gray800 }}>{pkg.phone}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className='md:col-span-1'>
                            <p className="text-xs font-bold mb-1" style={{ color: COLORS.gray600 }}>REQUESTED DATE</p>
                            <p className="text-sm font-semibold" style={{ color: COLORS.gray800 }}>
                                {formatDate(pkg.createdAt)}
                            </p>
                        </div>
                        <div className='md:col-span-1'>
                            <p className="text-xs font-bold mb-1" style={{ color: COLORS.gray600 }}>CONTACT</p>
                            <p className="text-sm font-semibold" style={{ color: COLORS.gray800 }}>{pkg.phone}</p>
                        </div>
                        {/* Empty cell for spacing */}
                        <div className='md:col-span-1'></div>
                    </>
                )}
                
              {pkg.message && (
                <div className="md:col-span-3">
                  <p className="text-xs font-bold mb-1" style={{ color: COLORS.gray600 }}>MESSAGE</p>
                  <p className="text-sm" style={{ color: COLORS.gray800 }}>{pkg.message}</p>
                </div>
              )}
            </div>

            {/* Status Message */}
            {pkg.status === 'Confirmed' && (
              <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${COLORS.success}10` }}>
                <p className="text-sm font-semibold flex items-center gap-2" style={{ color: COLORS.success }}>
                  <CheckCircle className="w-4 h-4" />
                  Package activated! You can now book sessions.
                </p>
              </div>
            )}
            {pkg.status === 'Pending' && (
              <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${COLORS.warning}10` }}>
                <p className="text-sm font-semibold flex items-center gap-2" style={{ color: COLORS.warning }}>
                  <Clock className="w-4 h-4" />
                  Your request is pending review. We'll contact you soon.
                </p>
              </div>
            )}
            {pkg.status === 'Contacted' && (
              <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: `${COLORS.primary}10` }}>
                <p className="text-sm font-semibold flex items-center gap-2" style={{ color: COLORS.primary }}>
                  <Phone className="w-4 h-4" />
                  We've reached out to you. Please check your email/phone.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderReservationsTab = () => {
    if (loadingReservations) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-4" style={{ borderColor: COLORS.primary }}></div>
          <p className="text-sm" style={{ color: COLORS.gray600 }}>Loading reservations...</p>
        </div>
      );
    }
    
    if (reservations.length === 0) {
      return (
        <div className="text-center py-16">
          <Calendar className="w-20 h-20 mx-auto mb-4" style={{ color: COLORS.gray200 }} />
          <h4 className="text-xl font-bold mb-2" style={{ color: COLORS.gray800 }}>No Reservations Found</h4>
          <p className="text-sm mb-6" style={{ color: COLORS.gray600 }}>
            You haven't booked any appointments yet. Use our booking page to schedule a session.
          </p>
          <a
            href="/book"
            className="inline-block px-6 py-3 rounded-lg font-bold text-white transition-all hover:opacity-90"
            style={{ backgroundColor: COLORS.primary }}
          >
            Book Now
          </a>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {reservations.map((res) => (
          <div 
            key={res._id} 
            className="border-2 rounded-xl p-6 hover:shadow-lg transition-all"
            style={{ borderColor: COLORS.gray200 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-xl font-bold mb-1" style={{ color: COLORS.gray800 }}>
                  <span className="font-semibold text-sm" style={{ color: COLORS.gray600, marginRight: '8px' }}>ID:</span>
                  <span
                    className="font-extrabold"
                    // FIX: Apply status color to the reservation ID
                    style={{ color: getReservationStatusColor(res.status) }}
                  >
                    {res.reservationId}
                  </span>
                </h4>
                <p className="text-sm font-medium" style={{ color: COLORS.gray600 }}>
                  {res.isPackageUser ? 'Package Session' : 'Standard Booking'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(res.status)}
                <span
                  className="px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap"
                  style={{
                    backgroundColor: `${getReservationStatusColor(res.status)}20`,
                    color: getReservationStatusColor(res.status),
                  }}
                >
                  {res.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t" style={{ borderColor: COLORS.gray200 }}>
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: COLORS.gray600 }}>DATE & TIME</p>
                <p className="text-sm font-semibold" style={{ color: COLORS.gray800 }}>
                  {new Date(res.date).toLocaleDateString()} at {res.time}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: COLORS.gray600 }}>BOOKED ON</p>
                <p className="text-sm font-semibold" style={{ color: COLORS.gray800 }}>
                  {new Date(res.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {res.specialNote && (
              <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: COLORS.gray100 }}>
                <p className="text-xs font-bold mb-1" style={{ color: COLORS.gray600 }}>NOTE</p>
                <p className="text-sm" style={{ color: COLORS.gray800 }}>{res.specialNote}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: COLORS.gray50 }}>
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card (Left Side) */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border p-6 shadow-md sticky top-24" style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray200 }}>
              <div className="text-center">
                <Avatar
                  src={profile?.profileImage}
                  name={profile?.name}
                  size="xl"
                  className="mx-auto mb-4"
                  fallbackColor={COLORS.primary}
                />
                
                <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.gray800 }}>
                  {profile?.name || authUser?.name}
                </h2>
                
                <div className="flex items-center justify-center gap-2 mb-4 text-sm" style={{ color: COLORS.gray600 }}>
                  <Mail className="w-4 h-4" />
                  {profile?.email || authUser?.email}
                </div>

                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold"
                  style={{
                    backgroundColor: profile?.role === 'admin' ? `${COLORS.success}20` : `${COLORS.primary}20`,
                    color: profile?.role === 'admin' ? COLORS.success : COLORS.primary,
                  }}
                >
                  <User className="w-4 h-4" />
                  {(profile?.role || 'client').toUpperCase()}
                </span>

                <div className="mt-6 pt-6 border-t" style={{ borderColor: COLORS.gray200 }}>
                  <div className="text-left space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium" style={{ color: COLORS.gray600 }}>Member Since</span>
                      <span className="text-sm font-bold" style={{ color: COLORS.gray800 }}>
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium" style={{ color: COLORS.gray600 }}>Active Packages</span>
                      <span className="text-sm font-bold" style={{ color: COLORS.primary }}>
                        {packages.filter(p => p.status === 'Confirmed').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium" style={{ color: COLORS.gray600 }}>Total Requests</span>
                      <span className="text-sm font-bold" style={{ color: COLORS.gray800 }}>
                        {packages.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium" style={{ color: COLORS.gray600 }}>Total Reservations</span>
                      <span className="text-sm font-bold" style={{ color: COLORS.gray800 }}>
                        {reservations.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabbed Section (Right Side) */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border p-6 shadow-md" style={{ backgroundColor: COLORS.white, borderColor: COLORS.gray200 }}>
              
              {/* --- Tabs Navigation --- */}
              <div className="flex border-b mb-6" style={{ borderColor: COLORS.gray200 }}>
                
                <button
                  className={`flex items-center gap-2 py-3 px-4 text-lg font-bold transition-colors ${
                    activeTab === 'packages' 
                      ? 'border-b-4' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  style={{ borderColor: activeTab === 'packages' ? COLORS.primary : 'transparent', color: activeTab === 'packages' ? COLORS.primary : COLORS.gray600 }}
                  onClick={() => setActiveTab('packages')}
                >
                  <Package className="w-5 h-5" />
                  Package Activations
                </button>
                
                <button
                  className={`flex items-center gap-2 py-3 px-4 text-lg font-bold transition-colors ${
                    activeTab === 'reservations' 
                      ? 'border-b-4' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  style={{ borderColor: activeTab === 'reservations' ? COLORS.primary : 'transparent', color: activeTab === 'reservations' ? COLORS.primary : COLORS.gray600 }}
                  onClick={() => setActiveTab('reservations')}
                >
                  <Calendar className="w-5 h-5" />
                  My Reservations
                </button>
              </div>

              {/* --- Tabs Content --- */}
              <div>
                {activeTab === 'packages' && renderPackagesTab()}
                {activeTab === 'reservations' && renderReservationsTab()}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;