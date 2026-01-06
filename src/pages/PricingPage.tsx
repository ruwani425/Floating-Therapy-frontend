// src/pages/PricingPage.tsx

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Link } from 'react-router-dom' 
import { DollarSign, CheckCircle, Clock, Star, Zap, ChevronLeft, ChevronRight } from "lucide-react"
import apiRequest from "../core/axios"
import { motion, AnimatePresence } from "framer-motion"

const COLOR_PRIMARY = "var(--theta-blue, #3a7ca5)"
const COLOR_TEXT_MUTED = "#6B7280"
const COLOR_BACKGROUND = "#F9FAFB"

interface PackageData {
  _id: string
  name: string
  duration: "1-Month" | "6-Month" | "12-Month"
  sessions: number
  pricePerSlot: number
  totalPrice: number
  discount: number
  isGenesisEligible: boolean
  isActive: boolean
}

interface PaginationResponse {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface PaginatedResponse {
  data: PackageData[]
  pagination: PaginationResponse
}

interface ActivePackageCheckResponse {
    success: boolean
    data: any[]
}

const packageApiService = {
  fetchActivePackages: async (duration: string, page: number, limit = 4): Promise<PaginatedResponse> => {
    const response: PaginatedResponse = await apiRequest.get(
      `/packages/active?page=${page}&limit=${limit}&duration=${duration}`,
    )
    return response
  },

  checkActivePackage: async (): Promise<boolean> => {
    try {
        const response: ActivePackageCheckResponse = await apiRequest.get('/package-activations/user/active')
        return response.data && response.data.length > 0
    } catch (error) {
        console.error("Failed to check for active packages:", error)
        return false 
    }
  }
}

const PackageCard: React.FC<{ pkg: PackageData, hasActivePackage: boolean }> = ({ pkg, hasActivePackage }) => {
  const BASE_FLOAT_PRICE = 15000
  const originalPackageValue = BASE_FLOAT_PRICE * pkg.sessions
  const savings = originalPackageValue - pkg.totalPrice
  const formattedTotalPrice = pkg.totalPrice.toLocaleString("en-US")
  const formattedOriginalValue = originalPackageValue.toLocaleString("en-US")
  const formattedSavings = savings.toLocaleString("en-US")
  const finalPerFloat = (pkg.totalPrice / pkg.sessions).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  const isFeatured = pkg.sessions >= 48
  const isButtonDisabled = hasActivePackage

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      className={`relative flex flex-col p-5 sm:p-6 rounded-lg transition-shadow duration-300 h-full ${
        isFeatured
          ? "bg-white border-2 shadow-lg scale-100 sm:scale-105 z-10"
          : "bg-white border border-gray-200 shadow-sm hover:shadow-md"
      }`}
      style={{ borderColor: isFeatured ? COLOR_PRIMARY : undefined }}
    >
      {isFeatured && (
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-bl-lg"
        >
          ELITE
        </motion.div>
      )}

      <div className="mb-4">
        <h3 className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: COLOR_PRIMARY }}>
          {pkg.name}
        </h3>
        <p className="text-sm sm:text-base font-medium" style={{ color: COLOR_TEXT_MUTED }}>
          {pkg.sessions} Sessions
        </p>
      </div>

      <div className="mb-6 pb-4 border-b border-gray-100">
        <p className="text-xs sm:text-sm line-through mb-2" style={{ color: COLOR_TEXT_MUTED }}>
          Original: {formattedOriginalValue} LKR
        </p>
        <div className="flex flex-wrap items-baseline gap-1 mb-2">
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight break-words">
            {formattedTotalPrice}
          </p>
          <span className="text-xs sm:text-sm font-normal text-gray-700 whitespace-nowrap">LKR</span>
        </div>
        <motion.p 
          animate={{ scale: [1, 1.05, 1] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-xs sm:text-sm mt-2 font-semibold text-green-600 flex items-center flex-wrap gap-1"
        >
          <Zap className="w-4 h-4 flex-shrink-0" />
          <span>Save: {formattedSavings} LKR</span>
        </motion.p>
      </div>

      <div className="space-y-2 sm:space-y-3 flex-grow">
        <p className="flex items-center text-gray-700 font-medium text-xs sm:text-sm break-words">
          <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 mr-2 flex-shrink-0" style={{ color: COLOR_PRIMARY }} />
          <span>{finalPerFloat} LKR/Session</span>
        </p>
        <p className="flex items-center text-gray-600 text-xs sm:text-sm">
          <Clock className="w-4 sm:w-5 h-4 sm:h-5 mr-2 flex-shrink-0" style={{ color: COLOR_PRIMARY }} />
          {pkg.duration} Expiry
        </p>

        {pkg.isGenesisEligible && (
          <p className="flex items-center text-gray-800 font-semibold text-xs sm:text-sm pt-2">
            <Star className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-yellow-500 flex-shrink-0" />
            Genesis Eligible
          </p>
        )}
      </div>

      {isButtonDisabled ? (
          <button
            disabled
            className="mt-6 block w-full py-2.5 sm:py-3 text-center font-semibold rounded-md text-xs sm:text-sm opacity-50 cursor-not-allowed"
            style={{ backgroundColor: COLOR_TEXT_MUTED, color: "white" }}
          >
            Active Package Exists
          </button>
      ) : (
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
                to={`/package-appointments?packageId=${pkg._id}`}
                className="mt-6 block w-full py-2.5 sm:py-3 text-center font-semibold rounded-md transition duration-200 text-xs sm:text-sm"
                style={{ backgroundColor: COLOR_PRIMARY, color: "white" }}
            >
                Choose Package
            </Link>
          </motion.div>
      )}
    </motion.div>
  )
}

