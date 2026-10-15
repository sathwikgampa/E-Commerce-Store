import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  GraduationCap,
  Heart,
  Lock,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
  User,
  X,
} from 'lucide-react';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import { useProducts } from '../api/queries';
import {
  CATEGORY_NOTES,
  STORE,
  catalogPath,
  formatPrice,
  matchesQuery,
  summarizeCategories,
} from './landing/landingData';
import { cn } from '../lib/utils';
import { VenkateshwaraNamamIcon } from './icons/VenkateshwaraIcons';

const ring = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-store-primary';
const iconButton = cn(
  'relative inline-flex h-11 w-11 items-center justify-center rounded-full text-store-charcoal transition-colors hover:bg-store-accent-dark',
  ring
);

const CountBadge: React.FC<{ count: number }> = ({ count }) =>
  count > 0 ? (
    <span
      aria-hidden="true"
      className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-store-primary px-1 text-[10px] font-semibold leading-none text-white"
    >
      {count > 99 ? '99+' : count}
    </span>
  ) : null;

const Wordmark: React.FC = () => (
  <Link
    to="/home"
    className={cn('flex items-center gap-2.5 shrink-0 whitespace-nowrap rounded-sm leading-none', ring)}
    aria-label="Sri Thirumala home"
  >
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-store-primary text-white shadow-warm-sm">
      <VenkateshwaraNamamIcon className="h-5 w-5" />
    </span>
    <div className="flex flex-col">
      <span className="font-serif text-[18px] font-semibold tracking-tight text-store-charcoal sm:text-[20px]">
        Sri Thirumala
      </span>
      <span className="mt-0.5 text-[9.5px] font-medium uppercase tracking-[0.18em] text-store-charcoal-light">
        Books &amp; Stationery
      </span>
    </div>
  </Link>
);

