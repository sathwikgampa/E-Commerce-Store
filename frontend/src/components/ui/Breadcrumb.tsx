import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => (
  <nav aria-label="Breadcrumb" className={cn('min-w-0 text-[13px] text-fg-muted', className)}>
    <ol className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-1">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <li key={`${item.label}-${idx}`} className={cn('flex min-w-0 items-center gap-1.5', isLast && 'flex-1')}>
            {idx > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden="true" />}
            {item.icon && <span className="shrink-0">{item.icon}</span>}
            {isLast || !item.href ? (
              <span
                className={cn('truncate', isLast && 'font-medium text-fg max-w-[16rem] sm:max-w-md')}
                aria-current={isLast ? 'page' : undefined}
                title={item.label}
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="shrink-0 rounded-sm underline-offset-4 transition-colors hover:text-action hover:underline"
              >
                {item.label}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default Breadcrumb;
