import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  label = 'Quantity',
  size = 'md',
  className = '',
}) => {
  const btn = size === 'sm' ? 'h-9 w-9' : 'h-11 w-11';
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('inline-flex items-center rounded-lg border border-surface-line bg-white', className)}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn(btn, 'inline-flex items-center justify-center rounded-l-lg text-fg transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40')}
        aria-label={`Decrease ${label.toLowerCase()}`}
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <output aria-live="polite" className="min-w-[2.25rem] text-center text-sm font-semibold tabular text-fg">
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(btn, 'inline-flex items-center justify-center rounded-r-lg text-fg transition-colors hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-40')}
        aria-label={`Increase ${label.toLowerCase()}`}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};

export default QuantityStepper;
