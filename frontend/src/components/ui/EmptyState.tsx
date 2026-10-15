import React from 'react';
import { cn } from '../../lib/utils';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
  compact = false,
}) => (
  <div className={cn('flex flex-col items-center text-center', compact ? 'px-4 py-10' : 'px-6 py-16', className)}>
    {icon && (
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-fg-muted [&>svg]:h-6 [&>svg]:w-6">
        {icon}
      </div>
    )}
    <h3 className="text-base font-semibold text-fg">{title}</h3>
    {description && <p className="mt-1.5 max-w-md text-sm leading-relaxed text-fg-muted">{description}</p>}
    {action && <div className="mt-5 flex flex-wrap justify-center gap-2">{action}</div>}
  </div>
);

export default EmptyState;
