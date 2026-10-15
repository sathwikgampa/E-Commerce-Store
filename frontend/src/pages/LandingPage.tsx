import React, { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MotionConfig, motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, MessageCircle, Navigation, Phone } from 'lucide-react';

import Footer from '../components/Footer';
import LandingNav from '../components/landing/LandingNav';
import LandingSearch from '../components/landing/LandingSearch';
import ShelfProductCard from '../components/landing/ShelfProductCard';
import {
  CATEGORY_NOTES,
  EXAM_CATEGORIES,
  STORE,
  catalogPath,
  focusRing,
  formatPrice,
  pickProducts,
  summarizeCategories,
} from '../components/landing/landingData';
import { useProducts } from '../api/queries';
import { Product } from '../types';

const container = 'mx-auto w-full max-w-[1320px] px-5 sm:px-8 lg:px-12';
const sectionTitle = 'font-serif text-[32px] font-semibold leading-[1.05] tracking-[-0.03em] text-ink sm:text-[40px] lg:text-[46px]';
const primaryButton = `inline-flex h-[52px] items-center justify-center gap-2 rounded-lg bg-ember px-7 text-[15px] font-medium text-white transition-colors hover:bg-ember-dark ${focusRing}`;
const textLink = `inline-flex items-center gap-1.5 rounded-sm text-[15px] font-medium text-ink underline-offset-4 hover:underline ${focusRing}`;

const reveal = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const HeroTile: React.FC<{ product?: Product; className: string; eager?: boolean; caption?: boolean }> = ({
  product,
  className,
  eager = false,
  caption = false,
}) => {
  if (!product) return <div className={`${className} rounded-2xl bg-paper-deep`} aria-hidden="true" />;
  return (
    <Link
      to={`/book/${product._id}`}
      className={`${className} group block overflow-hidden rounded-2xl bg-paper-deep ${focusRing}`}
      aria-label={`${product.title}, ${formatPrice(product.price)}`}
    >
      <img
        src={product.image}
        alt=""
        width={1024}
        height={1024}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.02]"
      />
      {caption && (
        <span className="absolute bottom-3 right-3 hidden max-w-[62%] rounded-xl bg-paper/95 px-4 py-3 text-left sm:block lg:bottom-4 lg:right-4">
          <span className="line-clamp-2 text-[14px] font-medium leading-snug text-ink">{product.title}</span>
          <span className="mt-0.5 block truncate text-[13px] text-ink-muted">
            {product.author} · <span className="text-ink">{formatPrice(product.price)}</span>
          </span>
        </span>
      )}
    </Link>
  );
};

const ProductSkeleton: React.FC = () => (
  <div aria-hidden="true">
    <div className="aspect-square rounded-xl bg-paper-deep motion-safe:animate-pulse" />
    <div className="mt-4 h-3 w-1/3 rounded bg-paper-deep" />
    <div className="mt-3 h-4 w-5/6 rounded bg-paper-deep" />
    <div className="mt-2 h-4 w-1/2 rounded bg-paper-deep" />
  </div>
);

