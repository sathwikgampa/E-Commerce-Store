import React from 'react';
import { cn } from '../../lib/utils';

// Container primitives. Not every section needs a card — use these for
// grouped, bordered content (summaries, forms, data panels).

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  aspect16x9?: boolean;
  glass?: boolean;
  hoverable?: boolean;
  as?: 'div' | 'section' | 'article' | 'aside';
}

export const Card: React.FC<CardProps> = ({
  aspect16x9 = false,
  glass = false,
  hoverable = false,
  as: Tag = 'div',
  children,
  className = '',
  ...props
}) => (
  <Tag
    className={cn(
      'rounded-xl border border-surface-line',
      glass ? 'bg-white/85 backdrop-blur-md' : 'bg-white',
      hoverable && 'transition-colors hover:border-fg-muted/40',
      aspect16x9 && 'aspect-[16/9]',
      className
    )}
    {...props}
  >
    {children}
  </Tag>
);

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  description,
  actions,
  children,
  className = '',
  ...props
}) => (
  <div
    className={cn('flex flex-wrap items-start justify-between gap-3 border-b border-surface-line px-5 py-4', className)}
    {...props}
  >
    {title || description ? (
      <div className="min-w-0">
        {title && <h2 className="text-[15px] font-semibold tracking-tight text-fg">{title}</h2>}
        {description && <p className="mt-0.5 text-xs text-fg-muted">{description}</p>}
      </div>
    ) : null}
    {children}
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export const CardBody: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={cn('p-5', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={cn('flex items-center justify-between gap-3 border-t border-surface-line px-5 py-4', className)} {...props}>
    {children}
  </div>
);

export default Card;
