
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGradientProps {
  className?: string;
  children?: React.ReactNode;
  width?: string;
  height?: string;
  gradientColors?: string;
}

const AnimatedGradient: React.FC<AnimatedGradientProps> = ({
  className,
  children,
  width = "100%",
  height = "100%",
  gradientColors = "from-blue-400 via-purple-500 to-pink-500"
}) => {
  return (
    <div className={cn("relative overflow-hidden", className)} style={{ width, height }}>
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-r animate-gradient-shift bg-[length:200%_200%]",
          gradientColors
        )}
      />
      {children && (
        <div className="relative z-10 h-full">
          {children}
        </div>
      )}
    </div>
  );
};

export default AnimatedGradient;
