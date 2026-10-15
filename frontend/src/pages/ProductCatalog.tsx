import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, Heart, LayoutGrid, List, SearchX, SlidersHorizontal, X } from 'lucide-react';
import { useProducts } from '../api/queries';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import useWishlistStore from '../store/wishlistStore';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { SearchInput } from '../components/ui/SearchInput';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { CATEGORY_NOTES, formatPrice } from '../components/landing/landingData';
import { cn } from '../lib/utils';

type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating-high' | 'title-az';
const PAGE_SIZE = 12;
const RATING_OPTIONS = [0, 3, 4, 4.5];

const ProductCatalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: products = [], isLoading, error } = useProducts();
  const wishlistItems = useWishlistStore((s) => s.items);

  // URL-backed filters (shareable / back-button friendly)
  const selectedCategory = searchParams.get('category') || 'All';
  const selectedSupplier = searchParams.get('supplier') || 'All';
  const showOnlyWishlist = searchParams.get('wishlist') === 'true';
  const urlSearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [selectedAuthor, setSelectedAuthor] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);

  const baseProducts = showOnlyWishlist ? wishlistItems : products;

  // Price ceiling derived from the actual catalog
  const priceCeiling = useMemo(() => {
    const max = Math.max(0, ...products.map((p) => p.price));
    return Math.max(100, Math.ceil(max / 100) * 100);
  }, [products]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const effectiveMax = maxPrice ?? priceCeiling;

  useEffect(() => setSearchTerm(urlSearch), [urlSearch]);
  useEffect(() => setPage(1), [searchParams, selectedAuthor, inStockOnly, minRating, maxPrice, sortBy]);

  // Lock scroll while the mobile filter drawer is open
  useEffect(() => {
    if (!filtersOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFiltersOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [filtersOpen]);

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'All') next.set(key, value);
    else next.delete(key);
    if (key === 'category' && value) next.delete('wishlist');
    setSearchParams(next, { replace: key === 'search' });
  };

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((p) => counts.set(p.category, (counts.get(p.category) || 0) + 1));
    return Array.from(counts.entries());
  }, [products]);

  const suppliers = useMemo(
    () => Array.from(new Set(products.map((p) => p.publisher).filter(Boolean) as string[])).sort(),
    [products]
  );
  const authors = useMemo(() => Array.from(new Set(products.map((p) => p.author))).sort(), [products]);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    return baseProducts.filter((p) => {
      const matchesSearch =
        !q ||
        [p.title, p.author, p.publisher, p.isbn, p.description, p.category]
          .filter(Boolean)
          .some((f) => (f as string).toLowerCase().includes(q));
      return (
        matchesSearch &&
        (selectedCategory === 'All' || p.category === selectedCategory) &&
        (selectedSupplier === 'All' || p.publisher === selectedSupplier) &&
        (selectedAuthor === 'All' || p.author === selectedAuthor) &&
        p.price <= effectiveMax &&
        (!inStockOnly || p.inStock) &&
        p.rating >= minRating
      );
    });
  }, [baseProducts, searchTerm, selectedCategory, selectedSupplier, selectedAuthor, effectiveMax, inStockOnly, minRating]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sortBy) {
      case 'price-low': return list.sort((a, b) => a.price - b.price);
      case 'price-high': return list.sort((a, b) => b.price - a.price);
      case 'rating-high': return list.sort((a, b) => b.rating - a.rating);
      case 'title-az': return list.sort((a, b) => a.title.localeCompare(b.title));
      default: return list;
    }
  }, [filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearAll = () => {
    setSearchTerm('');
    setSelectedAuthor('All');
    setInStockOnly(false);
    setMinRating(0);
    setMaxPrice(null);
    setSortBy('featured');
    setSearchParams(new URLSearchParams());
  };

  const chips: { label: string; onRemove: () => void }[] = [];
  if (showOnlyWishlist) chips.push({ label: 'Wishlist', onRemove: () => updateParam('wishlist', null) });
  if (urlSearch) chips.push({ label: `“${urlSearch}”`, onRemove: () => updateParam('search', null) });
  if (selectedCategory !== 'All') chips.push({ label: selectedCategory, onRemove: () => updateParam('category', null) });
  if (selectedSupplier !== 'All') chips.push({ label: selectedSupplier, onRemove: () => updateParam('supplier', null) });
  if (selectedAuthor !== 'All') chips.push({ label: selectedAuthor, onRemove: () => setSelectedAuthor('All') });
  if (inStockOnly) chips.push({ label: 'In stock', onRemove: () => setInStockOnly(false) });
  if (minRating > 0) chips.push({ label: `${minRating}★ & up`, onRemove: () => setMinRating(0) });
  if (maxPrice !== null && maxPrice < priceCeiling)
    chips.push({ label: `Up to ${formatPrice(maxPrice)}`, onRemove: () => setMaxPrice(null) });

  const heading = showOnlyWishlist
    ? 'Your wishlist'
    : selectedCategory !== 'All'
      ? selectedCategory
      : 'Books & stationery';
  const description = showOnlyWishlist
    ? `${wishlistItems.length} saved ${wishlistItems.length === 1 ? 'item' : 'items'}, kept on this device.`
    : CATEGORY_NOTES[selectedCategory] ||
      'Genuine textbooks, exam guides, notebooks and bags — available for pickup on Station Road, Kamareddy.';

  const radio = (active: boolean) =>
    cn(
      'flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-[14px] transition-colors',
      active ? 'bg-store-accent-dark font-medium text-store-charcoal' : 'text-store-charcoal-light hover:bg-store-accent hover:text-store-charcoal'
    );
  const groupTitle = 'text-[12px] font-semibold uppercase tracking-[0.12em] text-store-charcoal';

  const filterPanel = (
    <div className="space-y-7">
      <label className="flex cursor-pointer items-center justify-between gap-3 text-[14px] text-store-charcoal">
        In stock only
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="h-4 w-4 accent-store-primary"
        />
      </label>

      <fieldset>
        <legend className={groupTitle}>Category</legend>
        <ul className="mt-2.5 space-y-0.5">
          {[['All', products.length] as [string, number], ...categories].map(([cat, count]) => (
            <li key={cat}>
              <button
                type="button"
                aria-pressed={selectedCategory === cat}
                onClick={() => updateParam('category', cat)}
                className={radio(selectedCategory === cat)}
              >
                <span>{cat === 'All' ? 'All categories' : cat}</span>
                <span className="text-xs tabular opacity-70">{count}</span>
              </button>
            </li>
          ))}
        </ul>
      </fieldset>

      <div>
        <label htmlFor="filter-price" className="flex items-center justify-between">
          <span className={groupTitle}>Max price</span>
          <span className="text-[14px] font-medium tabular text-store-charcoal">{formatPrice(effectiveMax)}</span>
        </label>
        <input
          id="filter-price"
          type="range"
          min={50}
          max={priceCeiling}
          step={50}
          value={effectiveMax}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="mt-3 w-full cursor-pointer accent-store-primary"
        />
        <div className="mt-1 flex justify-between text-xs tabular text-store-charcoal-light">
          <span>₹50</span>
          <span>{formatPrice(priceCeiling)}</span>
        </div>
      </div>

      <fieldset>
        <legend className={groupTitle}>Customer rating</legend>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {RATING_OPTIONS.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={minRating === r}
              onClick={() => setMinRating(r)}
              className={cn(
                'h-9 rounded-md border px-3 text-[13px] font-medium transition-colors',
                minRating === r
                  ? 'border-store-charcoal bg-store-charcoal text-white'
                  : 'border-store-line bg-white text-store-charcoal hover:border-store-charcoal-light'
              )}
            >
              {r === 0 ? 'Any' : `${r}★ +`}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="filter-author" className={groupTitle}>Author / brand</label>
        <select
          id="filter-author"
          value={selectedAuthor}
          onChange={(e) => setSelectedAuthor(e.target.value)}
          className="mt-2.5 h-10 w-full rounded-lg border border-store-line bg-white px-2.5 text-[14px] text-store-charcoal focus:border-store-primary focus:outline-none focus:ring-2 focus:ring-store-primary/15"
        >
          <option value="All">All authors</option>
          {authors.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      {suppliers.length > 0 && (
        <div>
          <label htmlFor="filter-publisher" className={groupTitle}>Publisher</label>
          <select
            id="filter-publisher"
            value={selectedSupplier}
            onChange={(e) => updateParam('supplier', e.target.value)}
            className="mt-2.5 h-10 w-full rounded-lg border border-store-line bg-white px-2.5 text-[14px] text-store-charcoal focus:border-store-primary focus:outline-none focus:ring-2 focus:ring-store-primary/15"
          >
            <option value="All">All publishers</option>
            {suppliers.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}

      <button
        type="button"
        onClick={() => updateParam('wishlist', showOnlyWishlist ? null : 'true')}
        aria-pressed={showOnlyWishlist}
        className={cn(
          'flex h-11 w-full items-center justify-between rounded-lg border px-3.5 text-[14px] font-medium transition-colors',
          showOnlyWishlist ? 'border-store-primary bg-store-primary-subtle text-store-primary-dark' : 'border-store-line bg-white text-store-charcoal hover:bg-store-accent'
        )}
      >
        <span className="inline-flex items-center gap-2">
          <Heart className={cn('h-4 w-4', showOnlyWishlist && 'fill-current')} aria-hidden="true" /> Wishlist only
        </span>
        <span className="text-xs tabular">{wishlistItems.length}</span>
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-store px-5 pb-16 pt-6 sm:px-8 lg:px-12">
      <Breadcrumb items={[{ label: 'Home', href: '/home' }, { label: 'Shop', href: selectedCategory !== 'All' || showOnlyWishlist ? '/books' : undefined }, ...(selectedCategory !== 'All' ? [{ label: selectedCategory }] : showOnlyWishlist ? [{ label: 'Wishlist' }] : [])]} />

      <header className="mt-6 grid gap-6 border-b border-store-line pb-8 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-end">
        <div>
          <h1 className="text-balance font-serif text-[34px] font-semibold leading-[1.05] tracking-tight text-store-charcoal sm:text-[44px]">
            {heading}
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-store-charcoal-light">{description}</p>
        </div>
        <SearchInput
          size="lg"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            updateParam('search', e.target.value.trim() || null);
          }}
          onClear={() => {
            setSearchTerm('');
            updateParam('search', null);
          }}
          placeholder="Search title, author, publisher or ISBN"
          aria-label="Search the catalog"
        />
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[15rem_1fr] xl:grid-cols-[16rem_1fr]">
        {/* Desktop filters */}
        <aside aria-label="Filters" className="hidden lg:block">
          <div className="sticky top-28">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-sans text-[15px] font-semibold text-store-charcoal">Filters</h2>
              {chips.length > 0 && (
                <button type="button" onClick={clearAll} className="text-[13px] font-medium text-store-primary hover:underline">
                  Clear all
                </button>
              )}
            </div>
            {filterPanel}
          </div>
        </aside>

        <section aria-label="Products" className="min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="secondary" size="md" className="lg:hidden" onClick={() => setFiltersOpen(true)} aria-haspopup="dialog">
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filters{chips.length > 0 && ` (${chips.length})`}
            </Button>
            <p className="text-[14px] text-store-charcoal-light" aria-live="polite">
              <span className="font-semibold tabular text-store-charcoal">{sorted.length}</span> {sorted.length === 1 ? 'result' : 'results'}
            </p>
            <div className="ml-auto flex items-center gap-2">
              <label htmlFor="catalog-sort" className="sr-only">Sort by</label>
              <select
                id="catalog-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="h-10 rounded-lg border border-store-line bg-white px-2.5 text-[14px] text-store-charcoal focus:border-store-primary focus:outline-none focus:ring-2 focus:ring-store-primary/15"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="rating-high">Highest rated</option>
                <option value="title-az">Title A–Z</option>
              </select>
              <div role="group" aria-label="Layout" className="hidden rounded-lg border border-store-line bg-white p-0.5 sm:flex">
                {(['grid', 'list'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLayout(l)}
                    aria-pressed={layout === l}
                    aria-label={l === 'grid' ? 'Grid view' : 'List view'}
                    className={cn(
                      'inline-flex h-8 w-9 items-center justify-center rounded-md transition-colors',
                      layout === l ? 'bg-store-charcoal text-white' : 'text-store-charcoal-light hover:text-store-charcoal'
                    )}
                  >
                    {l === 'grid' ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {chips.length > 0 && (
            <ul className="mt-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
              {chips.map((chip) => (
                <li key={chip.label}>
                  <button
                    type="button"
                    onClick={chip.onRemove}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full border border-store-line bg-white pl-3 pr-2 text-[13px] text-store-charcoal hover:border-store-charcoal-light"
                    aria-label={`Remove filter ${chip.label}`}
                  >
                    {chip.label} <X className="h-3.5 w-3.5 text-store-charcoal-light" aria-hidden="true" />
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={clearAll} className="h-8 px-2 text-[13px] font-medium text-store-primary hover:underline">
                  Clear all
                </button>
              </li>
            </ul>
          )}

          <div className="mt-6">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3" aria-busy="true">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} aria-hidden="true">
                    <div className="aspect-square rounded-xl bg-store-muted motion-safe:animate-pulse" />
                    <div className="mt-4 h-3 w-1/3 rounded bg-store-muted" />
                    <div className="mt-3 h-4 w-5/6 rounded bg-store-muted" />
                    <div className="mt-2 h-4 w-1/2 rounded bg-store-muted" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <EmptyState
                icon={<AlertCircle />}
                title="We couldn't load the catalog"
                description="Please check your connection and refresh the page."
                action={<Button onClick={() => window.location.reload()}>Try again</Button>}
              />
            ) : pageItems.length === 0 ? (
              <EmptyState
                icon={showOnlyWishlist && !wishlistItems.length ? <Heart /> : <SearchX />}
                title={showOnlyWishlist && !wishlistItems.length ? 'Your wishlist is empty' : 'No products match these filters'}
                description={
                  showOnlyWishlist && !wishlistItems.length
                    ? 'Tap the heart on any product to save it here.'
                    : 'Try a different search term or remove a filter to see more of the catalog.'
                }
                action={<Button onClick={clearAll}>{showOnlyWishlist && !wishlistItems.length ? 'Browse the catalog' : 'Clear all filters'}</Button>}
                className="rounded-xl border border-dashed border-store-line"
              />
            ) : layout === 'list' ? (
              <div className="border-t border-store-line">
                {pageItems.map((p, i) => (
                  <ProductCard key={p._id} product={p} layout="list" onQuickView={setQuickView} priority={i < 3} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3">
                {pageItems.map((p, i) => (
                  <ProductCard key={p._id} product={p} onQuickView={setQuickView} priority={i < 3} />
                ))}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1.5">
              <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  aria-current={n === page ? 'page' : undefined}
                  className={cn(
                    'h-9 min-w-9 rounded-md px-2 text-[14px] tabular',
                    n === page ? 'bg-store-charcoal text-white' : 'text-store-charcoal hover:bg-store-accent-dark'
                  )}
                >
                  {n}
                </button>
              ))}
              <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
            </nav>
          )}
        </section>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-labelledby="filters-title">
          <div className="absolute inset-0 bg-slate-950/40 animate-fade-in" onClick={() => setFiltersOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[min(22rem,88vw)] flex-col bg-store-accent shadow-modal animate-slide-in-left">
            <div className="flex items-center justify-between border-b border-store-line px-5 py-3">
              <h2 id="filters-title" className="font-sans text-base font-semibold">Filters</h2>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-store-accent-dark"
                aria-label="Close filters"
                autoFocus
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6">{filterPanel}</div>
            <div className="flex gap-2 border-t border-store-line p-4 pb-safe">
              <Button variant="secondary" className="flex-1" onClick={clearAll}>Clear all</Button>
              <Button className="flex-1" onClick={() => setFiltersOpen(false)}>Show {sorted.length} results</Button>
            </div>
          </div>
        </div>
      )}

      <QuickViewModal product={quickView} isOpen={!!quickView} onClose={() => setQuickView(null)} />
    </div>
  );
};

export default ProductCatalog;
