import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../data/blogData';
import { SearchInput } from '../components/ui/SearchInput';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';

const Meta: React.FC<{ post: BlogPost; className?: string }> = ({ post, className = '' }) => (
  <p className={cn('text-[13px] text-store-charcoal-light', className)}>
    <span className="font-medium text-store-charcoal">{post.author.name}</span>
    <span aria-hidden="true"> · </span>
    <time>{post.publishedAt}</time>
    <span aria-hidden="true"> · </span>
    {post.readTime}
  </p>
);

const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => ['All', ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))], []);

  const filtered = BLOG_POSTS.filter((post) => {
    const q = searchQuery.toLowerCase();
    return (
      (selectedCategory === 'All' || post.category === selectedCategory) &&
      (post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((tag) => tag.toLowerCase().includes(q)))
    );
  });

  const [featured, ...rest] = filtered;

  return (
    <div className="mx-auto max-w-store px-5 pb-20 pt-10 sm:px-8 lg:px-12">
      <header className="grid gap-6 border-b border-store-line pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-store-charcoal-light">The study journal</p>
          <h1 className="mt-3 text-balance font-serif text-[38px] font-semibold leading-[1.05] tracking-tight text-store-charcoal sm:text-[52px]">
            Guides for exams, syllabus &amp; study
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-store-charcoal-light">
            Book lists, board exam preparation and stationery advice from the team at our Kamareddy store.
          </p>
        </div>
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          placeholder="Search articles"
          aria-label="Search articles"
          wrapperClassName="w-full lg:w-72"
        />
      </header>

      <div role="tablist" aria-label="Topics" className="mt-6 flex gap-2 overflow-x-auto hide-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={selectedCategory === cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'h-9 shrink-0 rounded-full border px-4 text-[14px] font-medium transition-colors',
              selectedCategory === cat
                ? 'border-store-charcoal bg-store-charcoal text-white'
                : 'border-store-line bg-white text-store-charcoal-light hover:text-store-charcoal'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {!featured ? (
        <EmptyState
          icon={<BookOpen />}
          title="No articles match"
          description="Try another topic or clear your search."
          action={<Button onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}>Show all articles</Button>}
          className="mt-10 rounded-xl border border-dashed border-store-line"
        />
      ) : (
        <>
          {/* Featured */}
          <article className="group mt-10 grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-12">
            <Link to={`/blog/${featured.slug}`} tabIndex={-1} aria-hidden="true" className="block overflow-hidden rounded-2xl bg-store-muted lg:col-span-7">
              <img
                src={featured.coverImage}
                alt=""
                className="aspect-[16/10] w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.02]"
              />
            </Link>
            <div className="lg:col-span-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-store-primary">{featured.category}</p>
              <h2 className="mt-3 text-balance font-serif text-[28px] font-semibold leading-tight tracking-tight text-store-charcoal sm:text-[34px]">
                <Link to={`/blog/${featured.slug}`} className="hover:text-store-primary">{featured.title}</Link>
              </h2>
              <p className="mt-4 text-[16px] leading-relaxed text-store-charcoal-light">{featured.excerpt}</p>
              <Meta post={featured} className="mt-5" />
              <Link
                to={`/blog/${featured.slug}`}
                className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-store-charcoal underline-offset-4 hover:underline"
              >
                Read the guide <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </article>

          {/* More articles */}
          {rest.length > 0 && (
            <section aria-labelledby="more-articles" className="mt-16 border-t border-store-line pt-10">
              <h2 id="more-articles" className="font-serif text-2xl font-semibold text-store-charcoal">More from the journal</h2>
              <div className="mt-8 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <article key={post.id} className="group flex flex-col">
                    <Link to={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true" className="block overflow-hidden rounded-xl bg-store-muted">
                      <img src={post.coverImage} alt="" loading="lazy" className="aspect-[3/2] w-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-[1.02]" />
                    </Link>
                    <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-store-primary">{post.category}</p>
                    <h3 className="mt-2 font-serif text-[21px] font-semibold leading-snug text-store-charcoal">
                      <Link to={`/blog/${post.slug}`} className="hover:text-store-primary">{post.title}</Link>
                    </h3>
                    <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-store-charcoal-light">{post.excerpt}</p>
                    <Meta post={post} className="mt-4" />
                  </article>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default BlogPage;
