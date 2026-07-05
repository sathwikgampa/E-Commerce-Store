import React from 'react';
import type { TransactionType, StockStatus } from '../../types/inventory';

// ─── Stock Transaction Badge (IN / OUT) ──────────────────────────────────────

interface StockBadgeProps {
  type: TransactionType;
  quantity?: number;
  className?: string;
}

export const StockBadge: React.FC<StockBadgeProps> = ({ type, quantity, className = '' }) => {
  const isIn = type === 'IN';
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
        isIn
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          : 'bg-rose-50 text-rose-700 border border-rose-200'
      } ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isIn ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      {isIn ? '↑ IN' : '↓ OUT'}
      {quantity !== undefined && (
        <span className="ml-0.5 font-bold">{quantity}</span>
      )}
    </span>
  );
};

// ─── Inventory Status Badge ───────────────────────────────────────────────────

interface StatusBadgeProps {
  status: StockStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const colors: Record<StockStatus, string> = {
    'In Stock':     'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Low Stock':    'bg-amber-50 text-amber-700 border-amber-200',
    'Out of Stock': 'bg-rose-50 text-rose-700 border-rose-200',
  };
  const dots: Record<StockStatus, string> = {
    'In Stock':     'bg-emerald-500',
    'Low Stock':    'bg-amber-500',
    'Out of Stock': 'bg-rose-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${colors[status]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dots[status]}`} />
      {status}
    </span>
  );
};
