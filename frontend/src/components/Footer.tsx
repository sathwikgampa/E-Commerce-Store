import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, Phone, Clock } from 'lucide-react';
import { useProducts } from '../api/queries';
import { STORE, catalogPath, summarizeCategories } from './landing/landingData';
import { VenkateshwaraNamamIcon } from './icons/VenkateshwaraIcons';

// Shared by the landing page and the storefront shell.
const linkCls =
  'rounded-sm text-[14px] text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

const Footer: React.FC = () => {
  const { data: products = [] } = useProducts();
  const categories = useMemo(() => summarizeCategories(products).slice(0, 6), [products]);

  return (
    <footer className="bg-store-charcoal text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Store information
      </h2>
      <div className="mx-auto max-w-store px-5 pb-10 pt-14 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/15">
                <VenkateshwaraNamamIcon className="h-6 w-6" />
              </span>
              <div>
                <p className="font-serif text-2xl font-semibold tracking-tight">Sri Thirumala</p>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">
                  Books &amp; Stationery · Kamareddy
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed text-white/70">
              Textbooks, exam guides, notebooks and school bags for students in Kamareddy — genuine
              publisher editions, with store pickup on Station Road.
            </p>
          </div>

          {/* Shop */}
          <nav aria-label="Shop categories" className="lg:col-span-3">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/55">Shop</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link to="/books" className={linkCls}>
                  All products
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link to={catalogPath({ category: cat.name })} className={linkCls}>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Help */}
          <nav aria-label="Help and accounts" className="lg:col-span-2">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/55">Help</p>
            <ul className="mt-4 space-y-2.5">
              <li><Link to="/contact" className={linkCls}>Contact &amp; directions</Link></li>
              <li><Link to="/blog" className={linkCls}>Study blog</Link></li>
              <li><Link to="/dashboard" className={linkCls}>My account</Link></li>
              <li><Link to="/cart" className={linkCls}>Cart</Link></li>
              <li><Link to="/portal" className={linkCls}>Student &amp; institution portal</Link></li>
            </ul>
          </nav>

          {/* Visit */}
          <div className="lg:col-span-3">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/55">Visit</p>
            <ul className="mt-4 space-y-3.5 text-[14px] text-white/75">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-store-coral" aria-hidden="true" />
                <a href={STORE.mapsHref} target="_blank" rel="noreferrer" className={linkCls}>
                  {STORE.address}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-store-coral" aria-hidden="true" />
                <span>Open {STORE.hours}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-store-coral" aria-hidden="true" />
                <a href={STORE.phoneHref} className={linkCls}>
                  {STORE.phoneDisplay}
                </a>
              </li>
            </ul>
            <a
              href={STORE.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg border border-white/20 px-4 text-[14px] font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Ask on WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[13px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Sri Thirumala General Store. All rights reserved.</p>
          <Link to="/admin/login" className={linkCls.replace('text-[14px] text-white/70', 'text-[13px] text-white/50')}>
            Staff sign in
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
