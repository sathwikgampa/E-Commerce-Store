import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SoftAurora from '../components/reactbits/SoftAurora';
import Dock from '../components/reactbits/Dock';

// ─── Icons ──────────────────────────────────────────────────────────────────
const BookOpenIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const BooksIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.5 2 2 0 0 1 3.59 1.32h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.08 6.08l1.76-1.76a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

// ─── Portal selection modal ──────────────────────────────────────────────────
const PortalModal: React.FC<{ onClose: () => void; onUserLogin: () => void; onAdminLogin: () => void }> = ({
  onClose, onUserLogin, onAdminLogin
}) => (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'rgba(10,61,145,0.15)' }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Card */}
      <motion.div
        className="relative z-10 rounded-3xl p-8 w-full max-w-md mx-4 overflow-hidden"
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 60px rgba(10,61,145,0.15), 0 8px 24px rgba(0,0,0,0.08)',
        }}
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        {/* Blue top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0A3D91] via-[#1565C0] to-[#D4AF37]" />

        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg text-white"
            style={{ background: 'linear-gradient(135deg, #0A3D91 0%, #1565C0 100%)' }}
          >
            <BookOpenIcon />
          </div>
          <h2 className="text-2xl font-bold text-[#0A3D91] mb-1">Welcome Back</h2>
          <p className="text-slate-500 text-sm">Choose how you'd like to sign in</p>
        </div>

        <div className="space-y-3">
          {/* User Login */}
          <motion.button
            onClick={onUserLogin}
            whileHover={{ scale: 1.02, backgroundColor: '#EFF6FF' }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl border-2 transition-all group"
            style={{ background: '#F8FAFF', borderColor: '#BFDBFE' }}
          >
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl shadow-md shrink-0 text-white"
              style={{ background: 'linear-gradient(135deg, #0A3D91 0%, #1976D2 100%)' }}
            >
              <UserIcon />
            </div>
            <div className="text-left">
              <div className="text-[#0A3D91] font-semibold text-sm">Customer Login</div>
              <div className="text-slate-400 text-xs mt-0.5">Browse books, manage orders & wishlist</div>
            </div>
            <svg className="w-4 h-4 text-slate-300 group-hover:text-[#0A3D91] ml-auto transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>

          {/* Admin Login */}
          <motion.button
            onClick={onAdminLogin}
            whileHover={{ scale: 1.02, backgroundColor: '#FFFBEB' }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl border-2 transition-all group"
            style={{ background: '#FEFCE8', borderColor: '#FDE68A' }}
          >
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl shadow-md shrink-0 text-white"
              style={{ background: 'linear-gradient(135deg, #B8860B 0%, #D4AF37 100%)' }}
            >
              <ShieldIcon />
            </div>
            <div className="text-left">
              <div className="text-[#92400E] font-semibold text-sm">Admin Portal</div>
              <div className="text-slate-400 text-xs mt-0.5">Manage inventory, orders & analytics</div>
            </div>
            <svg className="w-4 h-4 text-slate-300 group-hover:text-[#D4AF37] ml-auto transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors p-1"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

// ─── Animated number counter ─────────────────────────────────────────────────
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const startTime = performance.now();
        const tick = (now: number) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * end));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

const StatCard: React.FC<{ value: number; suffix?: string; label: string; delay: number }> = ({ value, suffix = '', label, delay }) => {
  const { count, ref } = useCounter(value);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      className="text-center"
    >
      <div className="text-4xl font-black text-[#0A3D91] mb-1">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-slate-500 text-sm font-medium">{label}</div>
    </motion.div>
  );
};