// ── Search with live suggestions (combobox pattern) ─────────────────────────
const NavSearch: React.FC<{ onNavigate?: () => void; autoFocus?: boolean; className?: string }> = ({
  onNavigate,
  autoFocus,
  className = '',
}) => {
  const { data: products = [] } = useProducts();
  const navigate = useNavigate();
  const listId = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(
    () => (query.trim().length > 1 ? products.filter((p) => matchesQuery(p, query)).slice(0, 5) : []),
    [products, query]
  );
  const showList = open && query.trim().length > 1;

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const go = (path: string) => {
    navigate(path);
    setOpen(false);
    setQuery('');
    setActive(-1);
    onNavigate?.();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (active >= 0 && results[active]) return go(`/book/${results[active]._id}`);
    if (query.trim()) go(catalogPath({ search: query.trim() }));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showList) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(-1, i - 1));
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActive(-1);
    }
  };

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      <form role="search" onSubmit={submit}>
        <label htmlFor={`${listId}-input`} className="sr-only">
          Search books and stationery
        </label>
        <div className="flex h-11 items-center rounded-full border border-store-line bg-white transition-colors focus-within:border-store-primary focus-within:ring-2 focus-within:ring-store-primary/15">
          <Search className="ml-4 h-4 w-4 shrink-0 text-store-charcoal-light" aria-hidden="true" />
          <input
            id={`${listId}-input`}
            type="search"
            role="combobox"
            aria-expanded={showList}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `${listId}-opt-${active}` : undefined}
            autoComplete="off"
            autoFocus={autoFocus}
            placeholder="Search title, author, publisher or ISBN"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActive(-1);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            className="h-full w-full bg-transparent px-2.5 text-base text-store-charcoal placeholder:text-store-charcoal-light/70 focus:outline-none sm:text-sm [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mr-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-store-charcoal-light hover:bg-store-accent-dark"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </form>

      {showList && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-store-line bg-white shadow-pop animate-fade-up">
          {results.length > 0 ? (
            <>
              <ul id={listId} role="listbox" aria-label="Matching products" className="py-1.5">
                {results.map((p, i) => (
                  <li
                    key={p._id}
                    id={`${listId}-opt-${i}`}
                    role="option"
                    aria-selected={active === i}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => go(`/book/${p._id}`)}
                    onMouseEnter={() => setActive(i)}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 px-3 py-2',
                      active === i ? 'bg-store-accent' : 'hover:bg-store-accent'
                    )}
                  >
                    <span className="h-12 w-10 shrink-0 overflow-hidden rounded bg-store-muted">
                      {p.image && <img src={p.image} alt="" className="h-full w-full object-cover" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-store-charcoal">{p.title}</span>
                      <span className="block truncate text-xs text-store-charcoal-light">
                        {p.author} · <span className="tabular text-store-charcoal">{formatPrice(p.price)}</span>
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => go(catalogPath({ search: query.trim() }))}
                className="block w-full border-t border-store-line px-4 py-3 text-left text-sm font-medium text-store-primary hover:bg-store-accent"
              >
                See all results for “{query.trim()}”
              </button>
            </>
          ) : (
            <p className="px-4 py-4 text-sm text-store-charcoal-light">
              No matches. Try a publisher such as NCERT, VGS or Classmate.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// ── Navbar ──────────────────────────────────────────────────────────────────
interface NavbarProps {
  variant?: 'default' | 'minimal';
}

const Navbar: React.FC<NavbarProps> = ({ variant = 'default' }) => {
  const cartCount = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { data: products = [] } = useProducts();
  const categories = useMemo(() => summarizeCategories(products), [products]);
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(
    () => sessionStorage.getItem('stm_hide_announcement') !== '1'
  );

  // Close the mobile menu on navigation
  useEffect(() => setMenuOpen(false), [location.pathname, location.search]);

  // Lock scroll + Escape to close while the mobile menu is open
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const dismissAnnouncement = () => {
    sessionStorage.setItem('stm_hide_announcement', '1');
    setAnnouncementVisible(false);
  };

  const isCatalog = location.pathname.startsWith('/books') || location.pathname.startsWith('/book/');
  const navItem = (active: boolean) =>
    cn(
      'relative inline-flex h-9 items-center rounded-md px-1 text-[14px] font-medium transition-colors',
      active ? 'text-store-charcoal' : 'text-store-charcoal-light hover:text-store-charcoal',
      "after:absolute after:inset-x-1 after:-bottom-[15px] after:h-0.5 after:rounded-full after:bg-store-primary after:transition-opacity",
      active ? 'after:opacity-100' : 'after:opacity-0',
      ring
    );

  // Focused checkout header: brand, reassurance and a way back to the cart
  if (variant === 'minimal') {
    return (
      <header className="sticky top-0 z-40 border-b border-store-line bg-store-accent/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-store items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
          <Link
            to="/cart"
            className={cn('inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-store-charcoal-light hover:text-store-charcoal', ring)}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Back to cart</span>
            <span className="sm:hidden">Cart</span>
          </Link>
          <Wordmark />
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-store-charcoal-light">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Secure checkout</span>
          </span>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40">
      {/* Slim store bar */}
      {announcementVisible && (
        <div className="bg-store-charcoal text-[12px] text-white/85">
          <div className="mx-auto flex h-9 max-w-store items-center gap-4 px-5 sm:px-8 lg:px-12">
            <p className="hidden shrink-0 lg:block">
              {STORE.address.replace(', Telangana 503111', '')} · Open {STORE.hours}
            </p>
            <p className="min-w-0 flex-1 truncate text-center lg:text-left">
              10% off NCERT &amp; VGS question banks with code{' '}
              <strong className="font-semibold text-white">STUDENT10</strong>
            </p>
            <div className="hidden shrink-0 items-center gap-4 md:flex">
              <a href={STORE.phoneHref} className="inline-flex items-center gap-1.5 rounded-sm hover:text-white focus-visible:outline-2 focus-visible:outline-white">
                <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {STORE.phoneDisplay}
              </a>
              <Link to="/portal" className="rounded-sm font-medium text-white underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-white">
                Student &amp; institution portal
              </Link>
            </div>
            <button
              type="button"
              onClick={dismissAnnouncement}
              className="-mr-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white/70 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
              aria-label="Dismiss announcement"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Main bar */}
      <div className="border-b border-store-line bg-store-accent/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-store items-center gap-3 px-5 sm:gap-6 sm:px-8 lg:h-[72px] lg:px-12">
          <Wordmark />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-6">
              <li>
                <DropdownMenu.Root modal={false}>
                  <DropdownMenu.Trigger className={cn(navItem(isCatalog), 'gap-1.5 data-[state=open]:text-store-charcoal')}>
                    <BookOpen className="h-4 w-4 text-store-charcoal-light" aria-hidden="true" />
                    Shop
                    <ChevronDown className="h-3.5 w-3.5 transition-transform duration-150 [[data-state=open]_&]:rotate-180" aria-hidden="true" />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      align="start"
                      sideOffset={14}
                      className="storefront z-50 w-[520px] rounded-xl border border-store-line bg-white p-2 shadow-pop animate-fade-up"
                    >
                      <div className="grid grid-cols-2 gap-0.5">
                        <DropdownMenu.Item asChild>
                          <Link
                            to="/books"
                            className="col-span-2 flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-store-charcoal outline-none data-[highlighted]:bg-store-accent"
                          >
                            Browse the full catalog
                            <span className="text-xs font-normal text-store-charcoal-light tabular">{products.length} items</span>
                          </Link>
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator className="col-span-2 my-1 h-px bg-store-line" />
                        {categories.map((cat) => (
                          <DropdownMenu.Item key={cat.name} asChild>
                            <Link
                              to={catalogPath({ category: cat.name })}
                              className="block rounded-lg px-3 py-2 outline-none data-[highlighted]:bg-store-accent"
                            >
                              <span className="block text-sm font-medium text-store-charcoal">{cat.name}</span>
                              {CATEGORY_NOTES[cat.name] && (
                                <span className="mt-0.5 block text-xs leading-snug text-store-charcoal-light">
                                  {CATEGORY_NOTES[cat.name]}
                                </span>
                              )}
                            </Link>
                          </DropdownMenu.Item>
                        ))}
                      </div>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </li>
              <li>
                <NavLink to="/" className={({ isActive }) => cn(navItem(isActive), 'gap-1.5')}>
                  <Sparkles className="h-4 w-4 text-store-primary" aria-hidden="true" />
                  Landing page
                </NavLink>
              </li>
              <li>
                <NavLink to="/blog" className={({ isActive }) => cn(navItem(isActive), 'gap-1.5')}>
                  <GraduationCap className="h-4 w-4 text-store-charcoal-light" aria-hidden="true" />
                  Study blog
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className={({ isActive }) => cn(navItem(isActive), 'gap-1.5')}>
                  <Store className="h-4 w-4 text-store-charcoal-light" aria-hidden="true" />
                  Visit the store
                </NavLink>
              </li>
            </ul>
          </nav>

          <NavSearch className="ml-auto hidden w-full max-w-sm md:block lg:max-w-[22rem]" />

          <div className="ml-auto flex items-center gap-0.5 md:ml-0">
            <Link
              to="/books?wishlist=true"
              className={cn(iconButton, 'max-sm:hidden')}
              aria-label={`Wishlist, ${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'}`}
            >
              <Heart className="h-[19px] w-[19px]" strokeWidth={1.75} aria-hidden="true" />
              <CountBadge count={wishlistCount} />
            </Link>
            <Link to="/dashboard" className={cn(iconButton, 'max-sm:hidden')} aria-label="Your account">
              <User className="h-[19px] w-[19px]" strokeWidth={1.75} aria-hidden="true" />
            </Link>
            <Link
              to="/cart"
              className={iconButton}
              aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
            >
              <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.75} aria-hidden="true" />
              <CountBadge count={cartCount} />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className={cn(iconButton, 'lg:hidden')}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="store-mobile-menu"
            >
              {menuOpen ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="store-mobile-menu"
          className="fixed inset-x-0 bottom-0 overflow-y-auto border-t border-store-line bg-store-accent px-5 pb-28 pt-5 sm:px-8 lg:hidden animate-fade-in"
          style={{ top: announcementVisible ? 100 : 64 }}
        >
          <NavSearch className="md:hidden" onNavigate={() => setMenuOpen(false)} />
          <nav aria-label="Mobile" className="mt-4">
            <ul className="divide-y divide-store-line border-y border-store-line">
              {[
                { to: '/books', label: 'Shop all' },
                { to: '/', label: 'Landing page' },
                { to: '/blog', label: 'Study blog' },
                { to: '/contact', label: 'Visit the store' },
                { to: '/dashboard', label: 'My account' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={cn('block py-3.5 text-lg font-medium text-store-charcoal', ring)}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {categories.length > 0 && (
              <>
                <p className="mt-7 text-[11px] font-medium uppercase tracking-[0.16em] text-store-charcoal-light">
                  Shop by category
                </p>
                <ul className="mt-2 grid grid-cols-1 gap-x-6 min-[400px]:grid-cols-2">
                  {categories.map((cat) => (
                    <li key={cat.name}>
                      <Link
                        to={catalogPath({ category: cat.name })}
                        className={cn('flex items-center justify-between rounded-sm py-2.5 text-[15px] text-store-charcoal-light hover:text-store-charcoal', ring)}
                      >
                        {cat.name}
                        <span className="text-xs tabular opacity-70">{cat.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="mt-7 space-y-3 border-t border-store-line pt-6 text-sm">
              <Link to="/portal" className={cn('flex h-11 items-center justify-between rounded-lg border border-store-line bg-white px-4 font-medium text-store-charcoal', ring)}>
                Student &amp; institution portal <span aria-hidden="true">→</span>
              </Link>
              <a href={STORE.phoneHref} className="flex items-center gap-2 py-1 text-store-charcoal-light">
                <Phone className="h-4 w-4" aria-hidden="true" /> {STORE.phoneDisplay} · {STORE.hours}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
