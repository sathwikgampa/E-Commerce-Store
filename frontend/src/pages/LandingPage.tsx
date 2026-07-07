import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Menu, 
  X,
  BookOpen,
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle scroll for nav glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['Home', 'Categories', 'Bestsellers', 'New Arrivals', 'Stationery', 'Offers'];

  return (
    <div className="relative w-screen h-screen bg-[#F8F6F3] overflow-hidden font-['Inter'] flex flex-col">
      
      {/* Fullscreen Video Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video 
          ref={videoRef}
          src="/Video Project 4.mp4"
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Overlay Soft Fade over the video */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(248,246,243,0.50) 0%, rgba(248,246,243,0.15) 40%, rgba(248,246,243,0.30) 100%)'
          }}
        />
        {/* 2% Noise Texture */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.02] mix-blend-overlay z-20"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </div>

      {/* Navigation (Pinned to absolute top of screen) */}
      <header className="absolute top-0 left-0 right-0 z-50 pt-[28px] px-[48px]">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`max-w-[1400px] mx-auto flex items-center justify-between rounded-2xl transition-all duration-400 ${isScrolled ? 'py-3 px-6' : ''}`}
          style={isScrolled ? {
            background: 'rgba(248,246,243,0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(248,246,243,0.4)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          } : {}}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => navigate('/login')}>
            <BookOpen className="w-8 h-8 text-[#102A56]" />
            <div className="flex flex-col">
              <span className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#102A56] leading-none">Sri Thirumala</span>
              <span className="text-[9px] uppercase tracking-widest text-[#B78939] font-semibold mt-1">Book Seller & Stationery</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <button 
                key={item} 
                onClick={() => navigate('/login')}
                className="text-[#505A68] hover:text-[#102A56] text-[15px] font-medium transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Empty div to balance flex-between since icons were removed */}
          <div className="hidden lg:block w-[150px]" />

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden text-[#102A56]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </motion.div>
      </header>

      {/* Hero Content Container (Vertically centered) */}
      <div className="relative w-full flex-grow flex flex-col items-center justify-center z-10">

        {/* Hero Content */}
        <div className="flex flex-col items-center text-center px-4 w-full z-20 mt-[-12vh]">

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-['Cormorant_Garamond'] font-semibold text-[42px] md:text-[64px] lg:text-[88px] text-[#102A56] leading-[0.95] tracking-tight"
            style={{ marginBottom: '26px' }}
          >
            Sri Thirumala
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="flex items-center gap-4"
            style={{ marginBottom: '34px' }}
          >
            <div className="w-12 h-[1px] bg-[#B78939] opacity-40" />
            <h2 className="text-[15px] text-[#B78939] tracking-[0.35em] uppercase font-medium">
              Book Seller & Stationery
            </h2>
            <div className="w-12 h-[1px] bg-[#B78939] opacity-40" />
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.4 }}
            className="text-[20px] text-[#102A56] max-w-[580px] font-medium opacity-90"
            style={{ lineHeight: 1.65, marginBottom: '40px' }}
          >
            Discover thousands of books, stationery essentials and study materials—all in one place.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center gap-[18px]"
          >
            <button 
              onClick={() => navigate('/login')}
              className="h-[58px] w-[220px] rounded-xl bg-[#102A56] hover:bg-[#163E7A] text-[#F8F6F3] font-medium text-[16px] transition-all flex items-center justify-center"
              style={{ boxShadow: '0 20px 50px rgba(16,42,86,0.10)' }}
            >
              Explore Store <span className="ml-2">→</span>
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="h-[58px] w-[180px] rounded-xl bg-[#F8F6F3] text-[#102A56] font-medium text-[16px] transition-all flex items-center justify-center"
              style={{ 
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 20px 60px rgba(16,42,86,0.12)' 
              }}
            >
              Sign In
            </button>
          </motion.div>

        </div>

      </div>
    </div>
  );
};

export default LandingPage;
