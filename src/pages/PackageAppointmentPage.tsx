import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, Link, useNavigate } from 'react-router-dom'; 
import { Clock, Star, Zap, User, Mail, Phone, Send, Package, CheckCircle, ChevronLeft, MapPin } from "lucide-react"; 
import apiRequest from "../core/axios"; 
import Swal from 'sweetalert2'; 
import { useAuth } from '../components/AuthProvider'; 

const COLOR_PRIMARY = "#3a7ca5";
const COLOR_ACCENT_LIGHT = "#a0e7e5";
const COLOR_TEXT_MUTED = "#6B7280";
const COLOR_BACKGROUND = "#F9FAFB";
const COLOR_TEXT_DARK = "#1B4965";

interface PackageData {
  _id: string;
  name: string;
  duration: "1-Month" | "6-Month" | "12-Month";
  sessions: number;
  pricePerSlot: number;
  totalPrice: number;
  discount: number;
  isGenesisEligible: boolean;
  isActive: boolean;
}

interface ActivationPayload {
  fullName: string;
  email: string;
  phone: string;
  address: string; 
  preferredDate: string;
  message: string;
  packageId: string;
}

interface InternalFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  message: string;
}


const useQueryPackageId = (): string | null => {
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  return params.get('packageId'); 
}


const packageApiService = {
  fetchPackageDetails: async (packageId: string): Promise<PackageData | null> => {
    try {
        const response: { data: PackageData } = await apiRequest.get(`/packages/${packageId}`); 
        return response.data;
    } catch (error: any) {
        console.error("API Error fetching package details:", error);
        throw new Error(error?.message || "Failed to load package details from server.");
    }
  },
  submitActivation: async (data: ActivationPayload): Promise<void> => {
    try {
        const response = await apiRequest.post('/package-activations', data);
        console.log("Package Activation submitted successfully:", response);
    } catch (error: any) {
        console.error("Submission error:", error);
        throw new Error(error?.message || "Failed to submit your request.");
    }
  },
};


const PackageSummaryCard: React.FC<{ pkg: PackageData }> = ({ pkg }) => {
  const formattedTotalPrice = pkg.totalPrice.toLocaleString("en-US");
  const finalPerFloat = (pkg.totalPrice / pkg.sessions).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <div className="p-6 sm:p-8 rounded-xl shadow-lg bg-white border-2" style={{ borderColor: COLOR_ACCENT_LIGHT }}>
      <div className="flex items-center mb-4">
        <Package className="w-8 h-8 mr-3" style={{ color: COLOR_PRIMARY }} />
        <h2 className="text-2xl font-bold" style={{ color: COLOR_TEXT_DARK }}>
          {pkg.name} Package
        </h2>
        </div>
      
      <div className="space-y-3 pt-3 border-t border-gray-100">
        <p className="flex justify-between items-center text-gray-700">
          <span className="flex items-center font-medium text-sm sm:text-base"><Zap className="w-5 h-5 mr-2 text-green-500" /> Total Sessions</span>
          <span className="text-lg font-bold" style={{ color: COLOR_PRIMARY }}>{pkg.sessions}</span>
        </p>
        <p className="flex justify-between items-center text-gray-700">
          <span className="flex items-center font-medium text-sm sm:text-base"><Clock className="w-5 h-5 mr-2" style={{ color: COLOR_PRIMARY }} /> Expiry</span>
          <span className="text-lg font-bold">{pkg.duration}</span>
        </p>
        <div className="h-px bg-gray-200 my-4" />
        <p className="flex justify-between items-center text-gray-800">
          <span className="flex items-center font-bold text-base sm:text-xl text-gray-900"><CheckCircle className="w-6 h-6 mr-2 text-green-600" /> Total Investment</span>
          <span className="text-2xl sm:text-3xl font-extrabold" style={{ color: COLOR_PRIMARY }}>
            {formattedTotalPrice} LKR
          </span>
        </p>
        <p className="text-right text-xs sm:text-sm text-gray-500 font-medium">
          ({finalPerFloat} LKR per session)
        </p>
        {pkg.isGenesisEligible && (
          <p className="flex items-center text-sm font-semibold text-yellow-600 pt-2 border-t border-yellow-100">
            <Star className="w-4 h-4 mr-2" />
            Genesis Collective Eligible
          </p>
        )}
      </div>
    </div>
  );
};


