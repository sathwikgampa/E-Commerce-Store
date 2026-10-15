import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

// Displays a product's stored rating. Renders nothing when there is no rating,
// so unrated items never show invented scores.

export interface RatingStarsProps {
  rating: number;
  size?: 'sm' | 'md';
  showValue?: boolean;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({ rating, size = 'sm', showValue = true, className = '' }) => {
  if (!rating || rating <= 0) return null;
  const icon = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const rounded = Math.round(rating * 2) / 2;

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className="inline-flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i + 1 <= rounded;
          const half = !filled && i + 0.5 === rounded;
          return (
            <span key={i} className="relative inline-block">
              <Star className={cn(icon, 'text-[#E3D5CB]')} fill="currentColor" strokeWidth={0} />
              {(filled || half) && (
                <span className="absolute inset-0 overflow-hidden" style={{ width: half ? '50%' : '100%' }}>
                  <Star className={cn(icon, 'text-amber-500')} fill="currentColor" strokeWidth={0} />
                </span>
              )}
            </span>
          );
        })}
      </span>
      <span className="sr-only">Rated {rating.toFixed(1)} out of 5</span>
      {showValue && (
        <span aria-hidden="true" className={cn('font-medium tabular text-fg', size === 'sm' ? 'text-xs' : 'text-sm')}>
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  );
};

export default RatingStars;
