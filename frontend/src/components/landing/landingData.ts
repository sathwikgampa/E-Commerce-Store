import { Product } from '../../types';

// Shared focus treatment for every interactive element on the landing page
export const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember';

// Store facts already published in the Navbar, Footer and Checkout
export const STORE = {
  phoneDisplay: '+91 99498 86640',
  phoneHref: 'tel:9949886640',
  whatsappHref:
    'https://wa.me/919949886640?text=Hi%20Sri%20Thirumala%20Store%2C%20I%20would%20like%20to%20inquire%20about%20books',
  address: 'Station Road, Kamareddy, Telangana 503111',
  mapsHref: 'https://maps.google.com/maps?q=Station%20Road,%20Kamareddy%20-%20503111',
  hours: '9:00 AM – 9:00 PM',
};

// One-line descriptions for the catalog categories that exist in the product data
export const CATEGORY_NOTES: Record<string, string> = {
  Textbooks: 'NCERT, CBSE and Telangana State Board editions',
  Notebooks: 'Classmate packs and hard-bound practical registers',
  'School Supplies': 'Geometry boxes and everyday desk tools',
  'Engineering Materials': 'Reference texts for B.Tech and B.E. semesters',
  'Question Banks': 'Solved papers for SSC board examinations',
  'Competitive Exam Books': 'TSPSC, SSC, banking and railway recruitment',
  'School Bags': 'Ergonomic backpacks for the school run',
  'College Bags': 'Laptop backpacks for the daily commute',
};

// Every term here matches titles or authors in the catalog
export const POPULAR_SEARCHES = ['NCERT', 'VGS', 'TSPSC', 'Classmate', 'Grewal'];

export const EXAM_CATEGORIES = ['Question Banks', 'Competitive Exam Books'];

export const catalogPath = (params: { category?: string; search?: string } = {}) => {
  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.search) query.set('search', params.search);
  const qs = query.toString();
  return qs ? `/books?${qs}` : '/books';
};

export const formatPrice = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export const discountPercent = (product: Product) =>
  product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

export const matchesQuery = (product: Product, rawQuery: string) => {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return false;
  return [product.title, product.author, product.publisher, product.category, product.isbn]
    .filter(Boolean)
    .some((field) => (field as string).toLowerCase().includes(query));
};

export interface CategorySummary {
  name: string;
  count: number;
  cover?: Product;
}

// Groups products by category, keeping catalog order and using the best-rated item as the cover
export const summarizeCategories = (products: Product[]): CategorySummary[] => {
  const map = new Map<string, CategorySummary>();
  for (const product of products) {
    const entry = map.get(product.category) ?? { name: product.category, count: 0 };
    entry.count += 1;
    if (product.image && (!entry.cover || product.rating > entry.cover.rating)) {
      entry.cover = product;
    }
    map.set(product.category, entry);
  }
  return Array.from(map.values());
};

// Picks preferred hero products by id, falling back to any products with imagery
export const pickProducts = (products: Product[], preferredIds: string[], count: number) => {
  const withImages = products.filter((p) => p.image);
  const picked = preferredIds
    .map((id) => withImages.find((p) => p._id === id))
    .filter((p): p is Product => Boolean(p));
  for (const product of withImages) {
    if (picked.length >= count) break;
    if (!picked.includes(product)) picked.push(product);
  }
  return picked.slice(0, count);
};
