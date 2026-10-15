import React from 'react';
import { cn } from '../../lib/utils';

export type ButtonVariant =
  | 'primary'          // Experience action color (ember on storefront, navy in portal/admin)
  | 'secondary'        // White surface with hairline border
  | 'dark'             // Charcoal fill — strong neutral action
  | 'admin-primary'    // Navy, regardless of scope
  | 'admin-secondary'  // White with navy text
  | 'admin-accent'     // Saffron fill with dark text (portal highlights)
  | 'outline'          // Transparent with border
  | 'ghost'            // Text only, tinted on hover
  | 'danger';          // Destructive

export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

const base =
  'inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap select-none transition-colors duration-150 ' +
  'disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-action text-white hover:bg-action-hover focus-visible:outline-action',
  secondary:
    'bg-white text-fg border border-surface-line hover:bg-surface-muted focus-visible:outline-action',
  dark: 'bg-store-charcoal text-white hover:bg-black focus-visible:outline-store-charcoal',
  'admin-primary': 'bg-navy text-white hover:bg-navy-dark focus-visible:outline-navy',
  'admin-secondary':
    'bg-white text-navy border border-admin-line hover:bg-navy-soft focus-visible:outline-navy',
  'admin-accent': 'bg-saffron text-[#1F1300] hover:bg-[#F08A00] focus-visible:outline-saffron-ink',
  outline:
    'bg-transparent text-fg border border-surface-line hover:bg-surface-muted focus-visible:outline-action',
  ghost: 'bg-transparent text-fg-muted hover:text-fg hover:bg-surface-muted focus-visible:outline-action',
  danger: 'bg-rose-700 text-white hover:bg-rose-800 focus-visible:outline-rose-700',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-xs rounded-md',
  md: 'h-11 px-4 text-sm rounded-lg',
  lg: 'h-12 px-6 text-[15px] rounded-lg',
  icon: 'h-11 w-11 rounded-lg',
};

// Exposed so <Link> and <a> can share button styling without nesting elements
export const buttonClasses = (
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  fullWidth = false,
  className = ''
) => cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Spinner: React.FC<{ className?: string; label?: string }> = ({ className = '', label }) => (
  <span role={label ? 'status' : undefined} className="inline-flex items-center">
    <span
      aria-hidden="true"
      className={cn('inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin', className)}
    />
    {label && <span className="sr-only">{label}</span>}
  </span>
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      icon,
      children,
      className = '',
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={buttonClasses(variant, size, fullWidth, className)}
      {...props}
    >
      {isLoading ? <Spinner /> : icon ? <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">{icon}</span> : null}
      {children}
    </button>
  )
);
Button.displayName = 'Button';

export default Button;