const PackageAppointmentPage: React.FC = () => {
  const packageId = useQueryPackageId();
  const navigate = useNavigate(); 
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [pkg, setPkg] = useState<PackageData | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'fail'>('idle');

  const [formData, setFormData] = useState<InternalFormData>({
    fullName: '',
    email: '', 
    phone: '',
    address: '',
    message: '',
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      Swal.fire({
        icon: 'info',
        title: 'Login Required',
        text: 'Please log in to continue with your package activation.',
        confirmButtonText: 'Go to Login',
        confirmButtonColor: COLOR_PRIMARY,
      }).then(() => {
        navigate('/login');
      });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const fetchUserProfile = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const response: any = await apiRequest.get('/users/me');
      if (response.success && response.data) {
        setUserEmail(response.data.email);
        setFormData(prev => ({ ...prev, email: response.data.email }));
        console.log('✅ User email loaded:', response.data.email);
      }
    } catch (err: any) {
      console.error("Failed to fetch user profile:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load your profile. Please try refreshing the page.',
        confirmButtonColor: COLOR_PRIMARY,
      });
    }
  }, [isAuthenticated]);

  const fetchPackageDetails = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const details = await packageApiService.fetchPackageDetails(id);
      if (details) {
        setPkg(details);
      } else {
        setError("Selected package not found or no longer active.");
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err?.message || "Failed to load package details. Please try refreshing.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchUserProfile();
    }
  }, [isAuthenticated, authLoading, fetchUserProfile]);

  useEffect(() => {
    if (packageId && isAuthenticated && !authLoading) {
      fetchPackageDetails(packageId);
    } else if (!packageId && !authLoading) {
      setIsLoading(false);
      setError("No package selected. Please return to the pricing page.");
    }
  }, [packageId, isAuthenticated, authLoading, fetchPackageDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkg) {
      setError("Cannot submit request: Package data is missing.");
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.address || !userEmail) {
        setError("Please fill out all required fields.");
        return;
    }

    setIsSubmitting(true);
    setSubmissionStatus('idle');
    setError(null);

    try {
      const dataToSubmit: ActivationPayload = {
        ...formData,
        email: userEmail,
        packageId: pkg._id,
        preferredDate: new Date().toISOString(), 
      };
      
      await packageApiService.submitActivation(dataToSubmit); 
      
      await Swal.fire({
          icon: 'success',
          title: 'Request Sent!',
          html: `Your request for the <strong>${pkg.name}</strong> package has been successfully submitted. Our team will contact you within 1 business day to finalize the details.`,
          confirmButtonText: 'View Pricing',
          confirmButtonColor: COLOR_PRIMARY,
      });
      
      navigate('/pricing');
      

    } catch (err: any) {
      console.error("Submission error:", err);
      setSubmissionStatus('fail');
      setError(err?.message || "Failed to submit your request. Please check your network or try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (authLoading || isLoading) {
      return (
        <div className="text-center py-20 text-lg font-medium" style={{ color: COLOR_TEXT_MUTED }}>
          <Clock className="w-6 h-6 inline animate-spin mr-2" />
          {authLoading ? 'Checking authentication...' : 'Loading package details...'}
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    if (error && !pkg) {
      return (
        <div className="text-center p-8 text-lg font-medium border border-red-300 rounded-lg max-w-xl mx-auto" style={{ color: "#dc2626", backgroundColor: "#fee2e2" }}>
          <p>Error: {error}</p>
          <Link 
            to="/" 
            className="mt-4 inline-flex items-center font-semibold underline"
            style={{ color: COLOR_PRIMARY }}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Return to Pricing
          </Link>
        </div>
      );
    }

    if (!pkg) return null;

    return (
      <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
        
        <div className="lg:col-span-1 space-y-8">
          <PackageSummaryCard pkg={pkg} />
          <div className="p-6 rounded-xl bg-white shadow-md border border-gray-200">
             <h3 className="text-xl font-bold mb-3" style={{ color: COLOR_TEXT_DARK }}>What Happens Next?</h3>
             <ul className="text-sm space-y-2 text-gray-600">
                <li className="flex items-start"><CheckCircle className="w-4 h-4 mt-1 mr-2 text-green-500 flex-shrink-0"/> You submit your details via the form.</li>
                <li className="flex items-start"><CheckCircle className="w-4 h-4 mt-1 mr-2 text-green-500 flex-shrink-0"/> Our team contacts you within 1 business day to confirm.</li>
                <li className="flex items-start"><CheckCircle className="w-4 h-4 mt-1 mr-2 text-green-500 flex-shrink-0"/> We finalize your package activation and first float session booking.</li>
             </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="p-6 sm:p-8 rounded-xl shadow-2xl bg-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: COLOR_PRIMARY }}>
              Confirm Your Package & Request Activation
            </h2>
            <p className="text-sm sm:text-base mb-6 text-gray-600">
              Complete the form below and one of our specialists will be in touch shortly to secure your booking for the <strong style={{color: COLOR_PRIMARY}}>{pkg.name}</strong> package.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {error && submissionStatus !== 'success' && (
                 <div className="p-4 rounded-lg bg-red-50 text-red-700 font-semibold flex items-center shadow-inner">
                   {error}
                 </div>
              )}
              
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-base transition duration-150"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative rounded-md shadow-sm bg-gray-50">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5" style={{ color: COLOR_PRIMARY }} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    readOnly
                    value={userEmail}
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed text-base"
                    placeholder="Loading..."
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                  Your email from your account profile
                </p>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-base transition duration-150"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Billing/Contact Address</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="address"
                    id="address"
                    rows={3}
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base transition duration-150"
                    placeholder="Street, City, Postal Code"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base transition duration-150"
                  placeholder="Let us know if you have any specific requirements or questions."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || submissionStatus === 'success'}
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-md shadow-lg transition duration-300 ease-in-out transform hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: COLOR_PRIMARY, color: "white" }}
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-5 h-5 mr-3 animate-spin" />
                    Submitting Request...
                  </>
                ) : submissionStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-3" />
                    Request Sent!
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3" />
                    Submit Activation Request
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8" 
      style={{ backgroundColor: COLOR_BACKGROUND }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-2" style={{ color: COLOR_TEXT_DARK }}>
            Package Confirmation
          </h1> 
          <p className="text-base sm:text-lg" style={{ color: COLOR_TEXT_MUTED }}>
            You are one step closer to deep relaxation.
          </p>
        </div>

        {renderContent()}
        
      </div>
      
    </div>
  );
};

export default PackageAppointmentPage;