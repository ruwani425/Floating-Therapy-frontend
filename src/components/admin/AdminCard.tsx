import type { FC } from "react"
import type { LucideIcon } from "lucide-react"

interface AdminCardProps {
  title: string
  path: string
  description: string
  Icon: LucideIcon
  animationDelay?: number
  iconColor?: string
}

// THETA_COLORS palette
const THETA_COLORS = {
  lightestBlue: "#92B8D9",
  lightBlue: "#92B8D9",
  mediumBlue: "#475D73",
  darkBlue: "#233547",
  white: "#FFFFFF",
  bgLight: "#F5F8FC",
  darkGray: "#1a1a1a",
}

const CustomCardStyles = `
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .animate-fade-in-scale {
    animation: fadeInScale 0.4s ease-out forwards;
  }
`

const AdminCard: FC<AdminCardProps> = ({
  title,
  path,
  description,
  Icon,
  animationDelay = 0,
  iconColor = "#233547",
}) => {
  const iconBgColor = `${iconColor}15`
  const cardBgGradient = `linear-gradient(135deg, ${THETA_COLORS.bgLight} 0%, rgba(146, 184, 217, 0.08) 100%)`

  return (
    <a
      href={path}
      className="block p-6 rounded-xl shadow-md h-full
                 hover:shadow-lg transition-all duration-300 
                 group relative overflow-hidden animate-fade-in-scale flex flex-col justify-between cursor-pointer
                 border hover:border-blue-300"
      style={{
        animationDelay: `${animationDelay}s`,
        background: cardBgGradient,
        borderColor: `${iconColor}25`,
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: CustomCardStyles }} />

      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative z-10 flex flex-col items-start justify-start h-full">
        <div
          className="p-3 mb-4 rounded-lg transition-all duration-300 group-hover:scale-110"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon
            className="w-6 h-6 transition-colors duration-300 group-hover:brightness-110"
            style={{ color: iconColor }}
          />
        </div>

        <h3
          className="text-lg font-serif font-bold mb-2 line-clamp-2 transition-colors duration-300"
          style={{ color: iconColor }}
        >
          {title}
        </h3>

        <p className="text-sm font-sans leading-relaxed flex-grow" style={{ color: THETA_COLORS.mediumBlue }}>
          {description}
        </p>

        <div
          className="mt-4 pt-3 flex items-center gap-1 transition-all duration-300 group-hover:translate-x-1"
          style={{ color: THETA_COLORS.lightBlue }}
        >
          <svg
            className="w-5 h-5 transition-colors duration-300 group-hover:text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </a>
  )
}

export default AdminCard
