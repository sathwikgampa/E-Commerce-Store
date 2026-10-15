import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Search, X } from 'lucide-react';
import { Product } from '../../types';
import { POPULAR_SEARCHES, catalogPath, focusRing, formatPrice, matchesQuery } from './landingData';

interface LandingSearchProps {
  products: Product[];
}

// Search with live suggestions; submitting hands off to the catalog's existing ?search= filter
const LandingSearch = forwardRef<HTMLInputElement, LandingSearchProps>(({ products }, inputRef) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(
    () => (query.trim().length > 1 ? products.filter((p) => matchesQuery(p, query)).slice(0, 5) : []),
    [products, query]
  );

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = query.trim();
    navigate(term ? catalogPath({ search: term }) : '/books');
  };

  const showPanel = open && query.trim().length > 1;

  return (
    <div className="w-full">
      <div ref={containerRef} className="relative" onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
        <form role="search" onSubmit={handleSubmit}>
          <label htmlFor="landing-search" className="sr-only">
            Search books and stationery
          </label>
          <div className="flex h-14 items-center rounded-full border border-line bg-white pl-5 pr-1.5 transition-shadow focus-within:border-ink-muted focus-within:shadow-[0_0_0_4px_rgba(185,78,23,0.12)]">
            <Search className="h-5 w-5 shrink-0 text-ink-muted" strokeWidth={1.75} aria-hidden="true" />
            <input
              ref={inputRef}
              id="landing-search"
              type="search"
              autoComplete="off"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              placeholder="Title, author, publisher or ISBN"
              aria-controls="landing-search-suggestions"
              aria-expanded={showPanel}
              className="h-full min-w-0 flex-1 bg-transparent px-3 text-[15px] text-ink placeholder:text-ink-muted focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className={`mr-1 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-muted hover:text-ink ${focusRing}`}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              className={`h-11 shrink-0 rounded-full bg-ink px-5 text-[14px] font-medium text-white transition-colors hover:bg-ink-soft ${focusRing}`}
            >
              Search
            </button>
          </div>
        </form>

        {showPanel && (
          <div
            id="landing-search-suggestions"
            className="absolute inset-x-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-line bg-white text-left shadow-[0_18px_40px_-18px_rgba(23,23,23,0.25)]"
          >
            {suggestions.length > 0 ? (
              <>
                <ul>
                  {suggestions.map((p) => (
                    <li key={p._id}>
                      <Link
                        to={`/book/${p._id}`}
                        className={`flex items-center gap-4 px-4 py-3 transition-colors hover:bg-paper ${focusRing} focus-visible:-outline-offset-2`}
                      >
                        <img
                          src={p.image}
                          alt=""
                          width={44}
                          height={44}
                          className="h-11 w-11 shrink-0 rounded-md bg-paper-deep object-cover"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[14px] font-medium text-ink">{p.title}</span>
                          <span className="block truncate text-[13px] text-ink-muted">{p.author}</span>
                        </span>
                        <span className="text-[14px] font-medium text-ink">{formatPrice(p.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  to={catalogPath({ search: query.trim() })}
                  className={`flex items-center justify-between border-t border-line px-4 py-3 text-[14px] font-medium text-ember hover:bg-paper ${focusRing} focus-visible:-outline-offset-2`}
                >
                  See all results for “{query.trim()}”
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            ) : (
              <p className="px-4 py-5 text-[14px] text-ink-muted">
                Nothing matches “{query.trim()}”. Try a publisher such as NCERT or VGS, or call the store to ask about a
                title.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-1 gap-y-2 px-1 text-[14px]">
        <span className="mr-2 text-ink-muted">Popular:</span>
        {POPULAR_SEARCHES.map((term) => (
          <Link
            key={term}
            to={catalogPath({ search: term })}
            className={`rounded-full px-3 py-1.5 text-ink-soft transition-colors hover:bg-paper-deep hover:text-ink ${focusRing}`}
          >
            {term}
          </Link>
        ))}
      </div>
    </div>
  );
});

LandingSearch.displayName = 'LandingSearch';

export default LandingSearch;
