// src/components/admin/AdminCard.tsx
import type { FC } from "react"
import type { LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"

interface AdminCardProps {
  title: string
  path: string
  description: string
  Icon: LucideIcon
  animationDelay?: number
}

const THETA_COLORS = {
  lightCyan: "#D4F1F9",
  darkestBlue: "#0F1F2E",
  darkBlue: "#233547",
  mediumBlue: "#475D73",
}

const AdminCard: FC<AdminCardProps> = ({ title, path, description, Icon, animationDelay = 0 }) => {
  return (
    <Link
      to={path}
      className="group block p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg sm:rounded-xl md:rounded-2xl bg-white border border-slate-200 shadow-sm 
                 hover:shadow-md hover:border-blue-300 transition-all duration-300 
                 relative overflow-hidden animate-fade-in-scale h-full flex flex-col"
      style={{ animationDelay: `${animationDelay}s` }}
    >
      <div className="relative z-10">
        <div
          className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-lg sm:rounded-xl mb-2 sm:mb-3 md:mb-4 transition-transform group-hover:scale-110"
          style={{ backgroundColor: THETA_COLORS.lightCyan }}
        >
          <Icon
            className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 lg:w-6 lg:h-6"
            style={{ color: THETA_COLORS.darkestBlue }}
          />
        </div>

        <h3
          className="text-sm sm:text-base md:text-lg lg:text-lg font-bold mb-1 sm:mb-2 line-clamp-2"
          style={{ color: THETA_COLORS.darkestBlue }}
        >
          {title}
        </h3>

        <p
          className="text-xs sm:text-xs md:text-sm lg:text-sm leading-relaxed opacity-80 line-clamp-2"
          style={{ color: THETA_COLORS.darkBlue }}
        >
          {description}
        </p>
      </div>

      <div className="mt-3 sm:mt-4 pt-1 sm:pt-2 flex items-center text-blue-500 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1">
        <span className="text-xs font-bold mr-1">Open</span>
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  )
}

export default AdminCard
