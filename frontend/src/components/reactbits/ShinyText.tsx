import React from 'react';
import { cn } from '../../lib/utils';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 6,
  className = '',
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={cn(
        "bg-clip-text text-transparent bg-[length:240%_100%] transition-all",
        !disabled 
          ? "animate-shiny-text bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" 
          : "text-slate-800",
        className
      )}
      style={{
        animationDuration: animationDuration,
        display: 'inline-block',
      }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
