import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Check, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { BLOG_POSTS } from '../data/blogData';
import { FALLBACK_PRODUCTS } from '../api/queries';
import ProductCard from '../components/ProductCard';
import { EmptyState } from '../components/ui/EmptyState';
import { buttonClasses } from '../components/ui/Button';

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === id || p.id === id);

  if (!post) {
    return (
      <div className="mx-auto max-w-store px-5 py-16 sm:px-8 lg:px-12">
        <EmptyState
          icon={<BookOpen />}
          title="Article not found"
          description="The guide you’re looking for has moved or doesn’t exist."
          action={<Link to="/blog" className={buttonClasses('primary')}>Back to the journal</Link>}
        />
      </div>
    );
  }

  const recommended = post.recommendedProductIds
    ? FALLBACK_PRODUCTS.filter((p) => post.recommendedProductIds?.includes(p._id))
    : [];
  const related = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 2);

  const handleShare = async () => {
    if (navigator.share) {
      navigator.share({ title: post.title, text: post.excerpt, url: window.location.href }).catch(() => {});
      return;
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied');
    } catch {
      toast.error('Could not copy the link');
    }
  };

  return (
    <article className="pb-20 pt-8">
      <div className="mx-auto max-w-reading px-5 sm:px-8">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-store-charcoal-light hover:text-store-charcoal">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All articles
        </Link>

        <header className="mt-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-store-primary">{post.category}</p>
          <h1 className="mt-4 text-balance font-serif text-[34px] font-semibold leading-[1.1] tracking-tight text-store-charcoal sm:text-[46px]">
            {post.title}
          </h1>
          <p className="mt-5 text-[18px] leading-relaxed text-store-charcoal-light">{post.excerpt}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4 border-y border-store-line py-4">
            <img src={post.author.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
            <div className="min-w-0 flex-1 text-[14px]">
              <p className="font-medium text-store-charcoal">{post.author.name}</p>
              <p className="text-store-charcoal-light">
                {post.author.role} · <time>{post.publishedAt}</time> · {post.readTime}
              </p>
            </div>
            <button type="button" onClick={handleShare} className={buttonClasses('secondary', 'sm')}>
              <Share2 className="h-4 w-4" aria-hidden="true" /> Share
            </button>
          </div>
        </header>
      </div>

      <figure className="mx-auto mt-10 max-w-[64rem] px-5 sm:px-8">
        <img src={post.coverImage} alt="" className="aspect-[16/9] w-full rounded-2xl bg-store-muted object-cover" />
      </figure>

      <div className="mx-auto mt-12 max-w-reading px-5 text-[17px] leading-[1.8] text-store-charcoal-light sm:px-8">
        <p className="font-serif text-[21px] leading-relaxed text-store-charcoal">{post.content.intro}</p>

        {post.content.sections.map((section) => (
          <section key={section.heading} className="mt-12">
            <h2 className="font-serif text-[26px] font-semibold leading-snug tracking-tight text-store-charcoal">{section.heading}</h2>
            <p className="mt-4">{section.body}</p>
            {section.bulletPoints && section.bulletPoints.length > 0 && (
              <ul className="mt-5 space-y-3">
                {section.bulletPoints.map((point) => (
                  <li key={point} className="flex gap-3">
                    <Check className="mt-1.5 h-4 w-4 shrink-0 text-store-primary" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <aside className="mt-12 rounded-xl bg-white p-6 ring-1 ring-store-line">
          <h2 className="font-sans text-[15px] font-semibold text-store-charcoal">In short</h2>
          <p className="mt-2 text-[16px] leading-relaxed">{post.content.conclusion}</p>
        </aside>

        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Tags">
          {post.tags.map((tag) => (
            <li key={tag} className="rounded-full border border-store-line bg-white px-3 py-1 text-[13px] text-store-charcoal-light">
              {tag}
            </li>
          ))}
        </ul>
      </div>

      {recommended.length > 0 && (
        <section aria-labelledby="mentioned" className="mx-auto mt-16 max-w-store border-t border-store-line px-5 pt-12 sm:px-8 lg:px-12">
          <h2 id="mentioned" className="font-serif text-[26px] font-semibold text-store-charcoal">Mentioned in this guide</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {recommended.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="keep-reading" className="mx-auto mt-16 max-w-store border-t border-store-line px-5 pt-12 sm:px-8 lg:px-12">
          <h2 id="keep-reading" className="font-serif text-[26px] font-semibold text-store-charcoal">Keep reading</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {related.map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="group grid grid-cols-[7rem_1fr] gap-5 sm:grid-cols-[10rem_1fr]">
                <img src={p.coverImage} alt="" loading="lazy" className="aspect-square w-full rounded-xl bg-store-muted object-cover" />
                <span>
                  <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-store-primary">{p.category}</span>
                  <span className="mt-2 block font-serif text-[19px] font-semibold leading-snug text-store-charcoal group-hover:text-store-primary">{p.title}</span>
                  <span className="mt-2 block text-[13px] text-store-charcoal-light">{p.readTime}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};

export default BlogPostPage;
