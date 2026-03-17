import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-charcoal text-slate-400 py-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-white">
            <div className="bg-primary p-1 rounded-lg">
              <span className="material-symbols-outlined text-white">auto_stories</span>
            </div>
            <span className="text-xl font-black">EduStore</span>
          </div>
          <p className="text-sm leading-relaxed">
            Helping the next generation of thinkers, creators, and innovators reach their full potential through high-quality academic tools.
          </p>
          <div className="flex gap-4">
            <a className="hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">social_leaderboard</span></a>
            <a className="hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">alternate_email</span></a>
            <a className="hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">share</span></a>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm">
            <li><a className="hover:text-white transition-colors" href="#">Track Order</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Return Policy</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Student Discount</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Gift Cards</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Resources</h4>
          <ul className="space-y-4 text-sm">
            <li><a className="hover:text-white transition-colors" href="#">Study Guides</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Partner Schools</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Affiliate Program</a></li>
            <li><a className="hover:text-white transition-colors" href="#">Exam Schedules</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6">Stay Updated</h4>
          <p className="text-sm mb-4">Subscribe for offers and study tips.</p>
          <div className="flex flex-col gap-2">
            <input className="bg-slate-800 border-none rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary text-white placeholder:text-slate-500" placeholder="Email address" type="email" />
            <button className="bg-primary text-white font-bold py-2 rounded-lg hover:bg-red-700 transition-colors">Subscribe</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-slate-800 text-xs text-center">
        &copy; 2024 EduStore Inc. All rights reserved. Designed for Excellence.
      </div>
    </footer>
  );
};

export default Footer;
