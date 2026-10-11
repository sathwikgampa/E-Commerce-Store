import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  wrapperClassName?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onClear,
  onChange,
  placeholder = 'Search catalog materials...',
  className = '',
  wrapperClassName = '',
  ...props
}) => {
  const hasValue = Boolean(value && String(value).length > 0);

  return (
    <div className={`relative flex items-center bg-slate-100 hover:bg-slate-200/60 focus-within:bg-white focus-within:ring-2 focus-within:ring-store-primary/40 focus-within:border-store-primary border border-slate-200 rounded-full px-3.5 py-2 transition-all ${wrapperClassName}`}>
      <Search className="w-4 h-4 text-slate-400 shrink-0" />
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`bg-transparent border-none focus:outline-none text-xs w-full pl-2 pr-1 font-medium text-slate-800 placeholder:text-slate-400 ${className}`}
        {...props}
      />
      {hasValue && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full transition-colors"
          aria-label="Clear search input"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
