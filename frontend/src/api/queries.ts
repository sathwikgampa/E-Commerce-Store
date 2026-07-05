import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Product, Order } from '../types';

const API_URL = 'http://localhost:5000/api';

// High-fidelity fallback catalog representing Sri Thirumala's regional and academic catalog
export const FALLBACK_PRODUCTS: Product[] = [
  // 1. Textbooks
  {
    _id: 'tb-1',
    title: 'NCERT Physics Class 12 (Part 1 & 2)',
    author: 'NCERT Board Publications',
    price: 250,
    originalPrice: 295,
    category: 'Textbooks',
    inStock: true,
    rating: 4.8,
    badge: 'State Recommended',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'The standard recommended physics textbook for Class 12 Intermediate CBSE/State Board curriculum. In-depth cover of electromagnetism, electrostatics, optics, and nuclear physics.'
  },
  {
    _id: 'tb-2',
    title: 'NCERT Mathematics Class 10',
    author: 'NCERT Board Publications',
    price: 160,
    originalPrice: 190,
    category: 'Textbooks',
    inStock: true,
    rating: 4.9,
    badge: 'Core Curriculum',
    image: 'https://images.unsplash.com/photo-1629131726692-1acba5526839?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Core mathematics textbook for Class 10. Covering algebra, geometry, trigonometry, coordinate geometry, and mensuration with step-by-step exercises.'
  },
  // 2. Notebooks
  {
    _id: 'nb-1',
    title: 'Classmate Premium Single Line Notebook - 200 Pages (Pack of 6)',
    author: 'ITC Classmate',
    price: 360,
    originalPrice: 420,
    category: 'Notebooks',
    inStock: true,
    rating: 4.7,
    badge: 'Top Choice',
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'High-quality, eco-friendly pages with standard bindings and smooth paper for neat and clear academic notes.'
  },
  {
    _id: 'nb-2',
    title: 'Sri Thirumala Hard Bound Practical Register - 120 Pages',
    author: 'Sri Thirumala Press',
    price: 85,
    originalPrice: 100,
    category: 'Notebooks',
    inStock: true,
    rating: 4.6,
    badge: 'Store Special',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Robust hard bound register specifically sized for physics and chemistry laboratory records. Sturdy binding prevents loose pages.'
  },
  // 3. School Supplies
  {
    _id: 'ss-1',
    title: 'Maped Premium Mathematical Geometry Box',
    author: 'Maped Essentials',
    price: 180,
    originalPrice: 220,
    category: 'School Supplies',
    inStock: true,
    rating: 4.8,
    badge: '15% OFF',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Complete drawing set including durable metal compass, divider, metal ruler, protractor, set squares, sharpener, and eraser in a shock-resistant metal tin case.'
  },
  // 4. Engineering Materials
  {
    _id: 'eng-1',
    title: 'Higher Engineering Mathematics - 44th Edition',
    author: 'Dr. B.S. Grewal',
    price: 850,
    originalPrice: 995,
    category: 'Engineering Materials',
    inStock: true,
    rating: 4.9,
    badge: 'Semester Standard',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'The standard text for B.Tech & B.E students across universities. Includes comprehensive explanations on differential equations, vector calculus, linear algebra, and complex variables.'
  },
  // 5. Question Banks
  {
    _id: 'qb-1',
    title: 'VGS SSC Class 10 General Science Solved Question Bank',
    author: 'VGS Publications',
    price: 140,
    originalPrice: 165,
    category: 'Question Banks',
    inStock: true,
    rating: 4.9,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Chapter-wise previous years solved question answers, state board model answers, and board exam blueprints for Class 10 SSC Telangana & AP boards.'
  },
  // 6. Competitive Exam Books
  {
    _id: 'comp-1',
    title: 'Quantitative Aptitude for Competitive Examinations',
    author: 'Dr. R.S. Aggarwal',
    price: 590,
    originalPrice: 695,
    category: 'Competitive Exam Books',
    inStock: true,
    rating: 4.9,
    badge: 'Must Have',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'The definitive volume for competitive tests like Bank PO, LIC, UPSC CSAT, TS PSC, SSC, Railways, MBA, and campus recruitment selections.'
  },
  {
    _id: 'comp-2',
    title: 'TSPSC Group-IV General Knowledge Study Guide',
    author: 'Vijeta Publications',
    price: 320,
    originalPrice: 380,
    category: 'Competitive Exam Books',
    inStock: true,
    rating: 4.8,
    badge: 'Latest Release',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Updated guide covering Telangana history, state movements, geography, current affairs, and local policies formatted precisely for the TSPSC Group-IV exam structure.'
  },
  // 7. School Bags
  {
    _id: 'bag-1',
    title: 'Skybags Ergonomic Triple-Compartment School Backpack',
    author: 'Skybags Retail',
    price: 1199,
    originalPrice: 1699,
    category: 'School Bags',
    inStock: true,
    rating: 4.7,
    badge: 'Heavy Discount',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Spacious school bag featuring anatomical shoulder support, mesh back padding, rain cover, and heavy-duty zippers. Ideal for Classes 6-12.'
  },
  // 8. College Bags
  {
    _id: 'bag-2',
    title: 'Wildcraft Unisex Laptop College Backpack',
    author: 'Wildcraft',
    price: 1499,
    originalPrice: 1999,
    category: 'College Bags',
    inStock: true,
    rating: 4.8,
    badge: 'Waterproof',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Ergonomic commuter bag with a dedicated padded 15.6" laptop slot, double organizing pockets, water-bottle mesh, and water-repellent nylon material.'
  }
];

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
      } catch (error) {
        console.warn('Backend API connection failed, serving static fallback bookstore products.', error);
        return FALLBACK_PRODUCTS;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSubmitOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (orderData: Order) => {
      try {
        const response = await axios.post(`${API_URL}/orders`, orderData);
        return response.data;
      } catch (error) {
        console.warn('Backend order submission failed, logging and mock resolving on client side.', error);
        
        // Mock save to localStorage for admin simulation
        const existingOrdersStr = localStorage.getItem('mock_admin_orders') || '[]';
        const existingOrders = JSON.parse(existingOrdersStr);
        const newOrder = {
          ...orderData,
          _id: `ORD-${Date.now().toString().slice(-6)}`,
          status: 'Pending',
          createdAt: new Date().toISOString()
        };
        localStorage.setItem('mock_admin_orders', JSON.stringify([newOrder, ...existingOrders]));
        
        return newOrder;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });
};

export const useOrders = () => {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/orders`);
        return response.data;
      } catch (error) {
        const localOrdersStr = localStorage.getItem('mock_admin_orders') || '[]';
        return JSON.parse(localOrdersStr);
      }
    }
  });
};