// ─── Main Landing Page ───────────────────────────────────────────────────────
const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPortalModal, setShowPortalModal] = useState(false);

  const dockItems = [
    { icon: <HomeIcon />, label: 'Home', onClick: () => navigate('/home') },
    { icon: <BooksIcon />, label: 'Browse Books', onClick: () => navigate('/books') },
    { icon: <UserIcon />, label: 'Login', onClick: () => setShowPortalModal(true) },
    { icon: <ShieldIcon />, label: 'Admin', onClick: () => navigate('/admin/login') },
    { icon: <PhoneIcon />, label: 'Contact', onClick: () => navigate('/contact') },
  ];

  const features = [
    { icon: '📚', title: 'Vast Collection', desc: 'Textbooks, novels, stationery & more' },
    { icon: '⚡', title: 'Fast Delivery', desc: 'Quick dispatch from Kamareddy store' },
    { icon: '🏆', title: 'Best Prices', desc: 'Competitive pricing on all items' },
    { icon: '🎓', title: 'Exam Ready', desc: 'Competitive exam books & question banks' },
  ];

  return (
    <div className="landing-page relative min-h-screen overflow-hidden" style={{ background: '#F0F4FF' }}>

      {/* ── Aurora — vivid blue & gold, visible on white ── */}
      <div className="absolute inset-0 z-0">
        <SoftAurora
          speed={0.4}
          scale={1.4}
          brightness={1.6}
          color1="#0A3D91"
          color2="#D4AF37"
          noiseFrequency={1.8}
          noiseAmplitude={1.1}
          bandHeight={0.5}
          bandSpread={0.9}
          octaveDecay={0.08}
          layerOffset={1.0}
          colorSpeed={0.6}
          enableMouseInteraction={true}
          mouseInfluence={0.15}
        />
      </div>

      {/* ── White fade — keeps text readable over the aurora ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(240,244,255,0.55) 0%, rgba(240,244,255,0.2) 40%, rgba(240,244,255,0.5) 80%, rgba(240,244,255,0.85) 100%)',
        }}
      />

      {/* ── Subtle dot grid texture ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, #0A3D9120 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Hero Content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pb-32 pt-16">

        {/* Brand badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8 tracking-wider uppercase"
          style={{
            background: 'rgba(10,61,145,0.08)',
            border: '1px solid rgba(10,61,145,0.2)',
            color: '#0A3D91',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Kamareddy's Premier Book Store
        </motion.div>

        {/* Store icon + Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-center mb-6"
        >
          {/* Book icon badge */}
          <div className="flex justify-center mb-5">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl text-[#D4AF37]"
              style={{
                background: 'linear-gradient(135deg, #0A3D91 0%, #1565C0 100%)',
                boxShadow: '0 12px 40px rgba(10,61,145,0.3), 0 0 0 4px rgba(10,61,145,0.08)',
              }}
            >
              <span className="material-symbols-outlined text-4xl font-black">menu_book</span>
            </div>
          </div>

          <h1
            className="text-6xl sm:text-7xl md:text-8xl font-black leading-none tracking-tighter mb-3"
            style={{ color: '#0A3D91' }}
          >
            Sri Thirumala
          </h1>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[#B8860B] text-sm font-bold uppercase tracking-[0.3em]">
              Book Seller & Stationery
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>

          <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed font-light">
            Discover thousands of books, stationery essentials, and study materials — all in one place.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-wrap items-center gap-4 justify-center mb-16"
        >
          {/* Primary — Royal Blue */}
          <motion.button
            onClick={() => navigate('/home')}
            whileHover={{ scale: 1.05, boxShadow: '0 12px 32px rgba(10,61,145,0.4)' }}
            whileTap={{ scale: 0.97 }}
            id="landing-enter-btn"
            className="px-8 py-3.5 rounded-xl text-white font-bold text-sm tracking-wide transition-all"
            style={{
              background: 'linear-gradient(135deg, #0A3D91 0%, #1565C0 100%)',
              boxShadow: '0 6px 20px rgba(10,61,145,0.3)',
            }}
          >
            Explore Store →
          </motion.button>

          {/* Secondary — Blue outline */}
          <motion.button
            onClick={() => setShowPortalModal(true)}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(10,61,145,0.06)' }}
            whileTap={{ scale: 0.97 }}
            id="landing-login-btn"
            className="px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all"
            style={{
              color: '#0A3D91',
              border: '2px solid rgba(10,61,145,0.3)',
              background: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(8px)',
            }}
          >
            Sign In
          </motion.button>
        </motion.div>

        {/* Stats Row — white card strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="rounded-2xl px-10 py-6 mb-16 flex gap-12 shadow-md"
          style={{
            background: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(10,61,145,0.1)',
          }}
        >
          <StatCard value={5000} suffix="+" label="Books Available" delay={1.1} />
          <div className="w-px bg-slate-200 self-stretch" />
          <StatCard value={15} suffix="+" label="Years Experience" delay={1.2} />
          <div className="w-px bg-slate-200 self-stretch" />
          <StatCard value={10000} suffix="+" label="Happy Customers" delay={1.3} />
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(10,61,145,0.15)' }}
              className="rounded-2xl p-4 text-center transition-all cursor-default"
              style={{
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(10,61,145,0.12)',
                boxShadow: '0 4px 16px rgba(10,61,145,0.06)',
              }}
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="text-[#0A3D91] text-xs font-bold mb-1">{f.title}</div>
              <div className="text-slate-400 text-[11px] leading-relaxed">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Dock Navigation ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center">
        <Dock
          items={dockItems}
          panelHeight={68}
          baseItemSize={52}
          magnification={76}
          distance={180}
        />
      </div>

      {/* ── Portal Modal ── */}
      {showPortalModal && (
        <PortalModal
          onClose={() => setShowPortalModal(false)}
          onUserLogin={() => { setShowPortalModal(false); navigate('/login'); }}
          onAdminLogin={() => { setShowPortalModal(false); navigate('/admin/login'); }}
        />
      )}
    </div>
  );
};

export default LandingPage;
