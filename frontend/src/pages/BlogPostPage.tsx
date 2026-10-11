import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2, 
  CheckCircle, 
  BookOpen, 
  ShoppingBag,
  ExternalLink 
} from 'lucide-react';
import { BLOG_POSTS } from '../data/blogData';
import { FALLBACK_PRODUCTS } from '../api/queries';
import { toast } from 'sonner';

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = BLOG_POSTS.find((p) => p.slug === id || p.id === id);

  if (!post) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center bg-store-accent px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Article Not Found</h2>
        <p className="text-xs text-slate-500 mb-6 font-semibold">The blog guide you are looking for has moved or does not exist.</p>
        <Link to="/blog" className="px-6 py-3 bg-store-primary text-white text-xs font-bold rounded-xl shadow-xs">
          Return to Blog Library
        </Link>
      </div>
    );
  }

  // Find recommended products
  const recommendedProducts = post.recommendedProductIds
    ? FALLBACK_PRODUCTS.filter((p) => post.recommendedProductIds?.includes(p._id))
    : [];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Article link copied to clipboard!');
    }
  };

  return (
    <article className="w-full bg-store-accent min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/blog"
            className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-store-primary transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to All Articles
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-store-primary bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs transition"
          >
            <Share2 className="w-3.5 h-3.5" /> Share Guide
          </button>
        </div>

        {/* Header Content */}
        <header className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-store-primary text-white shadow-xs">
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-semibold border-y border-slate-200/80 py-4">
            <div className="flex items-center gap-2.5">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
              <div>
                <span className="block font-bold text-slate-800">{post.author.name}</span>
                <span className="block text-[11px] text-slate-400">{post.author.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> {post.publishedAt}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {post.readTime}
              </span>
            </div>
          </div>
        </header>

        {/* Featured Banner Image */}
        <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 max-h-[420px] bg-white">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover max-h-[420px]"
          />
        </div>

        {/* Article Body */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xs border border-slate-200/80 space-y-8 text-slate-700 leading-relaxed text-sm sm:text-base font-normal">
          
          {/* Intro paragraph with lead style */}
          <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed border-l-4 border-store-primary pl-4 bg-store-accent/50 py-2 rounded-r-lg">
            {post.content.intro}
          </p>

          {/* Structured Sections */}
          {post.content.sections.map((section, idx) => (
            <section key={idx} className="space-y-3 pt-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {section.heading}
              </h2>
              <p className="text-slate-650 leading-relaxed">
                {section.body}
              </p>

              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <ul className="space-y-2 pt-2">
                  {section.bulletPoints.map((point, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-slate-800">
                      <CheckCircle className="w-4 h-4 text-store-primary shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {/* Conclusion */}
          <div className="bg-store-accent-dark/60 p-6 rounded-xl border border-store-primary/20 space-y-2 mt-8">
            <h3 className="text-base font-bold text-slate-900">Summary &amp; Store Recommendation</h3>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {post.content.conclusion}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 mr-2">Tags:</span>
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                #{tag}
              </span>
            ))}
          </div>

        </div>

        {/* Recommended Products Showcase */}
        {recommendedProducts.length > 0 && (
          <section className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-store-primary" /> Mentioned in this Guide
              </h2>
              <Link to="/books" className="text-xs font-bold text-store-primary hover:underline flex items-center">
                Browse Full Catalog <ExternalLink className="w-3 h-3 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {recommendedProducts.map((p) => (
                <div key={p._id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex gap-4 items-center hover:border-store-primary transition">
                  <div className="w-20 h-24 bg-slate-50 rounded-xl p-2 shrink-0 flex items-center justify-center border border-slate-100">
                    <img src={p.image} alt={p.title} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-store-primary uppercase">{p.category}</span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{p.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">By {p.author}</p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <span className="text-sm font-black text-slate-900">₹{p.price}</span>
                      <Link
                        to={`/book/${p._id}`}
                        className="px-3 py-1 bg-store-primary text-white text-[11px] font-bold rounded-lg shadow-xs hover:bg-store-primary-dark transition"
                      >
                        View Book
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </article>
  );
};

export default BlogPostPage;
