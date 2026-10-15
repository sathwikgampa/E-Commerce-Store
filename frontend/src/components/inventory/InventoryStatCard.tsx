import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface InventoryStatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  trend?: { direction: 'up' | 'down' | 'neutral'; label: string };
  index?: number;
  onClick?: () => void;
  accent?: boolean;
}

// Compact KPI card for inventory screens. `trend` is a text note derived from real
// figures (e.g. "No activity today"), never a fabricated percentage.
const InventoryStatCard: React.FC<InventoryStatCardProps> = ({
  label,
  value,
  subValue,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
  onClick,
  accent = false,
}) => {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      {...(onClick ? { type: 'button' as const, onClick } : {})}
      className={cn(
        'flex w-full items-start justify-between gap-3 rounded-xl border bg-white p-4 text-left',
        accent ? 'border-navy-line' : 'border-admin-line',
        onClick && 'transition-colors hover:border-navy/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy'
      )}
    >
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-slate-600">{label}</p>
        <p className={cn('mt-1 text-[24px] font-semibold leading-tight tracking-tight tabular', accent ? 'text-navy' : 'text-slate-900')}>
          {value}
        </p>
        {subValue && <p className="mt-0.5 text-[12px] text-slate-500">{subValue}</p>}
        {trend && (
          <p
            className={cn(
              'mt-1 text-[12px] font-medium',
              trend.direction === 'up' ? 'text-emerald-700' : trend.direction === 'down' ? 'text-rose-700' : 'text-slate-500'
            )}
          >
            {trend.label}
          </p>
        )}
      </div>
      <span className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', iconBg)} aria-hidden="true">
        <Icon className={cn('h-[18px] w-[18px]', iconColor)} />
      </span>
    </Tag>
  );
};

export default InventoryStatCard;
