import React from 'react';

export const OrnamentalDivider = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center justify-center w-full my-8 ${className}`}>
    <div className="flex-grow border-t border-[var(--color-secondary)] opacity-50 h-[1px]"></div>
    <div className="mx-4 text-[var(--color-secondary)]">
      <svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 0C20 0 25 10 35 10C25 10 20 20 20 20C20 20 15 10 5 10C15 10 20 0 20 0Z" fill="currentColor"/>
        <circle cx="20" cy="10" r="3" fill="var(--color-bg)"/>
        <circle cx="20" cy="10" r="1.5" fill="currentColor"/>
      </svg>
    </div>
    <div className="flex-grow border-t border-[var(--color-secondary)] opacity-50 h-[1px]"></div>
  </div>
);

export const CornerMotif = ({ 
  position = 'top-left', 
  size = 80,
  className = ''
}: { 
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  size?: number;
  className?: string;
}) => {
  const rotation = {
    'top-left': 'rotate-0',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': '-rotate-90'
  }[position];

  const posClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0'
  }[position];

  return (
    <div 
      className={`absolute ${posClasses} text-[var(--color-secondary)] ${rotation} pointer-events-none ${className}`} 
      style={{ width: `min(${size}px, 15vw)`, height: `min(${size}px, 15vw)` }}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-70">
        <path d="M0 0V20C30 20 50 40 50 70H70C70 30 30 0 0 0Z" fill="currentColor"/>
        <path d="M10 30C25 30 35 45 35 60H45C45 35 25 20 10 20V30Z" fill="currentColor"/>
        <circle cx="15" cy="15" r="4" fill="currentColor"/>
        <circle cx="60" cy="80" r="3" fill="currentColor"/>
        <circle cx="80" cy="60" r="3" fill="currentColor"/>
      </svg>
    </div>
  );
};

export const FloralBorder = ({ className = '' }: { className?: string }) => (
  <div className={`w-full overflow-hidden flex justify-center text-[var(--color-secondary)] opacity-60 ${className}`}>
    <svg width="100%" height="15" viewBox="0 0 100 15" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <pattern id="floralPattern" x="0" y="0" width="30" height="15" patternUnits="userSpaceOnUse">
        <path d="M15 2C17 7 22 7 28 7C22 7 17 12 15 14C13 12 8 7 2 7C8 7 13 7 15 2Z" stroke="currentColor" strokeWidth="0.5" fill="none"/>
        <circle cx="15" cy="8" r="1.5" fill="currentColor"/>
      </pattern>
      <rect x="0" y="0" width="100%" height="15" fill="url(#floralPattern)"/>
    </svg>
  </div>
);

export const Monogram = ({ text, size = 80, className = '' }: { text: string; size?: number; className?: string }) => (
  <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full text-[var(--color-secondary)]" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1" fill="none"/>
      <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="2 4"/>
      <path d="M50 4C55 15 65 20 75 22" stroke="currentColor" strokeWidth="0.5" fill="none"/>
      <path d="M50 96C45 85 35 80 25 78" stroke="currentColor" strokeWidth="0.5" fill="none"/>
      <path d="M4 50C15 45 20 35 22 25" stroke="currentColor" strokeWidth="0.5" fill="none"/>
      <path d="M96 50C85 55 80 65 78 75" stroke="currentColor" strokeWidth="0.5" fill="none"/>
    </svg>
    <span className="font-script text-[var(--color-secondary)] relative z-10" style={{ fontSize: size * 0.35, lineHeight: 1 }}>
      {text}
    </span>
  </div>
);
