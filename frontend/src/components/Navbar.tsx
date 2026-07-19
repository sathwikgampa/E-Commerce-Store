import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Search, 
  ShoppingCart, 
  Heart, 
  Menu, 
  X, 
  ChevronDown,
  User,
  ShieldAlert
} from 'lucide-react';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';

const Navbar: React.FC = () => {
  const items = useCartStore((state) => state.items) || [];
  const wishlistItems = useWishlistStore((state) => state.items) || [];
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="w-full z-50 sticky top-0 flex flex-col">
      
      {/* 1. Top Utility Bar */}
      <div className="w-full bg-store-charcoal text-slate-100 py-2.5 px-4 text-xs font-semibold border-b border-white/5 relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          
          <div className="flex flex-wrap justify-center items-center gap-5">
            <a href="tel:8897766640" className="flex items-center gap-1.5 hover:text-store-primary transition-colors">
              <Phone className="w-3.5 h-3.5 text-store-primary" />
              <span>+91 99498 86640</span>
            </a>
            <span className="hidden md:inline text-slate-500">|</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-store-primary" />
              <span>Station Road, Kamareddy - 503111</span>
            </div>
            <span className="hidden md:inline text-slate-500">|</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-store-primary" />
              <span>Timing: 9:00 AM - 9:00 PM</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://wa.me/918897766640" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1 bg-[#128C7E] hover:bg-[#075E54] text-white px-2.5 py-0.5 rounded-full transition-colors text-[11px] font-bold"
            >
              <span>WhatsApp Chat</span>
            </a>
          </div>
          
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo Brand */}
            <Link to="/home" className="flex items-center gap-2.5 group shrink-0" title="Store Home">
              <div className="bg-store-primary p-2.5 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300">
                <span className="material-symbols-outlined text-white text-2xl font-black align-middle">menu_book</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-black tracking-tight text-store-primary leading-none">Sri Thirumala</span>
                <span className="text-[9px] font-bold uppercase tracking-widest leading-none mt-1 text-store-primary">Book Seller & Stationery</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-6">
              <Link className="text-xs font-bold text-slate-700 hover:text-store-primary transition-colors py-1 relative group" to="/home">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-store-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link className="text-xs font-bold text-slate-700 hover:text-store-primary transition-colors py-1 relative group" to="/books">
                Books
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-store-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link className="text-xs font-bold text-slate-700 hover:text-store-primary transition-colors py-1 relative group" to="/books?category=Notebooks">
                Notebooks
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-store-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link className="text-xs font-bold text-slate-700 hover:text-store-primary transition-colors py-1 relative group" to="/books?category=Stationery">
                Stationery
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-store-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link className="text-xs font-bold text-slate-700 hover:text-store-primary transition-colors py-1 relative group" to="/books?category=School Bags">
                School Bags
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-store-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link className="text-xs font-bold text-slate-700 hover:text-store-primary transition-colors py-1 relative group" to="/books?category=College Bags">
                College Bags
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-store-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link className="text-xs font-bold text-slate-700 hover:text-store-primary transition-colors py-1 relative group" to="/books?category=Question Banks">
                Question Banks
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-store-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link className="text-xs font-bold text-slate-700 hover:text-store-primary transition-colors py-1 relative group" to="/books?category=Competitive Exam Books">
                Competitive Exams
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-store-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link className="text-xs font-bold text-slate-700 hover:text-store-primary transition-colors py-1 relative group" to="/contact">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-store-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Actions & Utilities */}
            <div className="flex items-center gap-2 md:gap-4">
              
              {/* Search Bar Form */}
              <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center bg-slate-100 hover:bg-slate-150 rounded-full px-4 py-2 border border-slate-200 focus-within:border-store-primary/40 focus-within:bg-white transition-all w-60">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input 
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-[11px] w-full pl-2 placeholder:text-slate-400 font-semibold" 
                  placeholder="Search books & materials..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              {/* Wishlist Link */}
              <Link 
                to="/books?wishlist=true" 
                className="p-3 text-slate-700 hover:bg-slate-100 rounded-full transition-all relative flex items-center justify-center min-w-[48px] min-h-[48px]"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-store-primary text-white text-[8px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Link with orange badge */}
              <Link 
                to="/cart" 
                className="p-3 text-slate-700 hover:bg-slate-100 rounded-full transition-all relative flex items-center justify-center min-w-[48px] min-h-[48px] animate-pulse-slow"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-store-primary text-white text-[8px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full shadow-xs">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* Divider */}
              <div className="h-5 w-px bg-slate-200 hidden md:block"></div>

              {/* User Link */}
              <Link to="/login" className="p-3 text-slate-700 hover:bg-slate-100 rounded-full transition-all flex items-center justify-center min-w-[48px] min-h-[48px]" title="User Account">
                <User className="w-5 h-5" />
              </Link>

              {/* Admin Link */}
              <Link to="/admin/login" className="p-3 text-slate-700 hover:bg-slate-100 rounded-full transition-all hidden md:flex items-center justify-center min-w-[48px] min-h-[48px]" title="Admin Portal">
                <ShieldAlert className="w-5 h-5" />
              </Link>

              {/* Hamburger Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-3 text-slate-700 hover:bg-slate-100 rounded-lg transition-all flex items-center justify-center min-w-[48px] min-h-[48px]"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-t border-slate-200/80 px-4 pt-4 pb-8 space-y-3 shadow-lg absolute w-full left-0 z-50 text-left">
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-100 rounded-xl px-3 py-3 mb-4 border border-slate-200 focus-within:border-store-primary/45">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs w-full pl-2 placeholder:text-slate-400 font-semibold" 
                placeholder="Search catalog..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            
            <div className="grid grid-cols-2 gap-2.5 text-xs font-bold">
              <Link onClick={() => setMobileMenuOpen(false)} className="px-4 py-3.5 rounded-xl hover:bg-store-peach-light hover:text-store-primary transition border border-transparent hover:border-store-primary/10 flex items-center" to="/home">Home</Link>
              <Link onClick={() => setMobileMenuOpen(false)} className="px-4 py-3.5 rounded-xl hover:bg-store-peach-light hover:text-store-primary transition border border-transparent hover:border-store-primary/10 flex items-center" to="/books">All Books</Link>
              <Link onClick={() => setMobileMenuOpen(false)} className="px-4 py-3.5 rounded-xl hover:bg-store-peach-light hover:text-store-primary transition border border-transparent hover:border-store-primary/10 flex items-center" to="/books?category=Notebooks">Notebooks</Link>
              <Link onClick={() => setMobileMenuOpen(false)} className="px-4 py-3.5 rounded-xl hover:bg-store-peach-light hover:text-store-primary transition border border-transparent hover:border-store-primary/10 flex items-center" to="/books?category=Stationery">Stationery</Link>
              <Link onClick={() => setMobileMenuOpen(false)} className="px-4 py-3.5 rounded-xl hover:bg-store-peach-light hover:text-store-primary transition border border-transparent hover:border-store-primary/10 flex items-center" to="/books?category=School Bags">School Bags</Link>
              <Link onClick={() => setMobileMenuOpen(false)} className="px-4 py-3.5 rounded-xl hover:bg-store-peach-light hover:text-store-primary transition border border-transparent hover:border-store-primary/10 flex items-center" to="/books?category=College Bags">College Bags</Link>
              <Link onClick={() => setMobileMenuOpen(false)} className="px-4 py-3.5 rounded-xl hover:bg-store-peach-light hover:text-store-primary transition border border-transparent hover:border-store-primary/10 flex items-center" to="/books?category=Question Banks">Question Banks</Link>
              <Link onClick={() => setMobileMenuOpen(false)} className="px-4 py-3.5 rounded-xl hover:bg-store-peach-light hover:text-store-primary transition border border-transparent hover:border-store-primary/10 flex items-center" to="/books?category=Competitive Exam Books">Competitive Exams</Link>
              <Link onClick={() => setMobileMenuOpen(false)} className="px-4 py-3.5 rounded-xl hover:bg-store-peach-light hover:text-store-primary transition border border-transparent hover:border-store-primary/10 flex items-center col-span-2" to="/contact">Contact Us</Link>
              <Link onClick={() => setMobileMenuOpen(false)} className="px-4 py-3.5 rounded-xl hover:bg-store-peach-light hover:text-store-primary transition border border-transparent hover:border-store-primary/10 flex items-center gap-2 col-span-2 border-t border-slate-100" to="/admin/login">
                <ShieldAlert className="w-4 h-4 text-store-primary" /> Admin Portal
              </Link>
            </div>
          </div>
        )}
      </div>

    </header>
  );
};

export default Navbar;
