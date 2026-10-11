import React from 'react';

export type ButtonVariant = 
  | 'primary'          // Storefront Warm Orange (#FF7A50)
  | 'secondary'        // Storefront Soft Peach
  | 'admin-primary'    // Admin Themed Deep Blue (#2196F3)
  | 'admin-secondary'  // Admin Light Sky Blue (#87CEEB)
  | 'admin-accent'     // Admin Saffron Orange (#FF9800)
  | 'outline'          // Border with transparent bg
  | 'ghost'            // Text only on hover
  | 'danger';          // Rose / Red

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Base classes with accessible focus ring
  const baseClasses = 'inline-flex items-center justify-center font-bold transition-all active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  // Variant classes
  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-[#FF7A50] hover:bg-[#E05E34] text-white shadow-xs focus-visible:ring-[#FF7A50]',
    secondary: 'bg-[#FFF7F5] hover:bg-[#FFEFEA] text-[#FF7A50] border border-[#FF7A50]/20 focus-visible:ring-[#FF7A50]',
    'admin-primary': 'bg-[#2196F3] hover:bg-[#1976D2] active:bg-[#0D47A1] text-white shadow-xs focus-visible:ring-[#2196F3]',
    'admin-secondary': 'bg-[#E3F2FD] hover:bg-[#BBDEFB] text-[#1976D2] border border-[#87CEEB] focus-visible:ring-[#2196F3]',
    'admin-accent': 'bg-[#FF9800] hover:bg-[#F57C00] text-slate-950 font-black shadow-xs focus-visible:ring-[#FF9800]',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400',
    ghost: 'text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white focus-visible:ring-rose-500',
  };

  // Size classes
  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5 min-h-[36px]',
    md: 'px-4 py-2.5 text-xs sm:text-sm rounded-xl gap-2 min-h-[44px]',
    lg: 'px-6 py-3.5 text-sm sm:text-base rounded-2xl gap-2.5 min-h-[50px]',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
