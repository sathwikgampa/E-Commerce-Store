import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { TransactionType, StockStatus } from '../../types/inventory';
import { Badge } from '../ui/Badge';

// ─── Stock Transaction Badge (IN / OUT) ──────────────────────────────────────

interface StockBadgeProps {
  type: TransactionType;
  quantity?: number;
  className?: string;
}

export const StockBadge: React.FC<StockBadgeProps> = ({ type, quantity, className = '' }) => {
  const isIn = type === 'IN';
  const Icon = isIn ? ArrowUpRight : ArrowDownRight;
  return (
    <Badge variant={isIn ? 'success' : 'danger'} className={className}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {isIn ? 'In' : 'Out'}
      {quantity !== undefined && <span className="tabular">{isIn ? `+${quantity}` : `−${quantity}`}</span>}
    </Badge>
  );
};

// ─── Inventory Status Badge ───────────────────────────────────────────────────

interface StatusBadgeProps {
  status: StockStatus;
  className?: string;
}

const STATUS_VARIANT: Record<StockStatus, 'success' | 'warning' | 'danger'> = {
  'In Stock': 'success',
  'Low Stock': 'warning',
  'Out of Stock': 'danger',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => (
  <Badge variant={STATUS_VARIANT[status]} dot className={className}>
    {status}
  </Badge>
);
