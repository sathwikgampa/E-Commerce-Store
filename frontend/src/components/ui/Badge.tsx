import React from 'react';
import { cn } from '../../lib/utils';

export type BadgeVariant =
  | 'neutral'      // Ordinary metadata
  | 'success'      // In stock, delivered, healthy
  | 'warning'      // Attention needed, low stock, pending
  | 'danger'       // Out of stock, critical
  | 'info'         // Navy informational
  | 'ember'        // Storefront highlight (discounts, store specials)
  | 'saffron'      // Portal highlight
  // Legacy names kept for compatibility
  | 'warm'
  | 'peach'
  | 'admin-blue'
  | 'emerald'
  | 'rose'
  | 'slate';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  pill?: boolean;
  dot?: boolean;
}

const styles: Record<BadgeVariant, { box: string; dot: string }> = {
  neutral: { box: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' },
  success: { box: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-600' },
  warning: { box: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' },
  danger: { box: 'bg-rose-50 text-rose-800 border-rose-200', dot: 'bg-rose-600' },
  info: { box: 'bg-navy-soft text-navy border-navy-line', dot: 'bg-navy' },
  ember: { box: 'bg-store-primary-subtle text-store-primary-dark border-store-coral-soft', dot: 'bg-store-coral' },
  saffron: { box: 'bg-saffron-soft text-saffron-ink border-[#FFE0B2]', dot: 'bg-saffron' },
  warm: { box: 'bg-store-primary-subtle text-store-primary-dark border-store-coral-soft', dot: 'bg-store-coral' },
  peach: { box: 'bg-store-accent text-store-charcoal-light border-store-line', dot: 'bg-store-coral' },
  'admin-blue': { box: 'bg-navy-soft text-navy border-navy-line', dot: 'bg-navy' },
  emerald: { box: 'bg-emerald-50 text-emerald-800 border-emerald-200', dot: 'bg-emerald-600' },
  rose: { box: 'bg-rose-50 text-rose-800 border-rose-200', dot: 'bg-rose-600' },
  slate: { box: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' },
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  pill = false,
  dot = false,
  children,
  className = '',
  ...props
}) => {
  const current = styles[variant];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border px-2 py-0.5 text-[11px] font-semibold leading-4 whitespace-nowrap',
        pill ? 'rounded-full' : 'rounded-md',
        current.box,
        className
      )}
      {...props}
    >
      {dot && <span aria-hidden="true" className={cn('h-1.5 w-1.5 shrink-0 rounded-full', current.dot)} />}
      {children}
    </span>
  );
};

export default Badge;
