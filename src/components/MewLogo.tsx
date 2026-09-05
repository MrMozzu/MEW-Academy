import React from 'react';

interface MewLogoProps {
  variant?: 'full' | 'horizontal' | 'emblem' | 'compact' | 'badge';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  theme?: 'light' | 'dark' | 'on-dark';
  className?: string;
  showMotto?: boolean;
}

export const MewLogo: React.FC<MewLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  theme = 'light',
  className = '',
  showMotto = true
}) => {
  const isDarkBg = theme === 'on-dark' || theme === 'dark';

  const imgSizes = {
    xs: 'h-8 sm:h-9 w-auto max-h-9',
    sm: 'h-10 sm:h-12 w-auto max-h-12',
    md: 'h-13 sm:h-15 w-auto max-h-15',
    lg: 'h-15 sm:h-18 w-auto max-h-18',
    xl: 'h-24 sm:h-30 w-auto max-h-30',
    '2xl': 'h-36 sm:h-48 w-auto max-h-48'
  };

  const titleSizes = {
    xs: 'text-base sm:text-lg',
    sm: 'text-lg sm:text-xl',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
    '2xl': 'text-4xl sm:text-5xl'
  };

  const mottoSizes = {
    xs: 'text-[7.5px] sm:text-[8px]',
    sm: 'text-[8.5px] sm:text-[9.5px]',
    md: 'text-[9.5px] sm:text-[11px]',
    lg: 'text-[11px] sm:text-[12.5px]',
    xl: 'text-[13px] sm:text-sm',
    '2xl': 'text-base'
  };

  if (variant === 'emblem') {
    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        <img
          src="/mew-logo.png"
          alt="MEW Academy"
          className={`${imgSizes[size]} object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)] transition-transform duration-200 hover:scale-105`}
          loading="eager"
          decoding="sync"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3.5 select-none ${className}`}>
      {/* 3D Logo on Left */}
      <img
        src="/mew-logo.png"
        alt="MEW Academy"
        className={`${imgSizes[size]} object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)] flex-shrink-0 transition-transform duration-200 hover:scale-105`}
        loading="eager"
        decoding="sync"
      />

      {/* MEW Academy Written Beside Logo on Right */}
      <div className="flex flex-col justify-center text-left leading-none">
        <div className="flex items-center gap-1.5 sm:gap-2 leading-none">
          <span className={`font-black tracking-tight ${titleSizes[size]} text-[#d97706]`}>
            MEW
          </span>
          <span 
            className={`font-serif font-black tracking-wider ${titleSizes[size]} ${
              isDarkBg ? 'text-white' : 'text-[#06142a]'
            }`}
          >
            Academy
          </span>
        </div>

        {showMotto && (
          <div className={`flex items-center gap-1 sm:gap-1.5 font-black tracking-widest mt-1 leading-none uppercase ${mottoSizes[size]}`}>
            <span className="text-[#d97706]">MAKE</span>
            <span className="w-1 h-1 rounded-full bg-[#d97706]" />
            <span className="text-[#0284c7]">EXPLORE</span>
            <span className="w-1 h-1 rounded-full bg-[#d97706]" />
            <span className="text-[#9333ea]">WIN</span>
          </div>
        )}
      </div>
    </div>
  );
};