const LandingPage: React.FC = () => {
  const { data: products = [], isLoading } = useProducts();
  const searchRef = useRef<HTMLInputElement>(null);

  const [heroMain, heroSecondary] = useMemo(() => pickProducts(products, ['eng-1', 'nb-1'], 2), [products]);
  const categories = useMemo(() => summarizeCategories(products), [products]);
  const topRated = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating).slice(0, 8),
    [products]
  );
  const examPicks = useMemo(
    () => products.filter((p) => EXAM_CATEGORIES.includes(p.category)).sort((a, b) => b.rating - a.rating).slice(0, 3),
    [products]
  );

  const focusSearch = () => {
    const input = searchRef.current;
    if (!input) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    input.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    input.focus({ preventScroll: true });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="landing relative isolate min-h-screen bg-paper font-sans text-ink antialiased">
        {/* Warm light falling across the top of the page, behind nav and hero */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[1100px]"
          style={{
            background:
              'radial-gradient(900px 560px at 88% 8%, #F6E3D1 0%, rgba(247,245,242,0) 62%), radial-gradient(700px 480px at 4% 70%, #EFE8DF 0%, rgba(247,245,242,0) 70%)',
            maskImage: 'linear-gradient(to bottom, #000 65%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, #000 65%, transparent)',
          }}
        />

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>

        <LandingNav categories={categories} onSearchRequest={focusSearch} />

        <main id="main-content">
          {/* ── Hero ───────────────────────────────────────────── */}
          <section aria-labelledby="hero-title" className={`${container} pb-14 pt-6 sm:pt-10 lg:pb-20 lg:pt-12`}>
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-6 xl:col-span-5">
                <motion.p
                  {...reveal}
                  transition={{ duration: 0.5 }}
                  className="text-[12px] font-medium uppercase tracking-[0.2em] text-ink-muted"
                >
                  Station Road, Kamareddy
                </motion.p>
                <motion.h1
                  {...reveal}
                  transition={{ duration: 0.6, delay: 0.05 }}
                  id="hero-title"
                  className="mt-5 text-balance font-serif text-[42px] font-semibold leading-[0.98] tracking-[-0.04em] text-ink min-[400px]:text-[48px] sm:text-[64px] lg:text-[72px] xl:text-[84px]"
                >
                  From first class to final exam<span className="text-ember">.</span>
                </motion.h1>
                <motion.p
                  {...reveal}
                  transition={{ duration: 0.6, delay: 0.12 }}
                  className="mt-6 max-w-[34rem] text-[17px] leading-[1.65] text-ink-muted"
                >
                  NCERT and State Board textbooks, VGS question banks, engineering references, Classmate notebooks and
                  school bags. Order online and collect from our counter, or have it delivered anywhere in Kamareddy.
                </motion.p>
                <motion.div
                  {...reveal}
                  transition={{ duration: 0.6, delay: 0.18 }}
                  className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4"
                >
                  <Link to="/books" className={primaryButton}>
                    Shop the catalog
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <a href="#categories" className={textLink}>
                    Browse by category
                  </a>
                </motion.div>
                <motion.ul
                  {...reveal}
                  transition={{ duration: 0.6, delay: 0.24 }}
                  className="mt-10 flex max-w-[34rem] flex-wrap gap-x-8 gap-y-2 border-t border-line pt-5 text-[13px] text-ink-muted"
                >
                  <li>Free store pickup</li>
                  <li>Delivery across Kamareddy</li>
                  <li>Open {STORE.hours}</li>
                </motion.ul>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="lg:col-span-6 xl:col-span-7"
              >
                <div className="relative aspect-[1/0.92] sm:aspect-[6/5] lg:aspect-auto lg:h-[clamp(520px,calc(100vh-170px),660px)]">
                  <HeroTile product={heroMain} eager caption className="absolute right-0 top-0 h-[86%] w-[78%] sm:w-[76%]" />
                  <HeroTile
                    product={heroSecondary}
                    eager
                    className="absolute bottom-0 left-0 aspect-square w-[44%] ring-[6px] ring-paper sm:ring-8"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* ── Search ─────────────────────────────────────────── */}
          <section aria-labelledby="search-title" className={container}>
            <div className="grid grid-cols-1 gap-6 border-t border-line pb-20 pt-10 lg:grid-cols-12 lg:gap-10 lg:pb-24">
              <div className="lg:col-span-4">
                <h2 id="search-title" className="font-serif text-[24px] font-semibold tracking-[-0.02em] text-ink">
                  Looking for a specific title?
                </h2>
                <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-ink-muted">
                  Search the catalog by book, author, publisher or ISBN.
                </p>
              </div>
              <div className="lg:col-span-8">
                <LandingSearch ref={searchRef} products={products} />
              </div>
            </div>
          </section>

          {/* ── Top rated products ─────────────────────────────── */}
          <section aria-labelledby="featured-title" className={`${container} pb-24 lg:pb-32`}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 id="featured-title" className={sectionTitle}>
                Highest rated on our shelves
              </h2>
              <Link to="/books" className={textLink}>
                Shop all products <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4" aria-busy={isLoading}>
              {isLoading
                ? Array.from({ length: 8 }, (_, i) => <ProductSkeleton key={i} />)
                : topRated.map((product, i) => <ShelfProductCard key={product._id} product={product} priority={i < 4} />)}
            </div>

            {!isLoading && topRated.length === 0 && (
              <p className="mt-10 rounded-xl border border-line bg-white px-6 py-8 text-[15px] text-ink-muted">
                The online catalog is being updated. Call us on{' '}
                <a href={STORE.phoneHref} className="font-medium text-ink underline underline-offset-4">
                  {STORE.phoneDisplay}
                </a>{' '}
                to check what is in stock.
              </p>
            )}
          </section>

          {/* ── Category index ─────────────────────────────────── */}
          <section
            id="categories"
            aria-labelledby="categories-title"
            className="scroll-mt-20 border-y border-line bg-white py-20 lg:py-28"
          >
            <div className={`${container} grid grid-cols-1 gap-10 lg:grid-cols-12`}>
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-28">
                  <h2 id="categories-title" className={sectionTitle}>
                    Shop by shelf
                  </h2>
                  <p className="mt-4 max-w-sm text-[16px] leading-relaxed text-ink-muted">
                    Every department in the store, from NCERT textbooks to laptop backpacks.
                  </p>
                  <Link to="/books" className={`${textLink} mt-6`}>
                    Browse the full catalog <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              <ol className="border-t border-line lg:col-span-8">
                {isLoading
                  ? Array.from({ length: 6 }, (_, i) => (
                      <li key={i} aria-hidden="true" className="flex h-[97px] items-center border-b border-line">
                        <div className="h-6 w-1/3 rounded bg-paper-deep" />
                      </li>
                    ))
                  : categories.map((cat, i) => (
                      <li key={cat.name}>
                        <Link
                          to={catalogPath({ category: cat.name })}
                          className={`group grid grid-cols-[2rem_1fr_auto] items-center gap-4 border-b border-line py-5 sm:grid-cols-[3rem_1fr_auto] sm:gap-6 ${focusRing} focus-visible:-outline-offset-2`}
                        >
                          <span className="text-[13px] tabular-nums text-ink-muted">{String(i + 1).padStart(2, '0')}</span>
                          <span className="min-w-0">
                            <span className="block font-serif text-[20px] font-medium tracking-[-0.02em] text-ink transition-colors group-hover:text-ember sm:text-[26px]">
                              {cat.name}
                            </span>
                            {CATEGORY_NOTES[cat.name] && (
                              <span className="mt-0.5 block text-[14px] text-ink-muted">{CATEGORY_NOTES[cat.name]}</span>
                            )}
                          </span>
                          <span className="flex items-center gap-4 sm:gap-6">
                            {cat.cover?.image && (
                              <img
                                src={cat.cover.image}
                                alt=""
                                width={80}
                                height={80}
                                loading="lazy"
                                decoding="async"
                                className="hidden h-14 w-14 rounded-lg bg-paper-deep object-cover min-[420px]:block sm:h-20 sm:w-20"
                              />
                            )}
                            <ArrowUpRight
                              className="h-5 w-5 text-ink-muted transition-[color,transform] group-hover:text-ember motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                              aria-hidden="true"
                            />
                          </span>
                        </Link>
                      </li>
                    ))}
              </ol>
            </div>
          </section>

          {/* ── Exam preparation ───────────────────────────────── */}
          {examPicks.length > 0 && (
            <section aria-labelledby="exam-title" className="bg-ink py-20 text-paper lg:py-28">
              <div className={`${container} grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10`}>
                <div className="lg:col-span-5">
                  <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-ember-soft">Exam preparation</p>
                  <h2
                    id="exam-title"
                    className="mt-4 text-balance font-serif text-[32px] font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-[40px] lg:text-[46px]"
                  >
                    From SSC boards to TSPSC recruitment.
                  </h2>
                  <p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/70">
                    Solved question banks for Telangana board exams, and study guides for TSPSC, SSC, banking and railway
                    recruitment tests.
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                    <Link to={catalogPath({ category: 'Competitive Exam Books' })} className={primaryButton}>
                      Competitive exam books
                    </Link>
                    <Link
                      to={catalogPath({ category: 'Question Banks' })}
                      className={`${textLink} text-white`}
                    >
                      Question banks <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                <ul className="border-t border-white/15 lg:col-span-7">
                  {examPicks.map((product) => (
                    <li key={product._id}>
                      <Link
                        to={`/book/${product._id}`}
                        className={`group flex items-center gap-5 border-b border-white/15 py-5 ${focusRing} focus-visible:-outline-offset-2`}
                      >
                        <img
                          src={product.image}
                          alt=""
                          width={96}
                          height={96}
                          loading="lazy"
                          decoding="async"
                          className="h-20 w-20 shrink-0 rounded-lg bg-white/10 object-cover sm:h-24 sm:w-24"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[16px] font-medium leading-snug text-white group-hover:underline group-hover:underline-offset-4 sm:text-[18px]">
                            {product.title}
                          </span>
                          <span className="mt-1 block truncate text-[14px] text-white/60">{product.author}</span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block text-[16px] font-medium text-white">{formatPrice(product.price)}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="block text-[13px] text-white/50 line-through">
                              <span className="sr-only">Was </span>
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* ── Visit / pickup ─────────────────────────────────── */}
          <section aria-labelledby="visit-title" className={`${container} py-20 lg:py-28`}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-6">
                <h2 id="visit-title" className={`${sectionTitle} text-balance`}>
                  Order online, collect on Station Road.
                </h2>
                <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-ink-muted">
                  Choose free store pickup at checkout and collect your order from the counter, or have it delivered to
                  your door in Kamareddy. Not sure we stock a title? Call or message us before you visit.
                </p>
              </div>

              <div className="lg:col-span-5 lg:col-start-8">
                <dl className="divide-y divide-line border-y border-line text-[15px]">
                  <div className="grid grid-cols-[6rem_1fr] gap-4 py-4">
                    <dt className="text-ink-muted">Address</dt>
                    <dd className="text-ink">{STORE.address}</dd>
                  </div>
                  <div className="grid grid-cols-[6rem_1fr] gap-4 py-4">
                    <dt className="text-ink-muted">Hours</dt>
                    <dd className="text-ink">{STORE.hours}</dd>
                  </div>
                  <div className="grid grid-cols-[6rem_1fr] gap-4 py-4">
                    <dt className="text-ink-muted">Phone</dt>
                    <dd>
                      <a href={STORE.phoneHref} className={`rounded-sm text-ink underline-offset-4 hover:underline ${focusRing}`}>
                        {STORE.phoneDisplay}
                      </a>
                    </dd>
                  </div>
                </dl>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={STORE.mapsHref}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex h-11 items-center gap-2 rounded-lg bg-ink px-5 text-[14px] font-medium text-white transition-colors hover:bg-ink-soft ${focusRing}`}
                  >
                    <Navigation className="h-4 w-4" aria-hidden="true" /> Get directions
                  </a>
                  <a
                    href={STORE.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex h-11 items-center gap-2 rounded-lg border border-line bg-white px-5 text-[14px] font-medium text-ink transition-colors hover:border-ink-muted ${focusRing}`}
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
                  </a>
                  <a
                    href={STORE.phoneHref}
                    className={`inline-flex h-11 items-center gap-2 rounded-lg border border-line bg-white px-5 text-[14px] font-medium text-ink transition-colors hover:border-ink-muted ${focusRing}`}
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" /> Call
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
};

export default LandingPage;
