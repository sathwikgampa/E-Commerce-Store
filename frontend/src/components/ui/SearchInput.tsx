import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../lib/utils';

// Presentational search field. Filtering/debouncing stays with the caller.

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  onClear?: () => void;
  wrapperClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

const heights = { sm: 'h-9 text-[13px]', md: 'h-11 text-sm', lg: 'h-12 text-[15px]' };

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value,
      onClear,
      onChange,
      placeholder = 'Search…',
      className = '',
      wrapperClassName = '',
      size = 'md',
      ...props
    },
    ref
  ) => {
    const hasValue = Boolean(value && String(value).length > 0);
    return (
      <div
        className={cn(
          'relative flex items-center rounded-lg border border-surface-line bg-white transition-colors',
          'focus-within:border-action focus-within:ring-2 focus-within:ring-action/15',
          heights[size],
          wrapperClassName
        )}
      >
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-fg-muted" aria-hidden="true" />
        <input
          ref={ref}
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            'h-full w-full rounded-lg bg-transparent pl-9 pr-9 text-fg placeholder:text-fg-muted/80 focus:outline-none',
            '[&::-webkit-search-cancel-button]:hidden',
            className
          )}
          {...props}
        />
        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-1 inline-flex h-8 w-8 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-surface-muted hover:text-fg"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';

export default SearchInput;
