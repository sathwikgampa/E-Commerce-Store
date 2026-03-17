import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
              <span className="material-symbols-outlined text-sm">school</span>
              Empowering Learners
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-black dark:text-white leading-[1.1] tracking-tight">
              Your Academic Journey, <span className="text-primary">Simplified.</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
              Premium textbooks, artisan stationery, and essential exam prep materials curated for the modern student. Achieve excellence with the best resources at your fingertips.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/books" className="bg-primary hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                Shop Now
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link to="/books" className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-xl font-bold text-lg text-charcoal shadow-sm dark:text-white hover:bg-slate-50 hover:border-slate-300 transition-all">
                View Catalog
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl"></div>
            <div className="aspect-[4/3] rounded-3xl bg-slate-200 dark:bg-slate-800 overflow-hidden shadow-2xl relative">
              <img alt="Composition of textbooks and premium pens" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7SsVlFL4LvCEXfHGOfxfU1LGpzossLLfoi42X_nlS6Ze5EsHwx6q1tBhqbS3KrmVpzgU7Pa5I0uEGUGF8Oh_DgiW5UChNmyHXTvfuApv1HwqdKXsgrfv2jof07Ekr_NAu4TorMYgFFtOi-oSewEds00ZW22DY3cQpH2eJC4c2bNy75EWyvaHSZuEikxIxIJ2vI_Td5JhNXEG4lSRBCrR3scwgbc5aHDcu_vk-esPi4HVzQHZjk3gKkqQxl7NhJaPNAnmKYVvv0NPm" />
              <div className="absolute bottom-6 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20">
                <div className="flex gap-1 text-primary">
                  <span className="material-symbols-outlined fill-1">star</span>
                  <span className="material-symbols-outlined fill-1">star</span>
                  <span className="material-symbols-outlined fill-1">star</span>
                  <span className="material-symbols-outlined fill-1">star</span>
                  <span className="material-symbols-outlined fill-1">star_half</span>
                </div>
                <p className="text-xs font-bold text-charcoal dark:text-white mt-1">4.9/5 Student Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-12 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-white shadow-sm border border-slate-100 dark:bg-slate-800/50 transition-colors hover:border-primary/30 hover:shadow-md group">
              <div className="bg-slate-50 border border-slate-100 dark:bg-slate-800 p-3 rounded-xl shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-3xl">local_shipping</span>
              </div>
              <div>
                <h3 className="font-bold text-charcoal dark:text-white">Free Shipping</h3>
                <p className="text-sm text-slate-500">Orders over $50</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-white shadow-sm border border-slate-100 dark:bg-slate-800/50 transition-colors hover:border-primary/30 hover:shadow-md group">
              <div className="bg-slate-50 border border-slate-100 dark:bg-slate-800 p-3 rounded-xl shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-3xl">verified</span>
              </div>
              <div>
                <h3 className="font-bold text-charcoal dark:text-white">Official Partner</h3>
                <p className="text-sm text-slate-500">Authorized Distributor</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-2xl bg-white shadow-sm border border-slate-100 dark:bg-slate-800/50 transition-colors hover:border-primary/30 hover:shadow-md group">
              <div className="bg-slate-50 border border-slate-100 dark:bg-slate-800 p-3 rounded-xl shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-3xl">support_agent</span>
              </div>
              <div>
                <h3 className="font-bold text-charcoal dark:text-white">24/7 Support</h3>
                <p className="text-sm text-slate-500">Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now Carousel */}
      <section className="py-20 bg-background-light dark:bg-background-dark px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black text-charcoal dark:text-white">Trending Now</h2>
              <p className="text-slate-500 mt-2">Curated selection of our most popular items this week.</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-primary hover:text-white transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="p-2 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-primary hover:text-white transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          
          <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-8 px-2 -mx-2">
            {/* Product 1 */}
            <div className="product-card flex-shrink-0 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 p-4">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 mb-4">
                <img alt="Advanced Calculus Textbook" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJM1XzUdDNxTkQ3Za_RaFvWWwrvFN1vDoHph0BndkxKQWaxZj8gaLhftxFpoEfWe_DUlt6ZEqK1YIfnzVrv1nAqx1kQWZD3EDcYoQbtE63UdugQ0xcAsftO6kUVYe0YGVzBkuOF1bXTfPE1apZ4q_SfJVNwZ3coWy2jGoq8moyu12tJ8kmK5XyVmHeRCNDuwj6-NPi4BOj9afV0OddN6keBRAa4iqfO-scWnGICc4T0bJo540sFO1sTu7jimTSJfgJtvVWPZO6ixUn" />
                <button className="cart-button absolute bottom-3 left-3 right-3 bg-primary text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 opacity-0 translate-y-2 transition-all duration-300">
                  <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                  Add to Cart
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-charcoal dark:text-white leading-tight">Advanced Calculus: Concepts &amp; Tools</h3>
                  <div className="flex items-center gap-1 text-amber-500">
                    <span className="material-symbols-outlined text-sm fill-1">star</span>
                    <span className="text-xs font-bold">4.8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="px-3 py-1 bg-charcoal text-white rounded-full text-sm font-bold">$89.99</span>
                  <span className="text-xs text-slate-400 font-medium">Textbooks</span>
                </div>
              </div>
            </div>

            {/* Product 2 */}
            <div className="product-card flex-shrink-0 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 p-4">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 mb-4">
                <img alt="Premium Fountain Pens" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwIN8fiEkSEHUX-Y3sJfBOqdfc37LAa9E-KPiR06SE3AgAq5oy5rr10Qw9ULycZLuY5kt2MDOQCVJwRnbkjrpeOReVlxRX28PdbmigvpLVrjNiPl8Vyqb_v5i15QA6BJmzB01ve7WB71dpfHSt-hnpbmU7Y3mKKJcuRc-3ofUEkj5TwQMqwOOm6Y2eKY-P9U4dsuJMsU1aKT8ArsxayDJt_jO92iDTfg4Ll7mY1b-QlKOwku_1Cv7lAudEYXnIIBsEMRoIFQBfu18r" />
                <button className="cart-button absolute bottom-3 left-3 right-3 bg-primary text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 opacity-0 translate-y-2 transition-all duration-300">
                  <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                  Add to Cart
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-charcoal dark:text-white leading-tight">Artisan Scholar Fountain Pen Set</h3>
                  <div className="flex items-center gap-1 text-amber-500">
                    <span className="material-symbols-outlined text-sm fill-1">star</span>
                    <span className="text-xs font-bold">4.9</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="px-3 py-1 bg-charcoal text-white rounded-full text-sm font-bold">$45.00</span>
                  <span className="text-xs text-slate-400 font-medium">Stationery</span>
                </div>
              </div>
            </div>

            {/* Product 3 */}
            <div className="product-card flex-shrink-0 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 p-4">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 mb-4">
                <img alt="Lab Essentials Kit" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtBH7wYH38eP_5DH_N38R6jdYS1InUEestV2U_nxMJzfPq-yxWwMg-Zo4NEDTmjsImhu05WfkvupwEOFKkxQbnX7XaLz_PLn71hMDuCrtX9scPt3GH8Tn5n7a2hb8MuV9BbDxSJK27w4GC-OJRi0p5ko2GtJ2S79rTFLolOYdaBSQYcIGYwW7ico258H0EmyGRlFsgQv59RpY2NdLk2AM15bQmJEZEK7o9w4rsd0AoTVJSky7tUmRgXS40LCspq3XKT4f5wLuRgtH5" />
                <button className="cart-button absolute bottom-3 left-3 right-3 bg-primary text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 opacity-0 translate-y-2 transition-all duration-300">
                  <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                  Add to Cart
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-charcoal dark:text-white leading-tight">Advanced Lab Essentials Kit</h3>
                  <div className="flex items-center gap-1 text-amber-500">
                    <span className="material-symbols-outlined text-sm fill-1">star</span>
                    <span className="text-xs font-bold">4.7</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="px-3 py-1 bg-charcoal text-white rounded-full text-sm font-bold">$12.50</span>
                  <span className="text-xs text-slate-400 font-medium">Exams</span>
                </div>
              </div>
            </div>

            {/* Product 4 */}
            <div className="product-card flex-shrink-0 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 p-4">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 mb-4">
                <img alt="Graphing Calculator" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHPBu-lKLpVraF8lQiWuRJ08gqy-INTXWKjx0Fgg4wGs9qqtgRfendAmD68xV7iV1OZAHRFP2VXGv43Ms-7LlgbPm5IfpsvPwdBsP0Ug0CQ_S-IdmyEHvF6eNlsJ3QuwDlBNaq9RrtGqnHn3ljJaLHxmZPDyORvcyMtNPWiLBn--zta9Q0PqjcXmxP4umC-K4tjfxis_pHa9n03GHcmqZ9GP1MTjT3ODv5KGPqk_f0PiEkRZhGilHbw0dKXhMbFFIKoY7oqvvI4wus" />
                <button className="cart-button absolute bottom-3 left-3 right-3 bg-primary text-white py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 opacity-0 translate-y-2 transition-all duration-300">
                  <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                  Add to Cart
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-charcoal dark:text-white leading-tight">Pro Graphing Calculator X-200</h3>
                  <div className="flex items-center gap-1 text-amber-500">
                    <span className="material-symbols-outlined text-sm fill-1">star</span>
                    <span className="text-xs font-bold">4.9</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="px-3 py-1 bg-charcoal text-white rounded-full text-sm font-bold">$129.00</span>
                  <span className="text-xs text-slate-400 font-medium">Tech</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
