import React from 'react';

export type BadgeVariant = 
  | 'warm'         // Storefront Warm Orange
  | 'peach'        // Soft Peach
  | 'admin-blue'   // Admin Themed Deep Blue
  | 'saffron'      // Admin Saffron Accent
  | 'emerald'      // Success / In stock
  | 'rose'         // Out of stock / Alert
  | 'slate';       // Neutral grey

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  pill?: boolean;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'warm',
  pill = true,
  dot = false,
  children,
  className = '',
  ...props
}) => {
  const variantClasses: Record<BadgeVariant, { bg: string; text: string; border: string; dotColor: string }> = {
    warm: {
      bg: 'bg-[#FFF0EB]',
      text: 'text-[#E05E34]',
      border: 'border-[#FF7A50]/20',
      dotColor: 'bg-[#FF7A50]',
    },
    peach: {
      bg: 'bg-[#FFF7F5]',
      text: 'text-[#FF7A50]',
      border: 'border-[#FFEFEA]',
      dotColor: 'bg-[#FF7A50]',
    },
    'admin-blue': {
      bg: 'bg-[#E3F2FD]',
      text: 'text-[#1976D2]',
      border: 'border-[#87CEEB]',
      dotColor: 'bg-[#2196F3]',
    },
    saffron: {
      bg: 'bg-[#FFF3E0]',
      text: 'text-[#E65100]',
      border: 'border-[#FFE0B2]',
      dotColor: 'bg-[#FF9800]',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dotColor: 'bg-emerald-500',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dotColor: 'bg-rose-500',
    },
    slate: {
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      dotColor: 'bg-slate-400',
    },
  };

  const current = variantClasses[variant];
  const radius = pill ? 'rounded-full' : 'rounded-md';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider border ${current.bg} ${current.text} ${current.border} ${radius} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${current.dotColor} shrink-0`}></span>}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
