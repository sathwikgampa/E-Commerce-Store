import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import { CategorySummary, catalogPath, focusRing } from './landingData';
import { VenkateshwaraNamamIcon } from '../icons/VenkateshwaraIcons';

interface LandingNavProps {
  categories: CategorySummary[];
  onSearchRequest: () => void;
}

const NAV_LINKS = [
  { label: 'Shop', to: '/books' },
  { label: 'Categories', to: '#categories' },
  { label: 'Study blog', to: '/blog' },
  { label: 'Visit the store', to: '/contact' },
];

const iconButton = `relative inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-paper-deep ${focusRing}`;

const CountBadge: React.FC<{ count: number }> = ({ count }) =>
  count > 0 ? (
    <span
      aria-hidden="true"
      className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-ember px-1 text-[10px] font-semibold leading-none text-white"
    >
      {count > 99 ? '99+' : count}
    </span>
  ) : null;

const NavLink: React.FC<{ to: string; className: string; onClick?: () => void; children: React.ReactNode }> = ({
  to,
  className,
  onClick,
  children,
}) =>
  to.startsWith('#') ? (
    <a href={to} className={className} onClick={onClick}>
      {children}
    </a>
  ) : (
    <Link to={to} className={className} onClick={onClick}>
      {children}
    </Link>
  );

const LandingNav: React.FC<LandingNavProps> = ({ categories, onSearchRequest }) => {
  const cartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock page scroll and allow Escape to close while the mobile menu is open
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

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color] duration-200 ${
        scrolled || menuOpen ? 'border-b border-line bg-paper/95 backdrop-blur-sm' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center gap-3 px-5 sm:gap-6 sm:px-8 lg:px-12">
        <Link to="/home" className={`mr-auto flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-sm leading-none ${focusRing}`} aria-label="Sri Thirumala home">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ember text-white shadow-sm">
            <VenkateshwaraNamamIcon className="h-5 w-5" />
          </span>
          <div className="flex flex-col">
            <span className="font-serif text-[18px] font-semibold sm:text-[21px] tracking-tight text-ink">Sri Thirumala</span>
            <span className="mt-0.5 text-[9.5px] font-medium uppercase tracking-[0.18em] text-ink-muted">
              Books &amp; Stationery
            </span>
          </div>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <NavLink
                  to={link.to}
                  className={`rounded-sm text-[14px] font-medium text-ink-soft transition-colors hover:text-ink ${focusRing}`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 lg:ml-6">
          <button type="button" onClick={onSearchRequest} className={iconButton} aria-label="Search the catalog">
            <Search className="h-[19px] w-[19px]" strokeWidth={1.75} />
          </button>
          <Link
            to="/books?wishlist=true"
            className={`${iconButton} max-sm:hidden`}
            aria-label={`Wishlist, ${wishlistCount} ${wishlistCount === 1 ? 'item' : 'items'}`}
          >
            <Heart className="h-[19px] w-[19px]" strokeWidth={1.75} />
            <CountBadge count={wishlistCount} />
          </Link>
          <Link to="/dashboard" className={`${iconButton} max-sm:hidden`} aria-label="Your account">
            <User className="h-[19px] w-[19px]" strokeWidth={1.75} />
          </Link>
          <Link
            to="/cart"
            className={iconButton}
            aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
          >
            <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.75} />
            <CountBadge count={cartCount} />
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className={`${iconButton} lg:!hidden`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="landing-mobile-menu"
          >
            {menuOpen ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="landing-mobile-menu"
          className="fixed inset-x-0 bottom-0 top-[72px] overflow-y-auto border-t border-line bg-paper px-5 pb-10 pt-6 sm:px-8 lg:hidden"
        >
          <nav aria-label="Mobile">
            <ul className="divide-y divide-line border-b border-line">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.to}
                    onClick={closeMenu}
                    className={`block py-4 text-[22px] font-medium tracking-tight text-ink ${focusRing}`}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {categories.length > 0 && (
              <>
                <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-muted">Shop by category</p>
                <ul className="mt-3 grid grid-cols-1 gap-x-6 min-[400px]:grid-cols-2">
                  {categories.map((cat) => (
                    <li key={cat.name}>
                      <Link
                        to={catalogPath({ category: cat.name })}
                        onClick={closeMenu}
                        className={`block rounded-sm py-2.5 text-[15px] text-ink-soft hover:text-ink ${focusRing}`}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
              <Link
                to="/books?wishlist=true"
                onClick={closeMenu}
                className={`inline-flex h-11 items-center gap-2 rounded-lg border border-line px-4 text-[14px] font-medium text-ink ${focusRing}`}
              >
                <Heart className="h-4 w-4" strokeWidth={1.75} /> Wishlist{wishlistCount > 0 && ` (${wishlistCount})`}
              </Link>
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className={`inline-flex h-11 items-center gap-2 rounded-lg border border-line px-4 text-[14px] font-medium text-ink ${focusRing}`}
              >
                <User className="h-4 w-4" strokeWidth={1.75} /> Account
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default LandingNav;
