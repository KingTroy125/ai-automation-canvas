
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassMorphismProps {
  className?: string;
  children: React.ReactNode;
  intensity?: 'light' | 'medium' | 'heavy';
  borderColor?: string;
  dark?: boolean;
}

const GlassMorphism: React.FC<GlassMorphismProps> = ({
  className,
  children,
  intensity = 'medium',
  borderColor = 'border-white/20',
  dark = false,
}) => {
  const blurIntensity = {
    light: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    heavy: 'backdrop-blur-lg',
  };

  const bgColor = dark 
    ? 'bg-black/10' 
    : 'bg-white/10';

  return (
    <div
      className={cn(
        'rounded-xl shadow-sm',
        bgColor,
        blurIntensity[intensity],
        borderColor,
        'border',
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassMorphism;
