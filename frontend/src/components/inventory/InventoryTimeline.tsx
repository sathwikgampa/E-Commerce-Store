import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import type { InventoryTransaction } from '../../types/inventory';

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

const InventoryTimeline: React.FC<InventoryTimelineProps> = ({
  transactions,
  maxItems = 15,
}) => {
  const items = transactions.slice(0, maxItems);

  if (items.length === 0) {
    return (
      <div className="py-10 text-center text-xs text-slate-400 font-semibold">
        No stock activity recorded yet.
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-100" />

      <div className="space-y-0">
        {items.map((txn, i) => {
          const isIn = txn.type === 'IN';
          return (
            <motion.div
              key={txn.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="relative flex gap-4 pl-12 py-3 group"
            >
              {/* Icon on line */}
              <div
                className={`absolute left-2.5 top-3.5 w-5 h-5 rounded-full flex items-center justify-center border-2 bg-white z-10 ${
                  isIn ? 'border-emerald-400' : 'border-rose-400'
                }`}
              >
                {isIn ? (
                  <ArrowUpCircle className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <ArrowDownCircle className="w-3.5 h-3.5 text-rose-500" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate leading-tight">
                      <span className={`font-black ${isIn ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isIn ? `+${txn.quantity}` : `-${txn.quantity}`}
                      </span>{' '}
                      {txn.productTitle}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5 leading-tight">
                      {txn.reason ?? (isIn ? 'Stock added' : 'Stock removed')}
                      {txn.handledBy && ` · ${txn.handledBy}`}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold shrink-0 whitespace-nowrap">
                    {formatRelativeTime(txn.timestamp)}
                  </span>
                </div>

                {/* Mini stock indicator */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    Stock: {txn.previousStock} → {txn.currentStock}
                  </span>
                  {txn.supplier && (
                    <>
                      <span className="text-slate-200">·</span>
                      <span className="text-[9px] font-bold text-slate-400 truncate max-w-[120px]">
                        {txn.supplier}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default InventoryTimeline;
