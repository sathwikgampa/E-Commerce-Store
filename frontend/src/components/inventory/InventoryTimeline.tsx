import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { InventoryTransaction } from '../../types/inventory';
import { cn } from '../../lib/utils';

interface InventoryTimelineProps {
  transactions: InventoryTransaction[];
  maxItems?: number;
}

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

const InventoryTimeline: React.FC<InventoryTimelineProps> = ({ transactions, maxItems = 15 }) => {
  const items = transactions.slice(0, maxItems);

  if (items.length === 0) {
    return <p className="px-2 py-8 text-center text-[13px] text-slate-500">No stock activity recorded yet.</p>;
  }

  return (
    <ol className="relative">
      <span aria-hidden="true" className="absolute bottom-3 left-[15px] top-3 w-px bg-admin-line" />
      {items.map((txn) => {
        const isIn = txn.type === 'IN';
        const Icon = isIn ? ArrowUpRight : ArrowDownRight;
        return (
          <li key={txn.id} className="relative flex gap-3 py-2.5 pl-1">
            <span
              className={cn(
                'relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-4 ring-white',
                isIn ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">{isIn ? 'Stock in' : 'Stock out'}</span>
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-[13px] text-slate-900">
                  <span className={cn('font-semibold tabular', isIn ? 'text-emerald-700' : 'text-rose-700')}>
                    {isIn ? `+${txn.quantity}` : `−${txn.quantity}`}
                  </span>{' '}
                  {txn.productTitle}
                </p>
                <time dateTime={txn.timestamp} className="shrink-0 text-[12px] text-slate-500">
                  {formatRelativeTime(txn.timestamp)}
                </time>
              </div>
              <p className="truncate text-[12px] text-slate-500">
                {txn.reason ?? (isIn ? 'Stock received' : 'Stock removed')}
                {txn.supplier && ` · ${txn.supplier}`} · {txn.previousStock} → {txn.currentStock}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default InventoryTimeline;
