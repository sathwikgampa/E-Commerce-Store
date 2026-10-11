import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, Calendar, ArrowRight, BookOpen, Tag, Sparkles } from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../data/blogData';

const categories = ['All', 'Exam Preparation', 'Stationery Guide', 'Study Tips'] as const;

const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-store-accent min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-store-accent-dark text-store-primary border border-store-primary/20">
            <Sparkles className="w-3.5 h-3.5" /> Sri Thirumala Learning Journal
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Academic Insights &amp; Study Guides
          </h1>
          <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
            Expert recommendations on competitive exam books, curriculum updates, student stationery, and proven study methods from Kamareddy's trusted bookstore.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-store-primary text-white shadow-xs'
                    : 'bg-slate-100 text-slate-650 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search articles & guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-store-primary focus:bg-white transition"
            />
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 group"
              >
                <div>
                  {/* Article Thumbnail */}
                  <div className="relative h-52 bg-slate-100 overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-store-primary shadow-xs">
                      {post.category}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {post.publishedAt}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-slate-900 group-hover:text-store-primary transition-colors leading-snug">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer with Author and CTA */}
                <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <span className="text-xs font-bold text-slate-700">{post.author.name}</span>
                  </div>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-xs font-bold text-store-primary hover:text-store-primary-dark group-hover:translate-x-0.5 transition-all"
                  >
                    Read More <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center max-w-md mx-auto">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">No articles match your criteria</h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">Try selecting a different topic or clearing your search term.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="px-4 py-2 bg-store-primary text-white text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogPage;
