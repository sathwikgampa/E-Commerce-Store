import React, { useState, useRef, useEffect } from 'react';
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
  ShieldAlert,
  Sparkles,
  BookOpen,
  ArrowRight,
  Newspaper
} from 'lucide-react';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import { useProducts } from '../api/queries';

const CATEGORIES_MENU = [
  { name: 'All Books & Guides', path: '/books', desc: 'Browse complete academic catalog' },
  { name: 'Textbooks (NCERT & State)', path: '/books?category=Textbooks', desc: 'Class 6 - 12 CBSE & State syllabus' },
  { name: 'Notebooks & Registers', path: '/books?category=Notebooks', desc: 'Classmate single-line & practicals' },
  { name: 'School Supplies', path: '/books?category=School Supplies', desc: 'Stationery, geometry sets, pens' },
  { name: 'Engineering Materials', path: '/books?category=Engineering Materials', desc: 'Higher education reference texts' },
  { name: 'Question Banks', path: '/books?category=Question Banks', desc: 'VGS & board exam test series' },
  { name: 'Competitive Exam Books', path: '/books?category=Competitive Exam Books', desc: 'TSPSC, SSC, Banking, Railways' },
  { name: 'School & College Bags', path: '/books?category=School Bags', desc: 'Ergonomic backpacks & cases' },
];

