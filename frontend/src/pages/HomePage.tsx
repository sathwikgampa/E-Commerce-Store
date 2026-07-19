import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  BookMarked,
  PenTool,
  Backpack,
  Briefcase,
  FileText,
  Trophy,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle,
  Truck,
  Heart,
  ShoppingCart,
  MapPin,
  Phone,
  Clock,
  ArrowUpRight,
  Package,
  Users,
  BadgeCheck,
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import { useProducts } from '../api/queries';
import { Product } from '../types';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import QuickViewModal from '../components/QuickViewModal';
import ProductCard from '../components/ProductCard';
import { toast } from 'sonner';
import ShinyText from '../components/reactbits/ShinyText';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const HomePage: React.FC = () => {
  const { data: products = [], isLoading } = useProducts();
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const openQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const bestSellers = products.filter((p) => p.rating >= 4.8);

  const categoriesList = [
    { name: 'Textbooks', icon: BookOpen, count: '1,200+ Books', route: '/books?category=Textbooks', color: '#FF7A50', bg: '#FFF7F5' },
    { name: 'Notebooks & Registers', icon: BookMarked, count: '300+ Varieties', route: '/books?category=Notebooks', color: '#6B4C13', bg: '#FFF8E7' },
    { name: 'School Supplies', icon: PenTool, count: '500+ Items', route: '/books?category=School Supplies', color: '#2D5016', bg: '#F0F7EC' },
    { name: 'Engineering Materials', icon: FileText, count: '800+ Books', route: '/books?category=Engineering Materials', color: '#3B1F7A', bg: '#F3EFFD' },
    { name: 'Question Banks', icon: Sparkles, count: 'SSC · Inter · Degree', route: '/books?category=Question Banks', color: '#174B4B', bg: '#EBF8F8' },
    { name: 'Competitive Exams', icon: Trophy, count: '900+ Titles', route: '/books?category=Competitive Exam Books', color: '#7A1F1F', bg: '#FDF0F0' },
    { name: 'School Bags', icon: Backpack, count: '150+ Designs', route: '/books?category=School Bags', color: '#1A4455', bg: '#EAF4FA' },
    { name: 'College Bags', icon: Briefcase, count: '100+ Styles', route: '/books?category=College Bags', color: '#4A1A5A', bg: '#F5EDF9' },
  ];

  const advantages = [
    { title: 'Competitive Pricing', desc: 'Better discounts on bulk school books, guides, and registers. No hidden charges.' },
    { title: 'Latest Semester Materials', desc: 'Direct stock aligned with university schedules for engineering and humanities.' },
    { title: 'Official VGS Distributor', desc: 'Regional distributor of VGS Publishing syllabus guides for SSC Board aspirants.' },
    { title: 'Trusted by Kamareddy', desc: 'Highly recommended by schools, teachers, and parents across the district.' },
    { title: 'Direct Local Support', desc: 'Speak to the shop owner directly for recommendations or custom bulk orders.' },
    { title: 'Instant Availability', desc: 'Get exam books and notebooks immediately when competitive notifications drop.' },
  ];

  const reviews = [
    {
      text: "I bought all the NCERT physics and mathematics textbooks here, alongside VGS Class 10 books for my children. The prices are better than any website and everything is always in stock.",
      name: "Ramesh K.",
      role: "Parent · Kamareddy",
    },
    {
      text: "Sri Thirumala Store has been my primary reference source for TS PSC exam guides. The owners are quick to stock new board releases as soon as vacancies are announced.",
      name: "Swapna G.",
      role: "TSPSC Group-IV Aspirant",
    },
    {
      text: "I purchase Classmate book bundles and geometry instruments here every term. The direct pickup option makes it so much more convenient than ordering online.",
      name: "Anil Kumar P.",
      role: "School Teacher · Kamareddy",
    },
    {
      text: "Best place in Kamareddy for engineering books. Dr. B.S. Grewal, R.S. Aggarwal — everything is available. I don't need to order from outside the city anymore.",
      name: "Venkat R.",
      role: "B.Tech Student · Nizamabad",
    },
  ];

  return (
    <div className="w-full bg-store-accent overflow-x-hidden">

      {/* ═══════════════════════════════════════════════════
          SECTION 1 — SPLIT-SCREEN HERO
      ═══════════════════════════════════════════════════ */}
      <section className="relative bg-white border-b border-slate-200">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] min-h-[88vh]">

          {/* LEFT — Text Content */}
          <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-20 lg:py-24 border-b lg:border-b-0 lg:border-r border-slate-200">

            {/* Store Badge */}
            <div className="inline-flex items-center gap-2 mb-7 w-fit">
              <span className="h-px w-8 bg-[#D4AF37]"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-store-primary">
                Established · Kamareddy · Station Road
              </span>
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="space-y-5"
            >
              <motion.h1
                variants={fadeUp}
                className="text-[2.6rem] sm:text-[3.2rem] font-black leading-[1.1] text-store-primary tracking-tight max-w-lg"
              >
                Sri Thirumala
                <br />
                <span className="text-[#1A1A2E]">General Store</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-slate-600 text-base font-medium leading-relaxed max-w-md"
              >
                Kamareddy's most trusted destination for textbooks, stationery, question banks, engineering references, and school bags — serving students since years.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/books"
                  className="inline-flex items-center gap-2 bg-store-primary hover:bg-store-primary-dark text-white px-6 py-3.5 rounded-lg font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Browse Catalog
                  <ArrowRight className="w-4 h-4 text-store-primary" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-transparent hover:bg-slate-50 text-slate-800 border border-slate-300 px-6 py-3.5 rounded-lg font-bold text-sm transition-all duration-200"
                >
                  Visit Us In-Store
                </Link>
              </motion.div>

              {/* Micro Info Bar */}
              <motion.div
                variants={fadeUp}
                className="pt-8 mt-2 border-t border-slate-100 grid grid-cols-3 gap-4 text-left"
              >
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Products</p>
                  <p className="text-xl font-black text-store-primary mt-0.5">3,500+</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Categories</p>
                  <p className="text-xl font-black text-store-primary mt-0.5">12</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Pickup</p>
                  <p className="text-xl font-black text-store-primary mt-0.5">Same Day</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT — Editorial Image Collage */}
          <div className="relative overflow-hidden bg-[#EAF3FF] flex items-stretch">
            {/* Large background image */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900&auto=format&fit=crop&q=80"
                alt="Bookstore shelves"
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#EAF3FF]/80 to-[#CFE3FF]/60"></div>
            </div>

            {/* Content overlay - editorial grid */}
            <div className="relative z-10 p-8 sm:p-12 flex flex-col justify-between w-full">

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/60 shadow-sm">
                  <span className="text-[9px] font-black text-store-primary uppercase tracking-widest block mb-2">📚 Just In</span>
                  <p className="text-xs font-bold text-slate-800 leading-snug">TSPSC Group-IV<br />2024 Study Guide</p>
                  <p className="text-[10px] text-slate-500 mt-1">Vijeta Publications</p>
                </div>
                <div className="bg-store-primary rounded-xl p-4 border border-store-primary-dark shadow-sm">
                  <span className="text-[9px] font-black text-store-primary uppercase tracking-widest block mb-2">⭐ Bestseller</span>
                  <p className="text-xs font-bold text-white leading-snug">RS Aggarwal<br />Quantitative Aptitude</p>
                  <p className="text-[10px] text-blue-300 mt-1">₹590 · In Stock</p>
                </div>
              </div>

              <div className="my-6 rounded-2xl overflow-hidden shadow-xl border-4 border-white/70 relative" style={{ height: '260px' }}>
                <img
                  src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=700&auto=format&fit=crop&q=80"
                  alt="Inside Sri Thirumala store bookshelves"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-store-primary/70 to-transparent flex items-end p-5">
                  <div>
                    <p className="text-[9px] text-store-primary font-black uppercase tracking-widest">Sri Thirumala General Store</p>
                    <h3 className="text-white font-bold text-base leading-tight mt-1">Station Road, Kamareddy</h3>
                  </div>
                </div>
              </div>

              {/* Bottom: store quick stats */}
              <div className="flex items-center gap-3">
                <div className="bg-white/85 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/50 flex items-center gap-2.5 flex-1">
                  <div className="bg-[#D4AF37]/20 p-1.5 rounded-lg">
                    <Star className="w-4 h-4 text-store-primary fill-store-primary" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold">Rating</p>
                    <p className="text-sm font-black text-slate-900">4.9 / 5.0</p>
                  </div>
                </div>
                <div className="bg-white/85 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/50 flex items-center gap-2.5 flex-1">
                  <div className="bg-emerald-100 p-1.5 rounded-lg">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 font-bold">Verified</p>
                    <p className="text-sm font-black text-slate-900">100% Original</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2 — CATEGORIES (EDITORIAL GRID)
      ═══════════════════════════════════════════════════ */}
      <section className="py-16 px-5 sm:px-8 bg-store-accent border-b border-slate-200/60">
        <div className="max-w-screen-xl mx-auto">
          
          {/* Section Header — Left-aligned, editorial */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-store-primary block mb-2">Shop By Category</span>
              <h2 className="text-2xl sm:text-3xl font-black text-store-primary leading-tight">Academic & Student Essentials</h2>
            </div>
            <Link to="/books" className="shrink-0 text-xs font-bold text-slate-600 hover:text-store-primary transition flex items-center gap-1.5 border-b border-slate-300 pb-0.5 hover:border-store-primary">
              All products <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Categories Grid — uneven 4-col on large, 2-col on mobile */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categoriesList.map((cat, idx) => (
              <Link
                to={cat.route}
                key={idx}
                className="group relative flex flex-col bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-md transition-all duration-250 overflow-hidden"
                style={{ minHeight: idx % 3 === 1 ? '155px' : '135px' }}
              >
                {/* colored accent strip */}
                <div
                  className="absolute top-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-400 rounded-t-xl"
                  style={{ backgroundColor: cat.color }}
                ></div>

                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: cat.bg }}
                >
                  <cat.icon className="w-4.5 h-4.5" style={{ color: cat.color }} />
                </div>
                <h3 className="font-bold text-slate-800 group-hover:text-store-primary text-sm leading-snug transition-colors">{cat.name}</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-1">{cat.count}</p>
                <div className="flex items-center gap-1 mt-auto pt-3 text-[10px] font-black text-slate-400 group-hover:text-store-primary transition-colors">
                  Explore <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 3 — BESTSELLERS (HORIZONTAL SCROLL CAROUSEL)
      ═══════════════════════════════════════════════════ */}
      <section className="py-16 bg-white border-b border-slate-200/60">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-store-primary block mb-2">Most Popular</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1A1A2E] leading-tight">Bestselling Titles</h2>
            </div>
            <Link to="/books" className="shrink-0 text-xs font-bold text-slate-500 hover:text-store-primary transition flex items-center gap-1 border-b border-slate-300 pb-0.5 hover:border-store-primary">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-slate-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : bestSellers.length > 0 ? (
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={20}
              slidesPerView={1.2}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              breakpoints={{
                480: { slidesPerView: 1.8 },
                640: { slidesPerView: 2.2 },
                900: { slidesPerView: 3.2 },
                1200: { slidesPerView: 4 },
              }}
              className="pb-10"
            >
              {bestSellers.map((product) => (
                <SwiperSlide key={product._id} className="h-full py-1">
                  <ProductCard product={product} onQuickView={openQuickView} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} onQuickView={openQuickView} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 4 — WHY SRI THIRUMALA (EDITORIAL 2-COL)
      ═══════════════════════════════════════════════════ */}
      <section className="py-16 px-5 sm:px-8 bg-store-charcoal">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 items-start">

            {/* Left sticky editorial text block */}
            <div className="space-y-5">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-store-primary block">Why Sri Thirumala?</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Why students across Kamareddy choose us
              </h2>
              <div className="h-0.5 w-12 bg-[#D4AF37] rounded"></div>
              <p className="text-blue-200 text-sm leading-relaxed">
                Unlike large e-commerce portals with heavy shipping delays, we hold local inventory of major publishing titles — so you can pick up exactly what you need, the same day.
              </p>

              {/* Store info card */}
              <div className="bg-white/10 border border-white/20 rounded-xl p-5 space-y-4 mt-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-store-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-xs font-bold">Station Road, Kamareddy</p>
                    <p className="text-blue-300 text-[10px]">Telangana — 503111</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-store-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-xs font-bold">+91 99498 86640</p>
                    <p className="text-blue-300 text-[10px]">WhatsApp orders accepted</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-store-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-xs font-bold">9:00 AM — 9:00 PM</p>
                    <p className="text-blue-300 text-[10px]">Open all days including weekends</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 bg-[#D4AF37] hover:bg-[#C09A25] text-store-primary font-black text-xs px-5 py-2.5 rounded-lg transition"
                >
                  Get Directions
                </Link>
                <a
                  href="https://wa.me/918897766640"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#128C7E] hover:bg-[#075E54] text-white font-black text-xs px-5 py-2.5 rounded-lg transition"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>

            {/* Right — advantage checklist grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {advantages.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/8 hover:bg-white/12 border border-white/15 rounded-xl p-5 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-store-primary shrink-0" />
                    <h4 className="text-white font-bold text-sm">{item.title}</h4>
                  </div>
                  <p className="text-blue-200 text-[11px] leading-relaxed pl-6">{item.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 5 — STORE GALLERY (UNEVEN MASONRY-LIKE)
      ═══════════════════════════════════════════════════ */}
      <section className="py-16 px-5 sm:px-8 bg-store-accent border-b border-slate-200/60">
        <div className="max-w-screen-xl mx-auto">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-store-primary block mb-2">Store Gallery</span>
              <h2 className="text-2xl sm:text-3xl font-black text-store-primary">Inside Sri Thirumala Store</h2>
            </div>
            <p className="text-xs text-slate-500 max-w-xs">
              Walk our shelves stocked with the widest selection of academic and stationery materials in Kamareddy.
            </p>
          </div>

          {/* Uneven 3-column grid with different heights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Tall image — left */}
            <div className="relative rounded-2xl overflow-hidden group" style={{ height: '380px' }}>
              <img
                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&auto=format&fit=crop&q=75"
                alt="Bookstore shelves full of textbooks"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div>
                  <span className="text-[9px] font-black text-store-primary uppercase tracking-widest">Textbook Section</span>
                  <p className="text-white text-sm font-bold mt-0.5">1,200+ titles available</p>
                </div>
              </div>
            </div>

            {/* Middle column — two stacked images */}
            <div className="flex flex-col gap-4">
              <div className="relative rounded-2xl overflow-hidden group flex-1" style={{ height: '175px' }}>
                <img
                  src="https://images.unsplash.com/photo-1456735190827-d1262f71b873?w=600&auto=format&fit=crop&q=75"
                  alt="Stationery displays and racks"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent flex items-end p-4">
                  <p className="text-white text-xs font-bold">Stationery Aisle</p>
                </div>
              </div>
              <div className="relative rounded-2xl overflow-hidden group flex-1" style={{ height: '185px' }}>
                <img
                  src="https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=75"
                  alt="Notebook and register stacks"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent flex items-end p-4">
                  <p className="text-white text-xs font-bold">Notebooks & Registers</p>
                </div>
              </div>
            </div>

            {/* Right — medium + accent info card */}
            <div className="flex flex-col gap-4">
              <div className="relative rounded-2xl overflow-hidden group" style={{ height: '240px' }}>
                <img
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=75"
                  alt="School and college bag collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5">
                  <div>
                    <span className="text-[9px] font-black text-store-primary uppercase tracking-widest">Bags Collection</span>
                    <p className="text-white text-sm font-bold mt-0.5">250+ bags in stock</p>
                  </div>
                </div>
              </div>
              {/* Info card */}
              <div className="bg-store-charcoal rounded-2xl p-5 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-[9px] font-black text-store-primary uppercase tracking-widest">Daily Hours</span>
                  <p className="text-white font-bold text-base mt-1.5">9:00 AM — 9:00 PM</p>
                  <p className="text-blue-300 text-[10px] mt-0.5">Open all days, year-round</p>
                </div>
                <Link
                  to="/contact"
                  className="mt-4 inline-flex items-center gap-1.5 text-white/80 hover:text-white text-[10px] font-black uppercase tracking-widest transition"
                >
                  Get Directions <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 6 — QUICK LINKS (EDITORIAL RESOURCES)
      ═══════════════════════════════════════════════════ */}
      <section className="py-14 px-5 sm:px-8 bg-white border-b border-slate-200/60">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-store-primary block mb-2">Academic Catalog</span>
            <h2 className="text-xl sm:text-2xl font-black text-[#1A1A2E]">Popular Sections Right Now</h2>
          </div>

          {/* 4-col editorial cards — unequal visual weight */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border border-slate-200 rounded-xl p-5 hover:border-store-primary/30 hover:bg-store-peach-light transition-all group">
              <span className="inline-block text-[9px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-wider mb-3">🟢 Catalog Update</span>
              <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-store-primary transition">Latest Arrivals</h3>
              <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">New registers, CBSE textbooks, and competitive workbooks cataloged weekly.</p>
              <Link to="/books?sort=newest" className="mt-4 flex items-center gap-1 text-[10px] font-bold text-store-primary hover:gap-2 transition-all">
                Explore <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 hover:border-store-primary/30 hover:bg-store-peach-light transition-all group">
              <span className="inline-block text-[9px] font-black bg-rose-50 text-rose-700 px-2 py-0.5 rounded uppercase tracking-wider mb-3">🔴 Exam Season</span>
              <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-store-primary transition">Exam Prep Picks</h3>
              <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">TSPSC, board guides, and model question banks to secure high marks.</p>
              <Link to="/books?category=Question Banks" className="mt-4 flex items-center gap-1 text-[10px] font-bold text-store-primary hover:gap-2 transition-all">
                View Exam Prep <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 hover:border-store-primary/30 hover:bg-store-peach-light transition-all group">
              <span className="inline-block text-[9px] font-black bg-blue-50 text-blue-700 px-2 py-0.5 rounded uppercase tracking-wider mb-3">🔵 Engineering & Degree</span>
              <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-store-primary transition">Semester Guides</h3>
              <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">B.Tech university math guides, chemistry tables, and degree standard references.</p>
              <Link to="/books?category=Engineering Materials" className="mt-4 flex items-center gap-1 text-[10px] font-bold text-store-primary hover:gap-2 transition-all">
                Browse Semesters <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="border border-slate-200 rounded-xl p-5 hover:border-store-primary/30 hover:bg-store-peach-light transition-all group">
              <span className="inline-block text-[9px] font-black bg-amber-50 text-amber-700 px-2 py-0.5 rounded uppercase tracking-wider mb-3">⭐ Trending</span>
              <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-store-primary transition">Trending Materials</h3>
              <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">RS Aggarwal quant books, Classmate drawing journals, premium double-strap backpacks.</p>
              <Link to="/books" className="mt-4 flex items-center gap-1 text-[10px] font-bold text-store-primary hover:gap-2 transition-all">
                Shop Now <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 7 — CUSTOMER TESTIMONIALS
      ═══════════════════════════════════════════════════ */}
      <section className="py-16 px-5 sm:px-8 bg-store-accent border-b border-slate-200/60">
        <div className="max-w-screen-xl mx-auto">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-store-primary block mb-2">Customer Reviews</span>
              <h2 className="text-2xl sm:text-3xl font-black text-store-primary">Trusted by Parents & Students</h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-store-primary fill-store-primary" />
                ))}
              </div>
              <span className="text-sm font-black text-slate-700">4.9 avg rating</span>
            </div>
          </div>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5500, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 1.5 },
              900: { slidesPerView: 2.2 },
              1200: { slidesPerView: 3 },
            }}
            className="pb-10"
          >
            {reviews.map((review, idx) => (
              <SwiperSlide key={idx}>
                <div className="bg-white border border-slate-200 rounded-xl p-6 text-left h-full flex flex-col justify-between">
                  <div>
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-store-primary fill-store-primary" />
                      ))}
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed italic">"{review.text}"</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-black text-slate-900">{review.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{review.role}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 8 — BOTTOM CTA (EDITORIAL STRIP)
      ═══════════════════════════════════════════════════ */}
      <section className="py-14 px-5 sm:px-8 bg-white">
        <div className="max-w-screen-xl mx-auto">
          <div className="border border-slate-200 rounded-2xl bg-[#F8FAFF] px-8 sm:px-12 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-black text-store-primary uppercase tracking-widest block mb-2">Need help?</span>
              <h3 className="text-xl sm:text-2xl font-black text-store-primary">Don't know which book to pick?</h3>
              <p className="text-slate-500 text-sm mt-1.5 max-w-md">
                WhatsApp or call us with your class, board, and subject — and we'll confirm availability instantly.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <a
                href="https://wa.me/918897766640"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#128C7E] hover:bg-[#075E54] text-white font-bold text-sm px-6 py-3 rounded-lg transition shadow-sm"
              >
                WhatsApp Us
              </a>
              <a
                href="tel:8897766640"
                className="inline-flex items-center gap-2 bg-store-primary hover:bg-store-primary-dark text-white font-bold text-sm px-6 py-3.5 rounded-xl transition shadow-sm min-h-[48px]"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />

    </div>
  );
};

export default HomePage;
