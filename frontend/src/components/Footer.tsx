import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, MessageSquare, ExternalLink, Globe } from 'lucide-react';
import { toast } from 'sonner';

const Footer: React.FC = () => {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for subscribing to academic updates!');
  };

  return (
    <footer className="bg-store-charcoal text-slate-400 pt-16 pb-10 border-t border-store-charcoal-light text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-slate-800/60">
          
          {/* Column 1: Store Intro (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2.5 text-white">
              <div className="bg-store-primary p-2.5 rounded-xl border border-store-charcoal-light shadow-md">
                <span className="material-symbols-outlined text-2xl font-black text-white">menu_book</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white leading-none">Sri Thirumala</span>
                <span className="text-[9px] font-bold text-store-primary uppercase tracking-widest leading-none mt-1">Book Seller & Stationery</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-semibold">
              Serving the student community in Kamareddy for years with genuine textbooks, competitive test materials, premium classmate notebooks, school/college bags, and custom stationery tools.
            </p>
            
            {/* Quick Contact Icons */}
            <div className="flex gap-3">
              <a 
                href="https://wa.me/918897766640" 
                target="_blank" 
                rel="noreferrer" 
                className="p-3 bg-store-charcoal-light hover:bg-[#075E54] text-slate-300 hover:text-white rounded-xl transition-all duration-300 border border-slate-800 flex items-center justify-center min-w-[48px] min-h-[48px]"
                title="Chat on WhatsApp"
              >
                <MessageSquare className="w-4.5 h-4.5" />
              </a>
              <a 
                href="tel:8897766640" 
                className="p-3 bg-store-charcoal-light hover:bg-store-primary hover:text-white rounded-xl text-slate-300 transition-all duration-300 border border-slate-800 flex items-center justify-center min-w-[48px] min-h-[48px]"
                title="Call Support"
              >
                <Phone className="w-4.5 h-4.5" />
              </a>
              <a 
                href="https://maps.google.com/maps?q=Station%20Road,%20Kamareddy%20-%20503111" 
                target="_blank" 
                rel="noreferrer" 
                className="p-3 bg-store-charcoal-light hover:bg-store-primary hover:text-white rounded-xl text-slate-300 transition-all duration-300 border border-slate-800 flex items-center justify-center min-w-[48px] min-h-[48px]"
                title="View on Google Maps"
              >
                <ExternalLink className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold mb-6 text-xs tracking-wider uppercase">Categories</h4>
            <ul className="space-y-3.5 text-xs font-semibold">
              <li><Link className="hover:text-store-primary transition-colors" to="/books?category=Textbooks">Textbooks</Link></li>
              <li><Link className="hover:text-store-primary transition-colors" to="/books?category=Notebooks">Notebooks</Link></li>
              <li><Link className="hover:text-store-primary transition-colors" to="/books?category=Stationery">Stationery</Link></li>
              <li><Link className="hover:text-store-primary transition-colors" to="/books?category=School Bags">School Bags</Link></li>
              <li><Link className="hover:text-store-primary transition-colors" to="/books?category=College Bags">College Bags</Link></li>
              <li><Link className="hover:text-store-primary transition-colors" to="/books?category=Question Banks">Question Banks</Link></li>
            </ul>
          </div>
          
          {/* Column 3: Contact & Info (3 cols) */}
          <div className="lg:col-span-3 space-y-5">
            <h4 className="text-white font-bold mb-6 text-xs tracking-wider uppercase">Contact Details</h4>
            
            <div className="flex items-start gap-3 text-xs">
              <MapPin className="w-4.5 h-4.5 text-store-primary shrink-0" />
              <div>
                <p className="text-white font-bold">Sri Thirumala General Store</p>
                <p className="text-slate-400 mt-1.5 leading-relaxed font-semibold">
                  Station Road, Kamareddy,<br />
                  Telangana - 503111
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-xs pt-2">
              <Phone className="w-4.5 h-4.5 text-store-primary shrink-0" />
              <div>
                <p className="text-slate-450 font-semibold">Store Support</p>
                <p className="text-white font-black mt-1 text-sm">+91 99498 86640</p>
              </div>
            </div>
          </div>
          
          {/* Column 4: Maps & Newsletter (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase">Store Location Map</h4>
            
            {/* Google Map Embed */}
            <div className="w-full h-32 rounded-xl overflow-hidden shadow-inner border border-slate-800 relative bg-slate-950 group">
              <iframe 
                title="Sri Thirumala Store Map"
                src="https://maps.google.com/maps?q=Station%20Road,%20Kamareddy%20-%20503111&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                className="w-full h-full border-none filter invert contrast-110 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                allowFullScreen={true}
                loading="lazy"
              ></iframe>
            </div>

            {/* Newsletter Subscription */}
            <form onSubmit={handleSubscribe} className="space-y-2">
              <p className="text-[10px] text-slate-400 font-bold leading-normal">Receive updates on exam preparation guides & syllabus materials.</p>
              <div className="flex gap-2">
                <input 
                  required
                  className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-xs focus:ring-1 focus:ring-store-primary focus:outline-none text-white placeholder:text-slate-655 flex-grow font-semibold" 
                  placeholder="Your Email" 
                  type="email" 
                />
                <button type="submit" className="bg-store-primary hover:bg-store-primary-dark text-white font-bold px-4 py-2.5 text-xs rounded-lg border border-store-primary hover:border-store-primary-dark transition-all shrink-0">
                  Join
                </button>
              </div>
            </form>
          </div>
          
        </div>
        
        {/* Footer Bottom */}
        <div className="mt-10 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-500 font-bold gap-4">
          <p>&copy; {new Date().getFullYear()} Sri Thirumala General Store. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/contact" className="hover:text-store-primary transition-colors">Store Directions</Link>
            <a href="tel:8897766640" className="hover:text-store-primary transition-colors">Call Owner</a>
            <Link to="/books" className="hover:text-store-primary transition-colors">Browse Stock</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
