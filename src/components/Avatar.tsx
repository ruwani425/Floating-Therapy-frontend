// src/components/Avatar.tsx
import React, { useState } from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className = '',
  fallbackColor = '#5B8DC4',
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-20 h-20 text-3xl',
    xl: 'w-32 h-32 text-5xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16',
  };

  const getInitials = (name?: string): string => {
    if (!name) return 'U';
    
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const handleImageError = () => {
    console.warn('Failed to load profile image, showing fallback');
    setImageError(true);
  };

  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={alt || name || 'Profile'}
        onError={handleImageError}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 ${className}`}
        style={{ borderColor: fallbackColor }}
        loading="lazy"
      />
    );
  }

  if (name) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-bold border-2 ${className}`}
        style={{ backgroundColor: fallbackColor, borderColor: fallbackColor }}
      >
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white border-2 ${className}`}
      style={{ backgroundColor: fallbackColor, borderColor: fallbackColor }}
    >
      <User className={iconSizes[size]} />
    </div>
  );
};

export default Avatar;

