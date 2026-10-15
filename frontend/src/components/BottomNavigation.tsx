import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Home, LibraryBig, ShoppingBag, User } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import { cn } from '../lib/utils';

// Mobile-only tab bar. Rendered by the storefront shell (hidden during checkout).
const BottomNavigation: React.FC = () => {
  const { pathname, search } = useLocation();
  const cartCount = useCartStore((s) => s.items.reduce((sum, item) => sum + item.quantity, 0));
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const isWishlist = pathname === '/books' && new URLSearchParams(search).get('wishlist') === 'true';

  const items = [
    { label: 'Home', icon: Home, to: '/home', active: pathname === '/home' },
    {
      label: 'Shop',
      icon: LibraryBig,
      to: '/books',
      active: (pathname === '/books' && !isWishlist) || pathname.startsWith('/book/'),
    },
    { label: 'Wishlist', icon: Heart, to: '/books?wishlist=true', active: isWishlist, badge: wishlistCount },
    { label: 'Cart', icon: ShoppingBag, to: '/cart', active: pathname === '/cart', badge: cartCount },
    {
      label: 'Account',
      icon: User,
      to: '/dashboard',
      active: ['/dashboard', '/account', '/login'].includes(pathname),
    },
  ];

  return (
    <nav
      aria-label="Quick navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-store-line bg-white/95 backdrop-blur-sm pb-safe md:hidden"
    >
      <ul className="mx-auto flex h-16 max-w-md items-stretch">
        {items.map(({ label, icon: Icon, to, active, badge }) => (
          <li key={label} className="flex-1">
            <Link
              to={to}
              aria-current={active ? 'page' : undefined}
              aria-label={badge ? `${label}, ${badge} ${badge === 1 ? 'item' : 'items'}` : undefined}
              className={cn(
                'relative flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
                'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-store-primary',
                active ? 'text-store-primary' : 'text-store-charcoal-light'
              )}
            >
              {active && <span aria-hidden="true" className="absolute top-0 h-0.5 w-8 rounded-full bg-store-primary" />}
              <span className="relative">
                <Icon className="h-[21px] w-[21px]" strokeWidth={active ? 2 : 1.75} aria-hidden="true" />
                {badge !== undefined && badge > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-store-primary px-1 text-[9px] font-semibold leading-none text-white ring-2 ring-white"
                  >
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BottomNavigation;
