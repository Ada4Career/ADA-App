'use client';

import React from 'react';

interface AdaCoinProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12', 
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};

export const AdaCoin: React.FC<AdaCoinProps> = ({ 
  size = 'md', 
  className = '', 
  animated = false 
}) => {
  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${className} 
        ${animated ? 'animate-spin' : ''}
        relative flex items-center justify-center
      `}
    >
      {/* Outer coin ring with gradient */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 shadow-lg">
        {/* Inner shadow ring */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500">
          {/* Core coin surface */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 flex items-center justify-center">
            {/* ADA Logo in center */}
            <div className="text-amber-800 font-bold text-xs flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3/5 h-3/5"
              >
                {/* Simple ADA letter design */}
                <path d="M3 21h18l-9-18-9 18zm9-13.5L17.25 19H5.75L12 7.5z" opacity="0.9"/>
                <path d="M9 17h6l-3-6-3 6z" fill="currentColor"/>
                <circle cx="12" cy="4.5" r="1" fill="currentColor"/>
              </svg>
            </div>
            
            {/* Shine effect */}
            <div className="absolute top-1 left-1 w-2/5 h-2/5 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-sm"></div>
          </div>
        </div>
      </div>
      
      {/* Outer glow for extra attractiveness */}
      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-400/20 to-amber-500/20 blur-md"></div>
    </div>
  );
};

export default AdaCoin;