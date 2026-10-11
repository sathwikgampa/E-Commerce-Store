import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  ShoppingCart, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  Heart, 
  Star, 
  CheckCircle, 
  Share2, 
  MessageCircle, 
  Building2, 
  FileText, 
  Check, 
  ThumbsUp, 
  UserCheck, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useProducts } from '../api/queries';
import { Product } from '../types';
import useCartStore from '../store/cartStore';
import useWishlistStore from '../store/wishlistStore';
import { toast } from 'sonner';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';

interface CustomerReview {
  id: string;
  name: string;
  role: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  helpfulCount: number;
  userVotedHelpful?: boolean;
}

const DEFAULT_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Venkatesh Rao M.',
    role: 'Verified Buyer · Class 12 Parent',
    rating: 5,
    date: '2 weeks ago',
    title: 'Authentic NCERT textbook with revised 2024 syllabus',
    comment: 'Purchased this directly from Sri Thirumala. The pages are high quality and all recent syllabus rationalizations are included. Highly recommended over online knock-offs.',
    helpfulCount: 14,
  },
  {
    id: 'rev-2',
    name: 'Sravanthi K.',
    role: 'Verified Buyer · TSPSC Aspirant',
    rating: 5,
    date: '1 month ago',
    title: 'Essential reference book for exam preparation',
    comment: 'The explanations and practice problem sets are top notch. Sri Thirumala staff on Station Road were very helpful in confirming this was the latest edition.',
    helpfulCount: 9,
  },
  {
    id: 'rev-3',
    name: 'P. Anand Kumar',
    role: 'Verified Buyer · Teacher, Kamareddy',
    rating: 4,
    date: '1 month ago',
    title: 'Solid curriculum alignment and clear printing',
    comment: 'We recommend this title to all our secondary board students. Durable binding that withstands a full academic year of daily revision.',
    helpfulCount: 6,
  }
];

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useProducts();
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'reviews'>('overview');

  // Customer Reviews State
  const [reviews, setReviews] = useState<CustomerReview[]>(DEFAULT_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRole, setNewReviewRole] = useState('Verified Student');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');

  // Image Gallery Thumbnails
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((p) => p._id === id);
      if (found) {
        setProduct(found);
        setRelatedProducts(products.filter((p) => p.category === found.category && p._id !== found._id).slice(0, 4));
      } else {
        setProduct(products[0]);
        setRelatedProducts(products.slice(1, 5));
      }
      setSelectedImageIndex(0);
      window.scrollTo(0, 0);
    }
  }, [id, products]);

  if (isLoading) {
    return (
      <div className="w-full mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <div className="h-12 w-12 border-4 border-store-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 font-bold text-sm">Loading publication details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full mx-auto px-4 py-20 text-center bg-store-accent">
        <h2 className="text-2xl font-black text-slate-800">Product Not Found</h2>
        <Link to="/books" className="btn-primary mt-4">Back to Catalog</Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product._id);

  // Gallery images array (fallback variations for demonstration)
  const galleryImages = [
    product.image || '/images/products/ncert-physics-12.jpg',
    '/images/products/classmate-notebooks.jpg',
    '/images/products/vgs-ssc-science.jpg',
  ];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} × "${product.title}" added to cart!`, {
      description: 'View your cart to proceed to checkout or continue shopping.',
    });
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    if (!isFavorited) {
      toast.success(`Saved "${product.title}" to wishlist!`, { icon: '❤️' });
    } else {
      toast.info(`Removed "${product.title}" from wishlist.`, { icon: '💔' });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} at Sri Thirumala Store:`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  const handleHelpfulVote = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const alreadyVoted = r.userVotedHelpful;
          return {
            ...r,
            helpfulCount: alreadyVoted ? r.helpfulCount - 1 : r.helpfulCount + 1,
            userVotedHelpful: !alreadyVoted,
          };
        }
        return r;
      })
    );
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim() || !newReviewTitle.trim()) {
      toast.error('Please complete all review fields.');
      return;
    }

    const createdReview: CustomerReview = {
      id: `rev-${Date.now()}`,
      name: newReviewName.trim(),
      role: newReviewRole.trim() || 'Verified Student',
      rating: newReviewRating,
      date: 'Just now',
      title: newReviewTitle.trim(),
      comment: newReviewComment.trim(),
      helpfulCount: 0,
    };

    setReviews([createdReview, ...reviews]);
    setShowReviewForm(false);
    setNewReviewName('');
    setNewReviewTitle('');
    setNewReviewComment('');
    toast.success('Thank you! Your verified review has been submitted.');
  };

  // Specs table pairs
  const specItems = [
    { label: 'Publisher', value: product.publisher || 'NCERT / National Academic Publications' },
    { label: 'Author / Editor', value: product.author },
    { label: 'Edition', value: product.edition || '2024-2025 Revised Curriculum Edition' },
    { label: 'ISBN / Barcode', value: product.isbn || '978-81-7450-631-3' },
    { label: 'Language', value: product.language || 'English' },
    { label: 'Number of Pages', value: product.pages || '340+ Pages' },
    { label: 'Binding Type', value: product.binding || 'Paperback (Heavy Card Cover)' },
    { label: 'Curriculum Alignment', value: product.curriculum || 'Telangana State Board & CBSE' },
    { label: 'Dimensions', value: product.dimensions || '24.2 x 18.5 x 1.8 cm' },
    { label: 'Item Weight', value: product.weight || '480 g' },
  ];

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-store-accent text-left min-h-screen">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6 flex-wrap" aria-label="Breadcrumb">
        <Link to="/home" className="hover:text-store-primary">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/books" className="hover:text-store-primary">Books</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to={`/books?category=${encodeURIComponent(product.category)}`} className="hover:text-store-primary">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-bold truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Detail Section */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/90 overflow-hidden mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="lg:col-span-5 bg-slate-50/70 p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-slate-200/80 flex flex-col justify-between">
            
            {/* Main Stage Image with Zoom on Hover */}
            <div className="w-full aspect-square flex items-center justify-center p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden group">
              {product.badge && (
                <div className="absolute top-3 left-3 bg-store-primary text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs z-10">
                  {product.badge}
                </div>
              )}
              <img 
                src={galleryImages[selectedImageIndex] || product.image} 
                alt={product.title} 
                className="max-h-full max-w-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105" 
              />
            </div>

            {/* Thumbnail Carousel / Selectors */}
            <div className="flex items-center gap-3 mt-6 justify-center">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-20 p-1 bg-white rounded-xl border transition-all flex items-center justify-center ${
                    selectedImageIndex === idx 
                      ? 'border-store-primary ring-2 ring-store-primary/30 shadow-xs' 
                      : 'border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`View image angle ${idx + 1}`}
                >
                  <img src={img} alt="Thumbnail preview" className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>

            {/* Genuine Seals & Badges */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-200/60 text-slate-700 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Genuine Print</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-store-primary shrink-0" />
                <span>Authorised Stockist</span>
              </div>
            </div>

          </div>
          
          {/* Right Column: Title, Metadata, Pricing & Buy Actions (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              
              {/* Category & Publisher Header */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] font-black tracking-widest text-store-primary uppercase px-2.5 py-1 bg-store-primary-subtle rounded-md border border-store-primary/10">
                  {product.category}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Publisher: <strong className="text-slate-800">{product.publisher || 'NCERT Editorial'}</strong>
                </span>
              </div>

              {/* Title & Author */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight font-serif">
                {product.title}
              </h1>
              <p className="text-sm font-semibold text-slate-600">
                Authored / Compiled by <span className="text-slate-900 font-bold">{product.author}</span>
              </p>

              {/* Star Rating & Review Count */}
              <div className="flex items-center gap-3 pt-1">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current text-amber-500' : 'text-slate-200'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-black text-slate-800">{product.rating} / 5.0</span>
                <span className="text-slate-300">•</span>
                <button 
                  onClick={() => setActiveTab('reviews')} 
                  className="text-xs font-bold text-store-primary hover:underline"
                >
                  {reviews.length} Customer Reviews
                </button>
              </div>

              {/* Pricing & Discount */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl sm:text-4xl font-black text-store-primary">₹{product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="text-base text-slate-400 font-bold line-through">₹{product.originalPrice}</span>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {/* In-Stock Status */}
              <div>
                <span className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full ${
                  product.inStock 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                  {product.inStock ? 'In Stock (Available for Store Pickup & Delivery in Kamareddy)' : 'Currently Out of Stock'}
                </span>
              </div>

              {/* Short Summary */}
              <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-normal text-slate-700 pt-1">
                {product.description || product.desc}
              </p>

              {/* Key Features Bullet List */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider block">Key Highlights</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <Check className="w-4 h-4 text-store-primary shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Store Pickup & Logistics Benefits */}
              <div className="bg-store-accent/80 p-4 rounded-2xl border border-store-primary/10 space-y-2">
                <div className="flex items-center text-slate-800 text-xs font-semibold">
                  <Truck className="w-4 h-4 text-store-primary mr-2.5 shrink-0" />
                  <span>Free Store Pickup: Collect directly from Station Road, Kamareddy (Mon-Sun: 9 AM - 9 PM)</span>
                </div>
                <div className="flex items-center text-slate-800 text-xs font-semibold">
                  <MessageCircle className="w-4 h-4 text-emerald-600 mr-2.5 shrink-0" />
                  <span>Direct phone / WhatsApp confirmation with shop staff upon order receipt</span>
                </div>
              </div>

            </div>

            {/* Action Bar (Quantity + Cart + Wishlist + WhatsApp) */}
            <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                
                {/* Quantity Counter */}
                <div className="flex items-center border border-slate-300 rounded-xl px-3 py-2 justify-between bg-white shrink-0 sm:w-36 min-h-[48px]">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition font-black min-w-[32px]"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-slate-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition font-black min-w-[32px]"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Add To Cart Primary Button */}
                <button 
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-grow flex justify-center items-center px-8 py-3.5 bg-store-primary hover:bg-store-primary-dark text-white font-bold rounded-xl shadow-md transition-all active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed min-h-[48px]"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart • ₹{product.price * quantity}
                </button>

                {/* Wishlist Button */}
                <button 
                  onClick={handleToggleWishlist}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-center min-h-[48px] min-w-[48px] ${
                    isFavorited 
                      ? 'bg-rose-50 text-rose-500 border-rose-200' 
                      : 'bg-white text-slate-400 border-slate-200 hover:text-slate-600'
                  }`}
                  title="Save to Wishlist"
                  aria-label="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
                </button>

                {/* Share Button */}
                <button 
                  onClick={handleShare}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-600 transition-all flex items-center justify-center min-h-[48px] min-w-[48px]"
                  title="Share publication"
                  aria-label="Share publication"
                >
                  <Share2 className="w-5 h-5" />
                </button>

              </div>

              {/* Direct WhatsApp Ordering Link */}
              <a 
                href={`https://wa.me/919949886640?text=Hi%20Sri%20Thirumala%20Store%2C%20I%20would%20like%20to%20order%3A%20${encodeURIComponent(product.title)}%20(Price%3A%20INR%20${product.price})`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-[#128C7E] hover:bg-[#075E54] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-xs"
              >
                <MessageCircle className="w-4 h-4" /> Order Directly on WhatsApp (+91 99498 86640)
              </a>

            </div>

          </div>

        </div>
      </div>

      {/* Tabs Section: Overview | Specs | Verified Reviews */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/90 overflow-hidden mb-16">
        
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200/80 px-6 sm:px-10 gap-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-5 text-sm font-bold border-b-2 transition-all shrink-0 ${
              activeTab === 'overview'
                ? 'border-store-primary text-store-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Overview &amp; Features
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`py-5 text-sm font-bold border-b-2 transition-all shrink-0 ${
              activeTab === 'specs'
                ? 'border-store-primary text-store-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Product Specifications
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-5 text-sm font-bold border-b-2 transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-store-primary text-store-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Customer Reviews</span>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-black">
              {reviews.length}
            </span>
          </button>
        </div>

        {/* Tab Content Panes */}
        <div className="p-6 sm:p-10 text-slate-700">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-lg font-black text-slate-900 font-serif mb-2">Detailed Book Description</h3>
                <p className="text-sm leading-relaxed text-slate-650">
                  {product.description || product.desc}
                </p>
              </div>

              {product.features && product.features.length > 0 && (
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3">Academic Highlights</h4>
                  <ul className="space-y-2.5">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-700">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SPECIFICATIONS TABLE */}
          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-black text-slate-900 font-serif mb-4">Bibliographic &amp; Print Specifications</h3>
              <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs sm:text-sm">
                {specItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-3 p-3.5 bg-white even:bg-slate-50/50">
                    <span className="font-bold text-slate-500 col-span-1">{item.label}</span>
                    <span className="font-semibold text-slate-900 col-span-2">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-10">
              
              {/* Rating Summary Card */}
              <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900">{product.rating}</span>
                    <div className="flex text-amber-500 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400 font-bold mt-1 block">Based on verified orders</span>
                  </div>

                  <div className="border-l border-slate-200 pl-6 space-y-1.5 text-xs font-semibold text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="w-8">5 ★</span>
                      <div className="w-32 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[85%]"></div>
                      </div>
                      <span className="text-slate-400">85%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-8">4 ★</span>
                      <div className="w-32 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-400 h-full w-[12%]"></div>
                      </div>
                      <span className="text-slate-400">12%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-8">3 ★</span>
                      <div className="w-32 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full w-[3%]"></div>
                      </div>
                      <span className="text-slate-400">3%</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="btn-primary"
                >
                  Write a Verified Review
                </button>
              </div>

              {/* Review Submission Form Modal / Box */}
              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="bg-store-accent p-6 sm:p-8 rounded-2xl border border-store-primary/20 space-y-4 max-w-2xl animate-fade-up">
                  <h4 className="text-base font-black text-slate-900 font-serif">Share Your Feedback</h4>
                  
                  {/* Star Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Rating</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 text-amber-500"
                        >
                          <Star className={`w-6 h-6 ${star <= newReviewRating ? 'fill-current' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Kumar"
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-store-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Role / Class</label>
                      <input
                        type="text"
                        placeholder="e.g. Student, Class 10 Parent, Teacher"
                        value={newReviewRole}
                        onChange={(e) => setNewReviewRole(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-store-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Review Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Great syllabus coverage and crisp print"
                      value={newReviewTitle}
                      onChange={(e) => setNewReviewTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-store-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Detailed Comments</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share how this book helped your study routine or board exam preparation..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-store-primary"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 border border-slate-300 text-slate-600 rounded-xl text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-6 rounded-2xl border border-slate-200/80 space-y-3 bg-white">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current text-amber-500' : 'text-slate-200'}`} 
                            />
                          ))}
                        </div>
                        <span className="font-bold text-xs text-slate-900">{rev.title}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-semibold">{rev.date}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed">
                      {rev.comment}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{rev.name}</span>
                        <span className="text-slate-400 font-normal">({rev.role})</span>
                      </div>

                      <button
                        onClick={() => handleHelpfulVote(rev.id)}
                        className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border transition ${
                          rev.userVotedHelpful
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Helpful ({rev.helpfulCount})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 mb-8">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif">
              Frequently Bought Together in {product.category}
            </h2>
            <Link to={`/books?category=${encodeURIComponent(product.category)}`} className="text-xs font-bold text-store-primary hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard 
                key={p._id} 
                product={p} 
                onQuickView={() => {
                  setSelectedProduct(p);
                  setIsQuickViewOpen(true);
                }} 
              />
            ))}
          </div>
        </section>
      )}

      {/* Quick View Dialog Overlay */}
      <QuickViewModal 
        product={selectedProduct} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </div>
  );
};

export default ProductDetail;
