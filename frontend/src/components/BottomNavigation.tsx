import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items) || [];
  const wishlistItems = useWishlistStore((state) => state.items) || [];
  
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const navItems = [
    {
      label: 'Home',
      icon: Home,
      path: '/home',
    },
    {
      label: 'Search',
      icon: Search,
      path: '/books',
    },
    {
      label: 'Cart',
      icon: ShoppingCart,
      path: '/cart',
      badge: cartItemCount,
    },
    {
      label: 'Wishlist',
      icon: Heart,
      path: '/books?wishlist=true',
      badge: wishlistCount,
    },
    {
      label: 'Profile',
      icon: User,
      path: '/login',
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200/80 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe px-2">
      {navItems.map((item) => {
        const isActive = 
          item.path.includes('?') 
            ? location.pathname + location.search === item.path
            : location.pathname === item.path || (item.path === '/books' && location.pathname === '/books' && !location.search.includes('wishlist'));
            
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            to={item.path}
            className="flex flex-col items-center justify-center flex-1 h-full min-w-[64px] relative active:scale-95 transition-transform"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'text-store-primary' : 'text-slate-500 hover:text-slate-800'}`}>
              <Icon className="w-5 h-5" />
              
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-2 right-4 bg-store-primary text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full shadow-xs border border-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span className={`text-[9px] font-bold tracking-tight leading-none mt-0.5 ${isActive ? 'text-store-primary font-black' : 'text-slate-500'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNavigation;
