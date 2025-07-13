'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '../../../components/ui/skeleton';

interface AvatarNodeProps {
  firstName: string;
  lastName: string;
  photoUrl?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const generateInitialsColor = (name: string) => {
  const hash = name.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 85%)`;
};

const SkeletonAvatar = ({ size }: { size: AvatarNodeProps['size'] }) => {
  const sizeMap = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };
  
  return (
    <Skeleton className={`${sizeMap[size || 'medium']} rounded-full`} />
  );
};

const InitialsAvatar = ({ firstName, lastName, size }: { 
  firstName: string; 
  lastName: string; 
  size: AvatarNodeProps['size'];
}) => {
  const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
  const bgColor = generateInitialsColor(`${firstName}${lastName}`);
  
  const sizeMap = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-lg'
  };
  
  const primarySizeMap = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-xl'
  };
  
  const secondarySizeMap = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };
  
  return (
    <motion.div 
      className={`${sizeMap[size || 'medium']} rounded-full flex items-center justify-center font-semibold relative shadow-md border-2 border-white`}
      style={{ backgroundColor: bgColor }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className={`${primarySizeMap[size || 'medium']} text-gray-700 leading-none`}>
        {firstName[0]}
      </span>
      <span className={`${secondarySizeMap[size || 'medium']} text-gray-500 absolute bottom-1 right-1 leading-none`}>
        {lastName[0]}
      </span>
    </motion.div>
  );
};

export const AvatarNode = ({ firstName, lastName, photoUrl, size = 'medium', className = '' }: AvatarNodeProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const sizeMap = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };
  
  if (!photoUrl || hasError) {
    return <InitialsAvatar firstName={firstName} lastName={lastName} size={size} />;
  }
  
  return (
    <div className={`relative ${className}`}>
      {isLoading && <SkeletonAvatar size={size} />}
      <motion.img 
        src={photoUrl} 
        alt={`${firstName} ${lastName}`}
        className={`${sizeMap[size]} rounded-full object-cover border-2 border-white shadow-md ${
          isLoading ? 'hidden' : ''
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}; 