const PricingPage: React.FC = () => {
  const [packages, setPackages] = useState<Map<string, PackageData[]>>(new Map())
  const [paginationData, setPaginationData] = useState<Map<string, PaginationResponse>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("1-Month")
  const [currentPage, setCurrentPage] = useState(1)
  const PACKAGES_PER_PAGE = 4
  const [availableTabs, setAvailableTabs] = useState<string[]>([])
  
  const [hasActivePackage, setHasActivePackage] = useState(false)
  const [isLoadingActiveCheck, setIsLoadingActiveCheck] = useState(true)


  const checkActivePackageStatus = useCallback(async () => {
      setIsLoadingActiveCheck(true)
      const isActive = await packageApiService.checkActivePackage()
      setHasActivePackage(isActive)
      setIsLoadingActiveCheck(false)
  }, [])

  const fetchActivePackages = useCallback(
    async (duration: string, page: number) => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await packageApiService.fetchActivePackages(duration, page, PACKAGES_PER_PAGE)

        setPackages((prev) => {
          const updated = new Map(prev)
          updated.set(duration, response.data)
          return updated
        })

        setPaginationData((prev) => {
          const updated = new Map(prev)
          updated.set(duration, response.pagination)
          return updated
        })

        if (availableTabs.length === 0) {
          const tabs = ["1-Month", "6-Month", "12-Month"]
          setAvailableTabs(tabs)
          if (!tabs.includes(activeTab)) {
            setActiveTab("1-Month")
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch active packages:", err)
        const errorMessage = err?.message || "We couldn't load the pricing tiers. Please try again later."
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    },
    [activeTab, availableTabs],
  )

  useEffect(() => {
    fetchActivePackages(activeTab, currentPage)
    checkActivePackageStatus() 
  }, [activeTab, currentPage, fetchActivePackages, checkActivePackageStatus])

  const paginatedPackages = useMemo(() => {
    return packages.get(activeTab) || []
  }, [packages, activeTab])

  const pagination = useMemo(() => {
    return (
      paginationData.get(activeTab) || {
        page: 1,
        limit: 4,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      }
    )
  }, [paginationData, activeTab])

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const overallLoading = isLoading || isLoadingActiveCheck

  return (
    <div
      className="min-h-screen py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: COLOR_BACKGROUND }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <DollarSign className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4" style={{ color: COLOR_PRIMARY }} />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-2 sm:mb-4">
            Pricing & Membership
          </h1>
          <p className="text-base sm:text-lg lg:text-xl" style={{ color: COLOR_TEXT_MUTED }}>
            Choose the perfect path to elevate your well-being
          </p>
        </motion.div>

        {overallLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 sm:py-20 text-base sm:text-lg font-medium"
            style={{ color: COLOR_TEXT_MUTED }}
          >
            <Clock className="w-5 h-5 inline animate-spin mr-2" />
            Loading packages...
          </motion.div>
        ) : error ? (
          <div className="text-center p-6 sm:p-8 text-base sm:text-lg font-medium border border-red-300 rounded-lg"
               style={{ color: "#dc2626", backgroundColor: "#fee2e2" }}>
            Error: {error}
          </div>
        ) : (
          <div>
            <div className="flex justify-center mb-8 sm:mb-12 overflow-x-auto">
              <div className="inline-flex rounded-lg bg-white p-1 shadow border border-gray-200 gap-1">
                {availableTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className="relative px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded transition-colors duration-200 whitespace-nowrap z-10"
                    style={{ color: activeTab === tab ? "white" : "#4B5563" }}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 rounded shadow z-[-1]"
                        style={{ backgroundColor: COLOR_PRIMARY }}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <section className="mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center" style={{ color: COLOR_PRIMARY }}>
                {activeTab} Options
              </h2>
              
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
              >
                <AnimatePresence mode='popLayout'>
                    {paginatedPackages.map((pkg) => (
                        <PackageCard key={pkg._id} pkg={pkg} hasActivePackage={hasActivePackage} /> 
                    ))}
                </AnimatePresence>
              </motion.div>

              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6 sm:mt-8 md:mt-10">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: currentPage === 1 ? "#e5e7eb" : COLOR_PRIMARY,
                      color: currentPage === 1 ? "#9ca3af" : "white",
                    }}
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-1 sm:gap-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 ${
                          currentPage === page
                            ? "text-white shadow-md"
                            : "text-gray-700 bg-white border border-gray-300 hover:border-gray-400"
                        }`}
                        style={{
                          backgroundColor: currentPage === page ? COLOR_PRIMARY : undefined,
                        }}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === pagination.totalPages}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: currentPage === pagination.totalPages ? "#e5e7eb" : COLOR_PRIMARY,
                      color: currentPage === pagination.totalPages ? "#9ca3af" : "white",
                    }}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

export { PricingPage }
export default PricingPage