const Navbar: React.FC = () => {
  const items = useCartStore((state) => state.items) || [];
  const wishlistItems = useWishlistStore((state) => state.items) || [];
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const { data: allProducts = [] } = useProducts();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live search suggestions
  const matchingProducts = searchQuery.trim().length > 1
    ? allProducts.filter((p) => {
        const query = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(query) ||
          p.author.toLowerCase().includes(query) ||
          (p.publisher && p.publisher.toLowerCase().includes(query)) ||
          p.category.toLowerCase().includes(query)
        );
      }).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchFocused(false);
      setMobileMenuOpen(false);
    }
  };

  const handleSelectSuggestion = (path: string) => {
    navigate(path);
    setIsSearchFocused(false);
    setSearchQuery('');
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full z-50 sticky top-0 flex flex-col shadow-xs" role="banner">
      
      {/* 1. Top Announcement Bar */}
      {announcementVisible && (
        <div className="bg-store-primary text-white text-[11px] sm:text-xs font-bold py-1.5 px-4 flex items-center justify-between transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center w-full">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Special Academic Offer:
            </span>
            <span>Get 10% OFF on all NCERT &amp; VGS Question Banks with code <strong className="underline underline-offset-2">STUDENT10</strong>!</span>
          </div>
          <button 
            onClick={() => setAnnouncementVisible(false)}
            className="text-white/80 hover:text-white p-0.5 ml-2"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Top Contact & Store Hours Utility Bar */}
      <div className="w-full bg-store-charcoal text-slate-200 py-2 px-4 text-xs font-semibold border-b border-white/10 relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-[11px] sm:text-xs">
            <a 
              href="tel:9949886640" 
              className="flex items-center gap-1.5 hover:text-store-primary transition-colors focus-visible:ring-1 focus-visible:ring-store-primary rounded"
            >
              <Phone className="w-3.5 h-3.5 text-store-primary" />
              <span>+91 99498 86640</span>
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-store-primary" />
              <span>Station Road, Kamareddy - 503111</span>
            </div>
            <span className="hidden sm:inline text-slate-600">|</span>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-store-primary" />
              <span>Open: 9:00 AM - 9:00 PM</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href="https://wa.me/919949886640?text=Hi%20Sri%20Thirumala%20Store%2C%20I%20would%20like%20to%20inquire%20about%20books" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1 bg-[#128C7E] hover:bg-[#075E54] text-white px-2.5 py-0.5 rounded-full transition-colors text-[11px] font-bold shadow-xs"
              aria-label="Direct WhatsApp inquiry"
            >
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
          
        </div>
      </div>

      {/* 3. Main Navigation Bar */}
      <div className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 gap-4">
            
            {/* Logo Brand (Redirects to /home per project user rule) */}
            <Link 
              to="/home" 
              className="flex items-center gap-3 group shrink-0 focus-visible:ring-2 focus-visible:ring-store-primary rounded-xl p-1" 
              title="Sri Thirumala Bookstore Home"
              aria-label="Sri Thirumala Home"
            >
              <div className="bg-store-primary p-2.5 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-2xl font-black">menu_book</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-store-primary transition-colors leading-none font-serif">Sri Thirumala</span>
                <span className="text-[10px] font-bold uppercase tracking-widest leading-none mt-1 text-store-primary">Book Seller &amp; Stationery</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6" aria-label="Main Navigation">
              <Link 
                className="text-xs font-bold text-slate-700 hover:text-store-primary transition-colors py-1 relative group" 
                to="/home"
              >
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-store-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>

              {/* Categories Mega Dropdown */}
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  onMouseEnter={() => setCategoryDropdownOpen(true)}
                  className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-store-primary transition-colors py-1 focus-visible:ring-1 focus-visible:ring-store-primary rounded"
                  aria-expanded={categoryDropdownOpen}
                  aria-haspopup="true"
                >
                  <span>Categories</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {categoryDropdownOpen && (
                  <div 
                    onMouseLeave={() => setCategoryDropdownOpen(false)}
                    className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-3 px-2 z-50 animate-fade-up text-left"
                    role="menu"
                  >
                    <div className="px-3 py-1.5 border-b border-slate-100 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Department Directory</span>
                    </div>
                    {CATEGORIES_MENU.map((cat, idx) => (
                      <Link
                        key={idx}
                        to={cat.path}
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="flex flex-col px-3 py-2 rounded-xl hover:bg-store-accent hover:text-store-primary transition group text-slate-700"
                        role="menuitem"
                      >
                        <span className="text-xs font-bold group-hover:text-store-primary">{cat.name}</span>
                        <span className="text-[10px] text-slate-400 group-hover:text-slate-500 font-medium">{cat.desc}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link 
                className="text-xs font-bold text-slate-700 hover:text-store-primary transition-colors py-1 relative group" 
                to="/books"
              >
                All Books
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-store-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>

              {/* Blog Link for Content Marketing */}
              <Link 
                className="text-xs font-bold text-slate-700 hover:text-store-primary transition-colors py-1 relative group flex items-center gap-1" 
                to="/blog"
              >
                <Newspaper className="w-3.5 h-3.5 text-store-primary" />
                <span>Study Blog</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-store-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>

              <Link 
                className="text-xs font-bold text-slate-700 hover:text-store-primary transition-colors py-1 relative group" 
                to="/contact"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-store-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Desktop Live Search Bar with Dropdown Suggestions */}
            <div className="hidden md:flex flex-1 max-w-sm relative" ref={searchContainerRef}>
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="flex items-center bg-slate-100 hover:bg-slate-200/70 focus-within:bg-white focus-within:ring-2 focus-within:ring-store-primary/40 focus-within:border-store-primary border border-slate-200 rounded-full px-3.5 py-2 transition-all">
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input 
                    type="search"
                    placeholder="Search by title, author, publisher, ISBN..." 
                    className="bg-transparent border-none focus:outline-none text-xs w-full pl-2 pr-1 font-medium text-slate-800 placeholder:text-slate-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    aria-label="Search catalog books and supplies"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-slate-400 hover:text-slate-600 p-0.5"
                      aria-label="Clear search input"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </form>

              {/* Autocomplete Dropdown Preview */}
              {isSearchFocused && searchQuery.trim().length > 1 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-3 px-2 z-50 animate-fade-up text-left">
                  <div className="px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                    Matching Books &amp; Materials ({matchingProducts.length})
                  </div>
                  {matchingProducts.length > 0 ? (
                    <div className="space-y-1 mt-2">
                      {matchingProducts.map((p) => (
                        <button
                          key={p._id}
                          type="button"
                          onClick={() => handleSelectSuggestion(`/book/${p._id}`)}
                          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-store-accent transition text-left group"
                        >
                          <div className="w-10 h-12 bg-slate-100 rounded-lg shrink-0 flex items-center justify-center p-1 border border-slate-200">
                            <img src={p.image} alt={p.title} className="max-h-full max-w-full object-contain" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-store-primary truncate">{p.title}</h4>
                            <p className="text-[10px] text-slate-500 truncate">{p.author} • <span className="font-semibold text-store-primary">₹{p.price}</span></p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-store-primary shrink-0" />
                        </button>
                      ))}
                      <div className="pt-2 border-t border-slate-100 px-2">
                        <button
                          type="button"
                          onClick={() => handleSelectSuggestion(`/books?search=${encodeURIComponent(searchQuery.trim())}`)}
                          className="w-full py-2 text-center text-xs font-bold text-store-primary hover:bg-store-accent-dark rounded-xl transition"
                        >
                          View all search results for "{searchQuery}" →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-500 font-semibold">
                      No matching books found. Try searching by publisher (e.g. NCERT, VGS, Classmate).
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions & Utilities */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Wishlist Link */}
              <Link 
                to="/books?wishlist=true" 
                className="p-2.5 text-slate-700 hover:text-store-primary hover:bg-store-accent rounded-full transition-all relative flex items-center justify-center min-w-[44px] min-h-[44px] focus-visible:ring-2 focus-visible:ring-store-primary"
                title="View Wishlist"
                aria-label={`Wishlist, ${wishlistCount} items`}
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Link with Badge */}
              <Link 
                to="/cart" 
                className="p-2.5 text-slate-700 hover:text-store-primary hover:bg-store-accent rounded-full transition-all relative flex items-center justify-center min-w-[44px] min-h-[44px] focus-visible:ring-2 focus-visible:ring-store-primary"
                title="Shopping Cart"
                aria-label={`Shopping Cart, ${cartItemCount} items`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-store-primary text-white text-[9px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full shadow-xs">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* User Account Link */}
              <Link 
                to="/login" 
                className="p-2.5 text-slate-700 hover:text-store-primary hover:bg-store-accent rounded-full transition-all hidden sm:flex items-center justify-center min-w-[44px] min-h-[44px] focus-visible:ring-2 focus-visible:ring-store-primary" 
                title="Customer Login"
                aria-label="Customer Login"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Admin Portal Link */}
              <Link 
                to="/admin/login" 
                className="p-2.5 text-slate-700 hover:text-[#0A3D91] hover:bg-slate-100 rounded-full transition-all hidden md:flex items-center justify-center min-w-[44px] min-h-[44px] focus-visible:ring-2 focus-visible:ring-[#0A3D91]" 
                title="Owner / Admin Portal"
                aria-label="Admin Portal"
              >
                <ShieldAlert className="w-5 h-5" />
              </Link>

              {/* Hamburger Button for Mobile */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 text-slate-700 hover:bg-slate-100 rounded-xl transition-all flex items-center justify-center min-w-[44px] min-h-[44px] focus-visible:ring-2 focus-visible:ring-store-primary"
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-store-primary" /> : <Menu className="w-6 h-6" />}
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200/90 px-4 pt-4 pb-8 space-y-4 shadow-2xl absolute w-full left-0 z-50 text-left animate-fade-up">
            
            {/* Mobile Search Form */}
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-100 rounded-xl px-3.5 py-3 border border-slate-200 focus-within:border-store-primary focus-within:bg-white">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                className="bg-transparent border-none focus:outline-none text-xs w-full pl-2.5 font-medium placeholder:text-slate-400" 
                placeholder="Search books, authors, publishers..." 
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Mobile search"
              />
            </form>
            
            {/* Main Navigation links */}
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <Link onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl bg-slate-50 hover:bg-store-accent hover:text-store-primary transition" to="/home">Home</Link>
              <Link onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl bg-slate-50 hover:bg-store-accent hover:text-store-primary transition" to="/books">All Books</Link>
              <Link onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl bg-slate-50 hover:bg-store-accent hover:text-store-primary transition" to="/blog">Study Blog</Link>
              <Link onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl bg-slate-50 hover:bg-store-accent hover:text-store-primary transition" to="/contact">Contact</Link>
            </div>

            {/* Category Directory List */}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-2 mb-1">Browse Categories</span>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold">
                {CATEGORIES_MENU.map((cat, idx) => (
                  <Link
                    key={idx}
                    to={cat.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-lg bg-slate-50 hover:bg-store-accent hover:text-store-primary transition text-slate-700"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <Link 
                onClick={() => setMobileMenuOpen(false)} 
                to="/login"
                className="text-xs font-bold text-slate-700 hover:text-store-primary flex items-center gap-1.5 p-2"
              >
                <User className="w-4 h-4 text-store-primary" /> Customer Login
              </Link>
              <Link 
                onClick={() => setMobileMenuOpen(false)} 
                to="/admin/login"
                className="text-xs font-bold text-[#0A3D91] hover:underline flex items-center gap-1.5 p-2"
              >
                <ShieldAlert className="w-4 h-4" /> Admin Portal
              </Link>
            </div>

          </div>
        )}
      </div>

    </header>
  );
};

export default Navbar;
