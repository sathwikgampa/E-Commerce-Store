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
    author: 'NCERT Editorial Board',
    publisher: 'National Council of Educational Research and Training (NCERT)',
    edition: '2024-2025 Revised National Curriculum Edition',
    isbn: '978-81-7450-631-3',
    language: 'English',
    pages: '492 Pages (Part 1: 284, Part 2: 208)',
    binding: 'Paperback (Set of 2 Volumes)',
    curriculum: 'CBSE & Telangana / AP Intermediate Board',
    price: 250,
    originalPrice: 295,
    category: 'Textbooks',
    inStock: true,
    rating: 4.8,
    badge: 'State Recommended',
    image: '/images/products/ncert-physics-12.jpg',
    description: 'The official recommended physics textbook set for Class 12 Intermediate CBSE and State Board examinations. Features comprehensive treatment of Electrostatics, Current Electricity, Magnetism, Optics, and Modern Physics with solved numericals and NCERT exemplar questions.',
    features: [
      'Strictly aligned with latest NCERT rationalised syllabus and NEP 2020 guidelines',
      'Includes both Volume I (Mechanics, Electromagnetism) and Volume II (Optics, Modern Physics)',
      'Essential base reference for CBSE Board, JEE Main & Advanced, and NEET entrance tests',
      'Solved numerical examples, chapter-end conceptual summaries, and practice problem sets'
    ]
  },
  {
    _id: 'tb-2',
    title: 'NCERT Mathematics Class 10',
    author: 'NCERT Board Publications',
    publisher: 'National Council of Educational Research and Training (NCERT)',
    edition: '2024-2025 Academic Year Edition',
    isbn: '978-81-7450-634-4',
    language: 'English',
    pages: '334 Pages',
    binding: 'Paperback',
    curriculum: 'CBSE & Telangana SSC Board Class 10',
    price: 160,
    originalPrice: 190,
    category: 'Textbooks',
    inStock: true,
    rating: 4.9,
    badge: 'Core Curriculum',
    image: '/images/products/ncert-maths-10.jpg',
    description: 'The core mathematics textbook prescribed for Class 10 students. Covers foundational and advanced secondary mathematics including Real Numbers, Polynomials, Linear Equations, Quadratic Equations, Arithmetic Progressions, Coordinate Geometry, Trigonometry, and Circles.',
    features: [
      'Prescribed textbook for Class 10 SSC & CBSE Board exams across India',
      'Step-by-step rigorous geometric proofs and coordinate graphing examples',
      'Graded practice exercises ranging from basic concept checks to high-order thinking problems',
      'Official syllabus foundation for secondary board examinations and NTSE / Olympiad prep'
    ]
  },
  // 2. Notebooks
  {
    _id: 'nb-1',
    title: 'Classmate Premium Single Line Notebook - 200 Pages (Pack of 6)',
    author: 'ITC Classmate',
    publisher: 'ITC Limited - Education & Stationery Products Business',
    edition: '2024 Premium Student Edition',
    isbn: '8901058852332',
    language: 'Single Line Ruled',
    pages: '200 Pages each (1,200 Pages total across 6 books)',
    binding: 'Center Stapled with Rounded Safety Corners',
    dimensions: '240 mm x 180 mm (Crown Size)',
    weight: '1.45 kg (Pack of 6)',
    price: 360,
    originalPrice: 420,
    category: 'Notebooks',
    inStock: true,
    rating: 4.7,
    badge: 'Top Choice',
    image: '/images/products/classmate-notebooks.jpg',
    description: 'Pack of 6 high-finish ITC Classmate single-line ruled notebooks featuring ozone-treated Elemental Chlorine Free (ECF) paper. Superior whiteness and smooth surface prevents feathering and ink bleed-through with fountain and gel pens.',
    features: [
      'Eco-friendly Elemental Chlorine Free (ECF) ozone-treated 58 GSM paper',
      'Vibrant front covers featuring nature, space, and wildlife facts to engage curiosity',
      'Special rounded safety corners protect school bag lining from dog-eared paper wear',
      'Pre-formatted index page with teacher signature log and page numbering grid'
    ]
  },
  {
    _id: 'nb-2',
    title: 'Sri Thirumala Hard Bound Practical Register - 120 Pages',
    author: 'Sri Thirumala Press',
    publisher: 'Sri Thirumala Press & Paper Mills, Station Road, Kamareddy',
    edition: 'Standard Board Lab Format',
    isbn: 'STB-REG-120P',
    language: 'Bilingual (Alternate Ruled / Blank Lab Format)',
    pages: '120 Heavy-Gauge Pages',
    binding: 'Hard Bound Maroon/Blue Board with Calico Cloth Spine',
    dimensions: '280 mm x 220 mm (Full Scap Standard)',
    weight: '340 grams',
    price: 85,
    originalPrice: 100,
    category: 'Notebooks',
    inStock: true,
    rating: 4.6,
    badge: 'Store Special',
    image: '/images/products/practical-register.jpg',
    description: 'Heavy hardbound laboratory practical record book specifically manufactured to Telangana State Board & University specifications. Designed with one side ruled for observation calculations and the facing side unruled for experimental schematics and circuit diagrams.',
    features: [
      'Heavy 70 GSM archival cartridge paper withstands repeated erasing and ruler drafting',
      'Reinforced calico cloth spine prevents loose-leaf separation throughout semester submissions',
      'Printed standard laboratory index template with experiment serials, date, and marks columns',
      'Directly accepted by all junior colleges, polytechnics, and engineering degree institutes in Kamareddy'
    ]
  },
  // 3. School Supplies
  {
    _id: 'ss-1',
    title: 'Maped Premium Mathematical Geometry Box',
    author: 'Maped Essentials',
    publisher: 'Maped Stationery Tools',
    edition: 'Precision Student Metal Set',
    isbn: '3154141194103',
    language: 'Universal Dual Metric (cm & mm)',
    binding: 'Shock-Resistant Embossed Metal Tin Case',
    dimensions: '175 mm x 85 mm x 22 mm',
    weight: '185 grams',
    price: 180,
    originalPrice: 220,
    category: 'School Supplies',
    inStock: true,
    rating: 4.8,
    badge: '15% OFF',
    image: '/images/products/maped-geometry-box.jpg',
    description: 'All-metal precision mathematical drawing instrument set housed in a crush-proof embossed metal tin. Features self-centering zinc alloy compass and divider alongside anti-scratch transparent drafting tools for neat technical drawings.',
    features: [
      'Heavy-duty die-cast metal self-centering compass and divider with ergonomic knurled grips',
      'Optical-grade scratch-resistant 15cm ruler, 180° protractor, 45° set square, and 60° set square',
      'Includes dedicated mini wooden graphite pencil, dust-free vinyl eraser, and sharp steel sharpener',
      'Form-fitted plastic internal organizer prevents bent needle tips and keeps instruments secure'
    ]
  },
  // 4. Engineering Materials
  {
    _id: 'eng-1',
    title: 'Higher Engineering Mathematics - 44th Edition',
    author: 'Dr. B.S. Grewal',
    publisher: 'Khanna Publishers, New Delhi',
    edition: '44th Golden Jubilee Edition (Comprehensive Reprint)',
    isbn: '978-81-7409-195-5',
    language: 'English',
    pages: '1,314 Pages',
    binding: 'Hardcover Deluxe Maroon with Gold Foil Embossing',
    curriculum: 'AICTE / JNTUH / Osmania / AU / Anna University Engineering Syllabi',
    price: 850,
    originalPrice: 995,
    category: 'Engineering Materials',
    inStock: true,
    rating: 4.9,
    badge: 'Semester Standard',
    image: '/images/products/engineering-maths.jpg',
    description: 'The definitive textbook for undergraduate engineering students across India. Comprehensive coverage of Applied Mathematics, Differential Calculus, Vector Algebra, Partial Differential Equations, Fourier Series, Laplace Transforms, Numerical Methods, and Probability Distributions.',
    features: [
      'Official syllabus benchmark for B.Tech & B.E students across all engineering branches',
      'Contains over 1,500 fully worked textbook examples and 3,000 graded university exercises',
      'Detailed analytical solutions for common engineering entrance and GATE examination mathematics',
      'Clear pedagogical layout with summary formulas, step-by-step algorithms, and chapter tables'
    ]
  },
  // 5. Question Banks
  {
    _id: 'qb-1',
    title: 'VGS SSC Class 10 General Science Solved Question Bank',
    author: 'VGS Editorial Board',
    publisher: 'VGS Publications, Hyderabad',
    edition: '2025 Telangana Board Exam Special Edition',
    isbn: '978-93-8451-229-1',
    language: 'English Medium (With Telugu Technical Glossary)',
    pages: '272 Pages',
    binding: 'Paperback',
    curriculum: 'Telangana State SSC Board (Class 10)',
    price: 140,
    originalPrice: 165,
    category: 'Question Banks',
    inStock: true,
    rating: 4.9,
    badge: 'Bestseller',
    image: '/images/products/vgs-ssc-science.jpg',
    description: 'The most popular Telangana SSC Class 10 General Science preparation handbook. Organized chapter-by-chapter according to official Academic Standards (Conceptual Understanding, Hypothesis, Experimentation, Information Skills, and Drawing Blueprints).',
    features: [
      'Past 10 years of fully solved Telangana SSC public examination question papers with model answers',
      'Clear, neatly labelled ray diagrams, human eye/heart cross-sections, and botanical cellular illustrations',
      'Chapter-end 1-mark and 2-mark sure-shot questions tailored for securing 10/10 GPA',
      'Official blueprint breakdown explaining weightage by chapter and marking scheme guidelines'
    ]
  },
  // 6. Competitive Exam Books
  {
    _id: 'comp-1',
    title: 'Quantitative Aptitude for Competitive Examinations',
    author: 'Dr. R.S. Aggarwal',
    publisher: 'S. Chand Publishing, New Delhi',
    edition: 'Latest Revised & Fully Solved Multi-Color Edition',
    isbn: '978-93-5253-402-9',
    language: 'English',
    pages: '960 Pages',
    binding: 'Paperback',
    curriculum: 'UPSC CSAT, TSPSC, SSC CGL/CHSL, IBPS Bank PO/Clerk, Railways RRB, MBA/CAT',
    price: 590,
    originalPrice: 695,
    category: 'Competitive Exam Books',
    inStock: true,
    rating: 4.9,
    badge: 'Must Have',
    image: '/images/products/rs-aggarwal-quant.jpg',
    description: 'The golden benchmark preparatory book for quantitative ability in Indian competitive exams. Packed with over 5,500 questions covering arithmetic, commercial math, geometry, trigonometry, algebra, and graphical data interpretation with step-by-step solutions.',
    features: [
      'Over 5,500 questions arranged from foundational concepts to advanced competitive difficulty',
      'Speed mathematics shortcuts, Vedic math methods, and formula cheat sheets for exam halls',
      'Comprehensive coverage of Data Interpretation (Bar Graphs, Pie Charts, Line Graphs, Tabulation)',
      'Trusted by over 25 million successful job aspirants and competitive exam rankers'
    ]
  },
  {
    _id: 'comp-2',
    title: 'TSPSC Group-IV General Knowledge Study Guide',
    author: 'Vijeta Competitions Editorial Board',
    publisher: 'Vijeta Competitions, Hyderabad',
    edition: '2024-2025 Latest Telangana Recruitment Edition',
    isbn: '978-93-8947-663-8',
    language: 'Bilingual (English & Telugu Medium Notes)',
    pages: '680 Pages',
    binding: 'Paperback',
    curriculum: 'Telangana State Public Service Commission (TSPSC) Group-IV Examination',
    price: 320,
    originalPrice: 380,
    category: 'Competitive Exam Books',
    inStock: true,
    rating: 4.8,
    badge: 'Latest Release',
    image: '/images/products/tspsc-group4-guide.jpg',
    description: 'Comprehensive study material specifically formulated for TSPSC Group-IV recruitment. Complete syllabus coverage for Paper 1 (General Studies) and Paper 2 (Secretarial & Mental Abilities) with comprehensive focus on Telangana history, geography, and governance schemes.',
    features: [
      'Extensive sections on Telangana Formation Movement, State Culture, Heritage, and Welfare Policies',
      'Section-wise theory, multiple-choice questions, and solved previous TSPSC recruitment papers',
      'Paper-II Secretarial Abilities: Mental Ability, Logical Reasoning, Comprehension & Rearrangement',
      'Bilingual format with clear terminology in both English and Telugu for maximum retention'
    ]
  },
  // 7. School Bags
  {
    _id: 'bag-1',
    title: 'Skybags Ergonomic Triple-Compartment School Backpack',
    author: 'Skybags Design Studio',
    publisher: 'VIP Industries Limited',
    edition: 'Student Pro 2024 Edition',
    isbn: 'SKU: SKY-BP-32L-BLU',
    language: 'Universal',
    pages: '32 Liters Capacity',
    binding: 'Tear-Resistant 600D Dobby Polyester Fabric',
    dimensions: '48 cm x 33 cm x 22 cm',
    weight: '540 grams',
    price: 1199,
    originalPrice: 1699,
    category: 'School Bags',
    inStock: true,
    rating: 4.7,
    badge: 'Heavy Discount',
    image: '/images/products/skybags-school-backpack.jpg',
    description: 'Ergonomic 32-liter student backpack designed to distribute book weight evenly across developing spines. Features three cavernous zippered compartments, dual bottle mesh pockets, rain protection flap, and breathable air-mesh shoulder cushioning.',
    features: [
      '3 full-size zippered compartments easily accommodating 10-15 thick textbooks and registers',
      'Anatomical S-curved shoulder straps with thick breathable mesh padding preventing shoulder fatigue',
      'Heavy-duty double-stitched stress points and water-repellent PU-coated exterior fabric',
      'Side quick-access mesh pouch fitting 1-liter thermos water bottles with elastic stability loops'
    ]
  },
  // 8. College Bags
  {
    _id: 'bag-2',
    title: 'Wildcraft Unisex Laptop College Backpack',
    author: 'Wildcraft Gear Works',
    publisher: 'Wildcraft India Private Limited',
    edition: 'Urban Commuter Series (Model 2024)',
    isbn: 'SKU: WC-LAP-30L-BLK',
    language: 'Universal',
    pages: '30 Liters Capacity',
    binding: 'High-Density 420D Nylon Ripstop with Weatherproof PU Coating',
    dimensions: '46 cm x 31 cm x 20 cm',
    weight: '620 grams',
    price: 1499,
    originalPrice: 1999,
    category: 'College Bags',
    inStock: true,
    rating: 4.8,
    badge: 'Waterproof',
    image: '/images/products/wildcraft-college-backpack.jpg',
    description: 'Urban commuter laptop backpack built with ultra-durable ripstop nylon fabric. Features a dedicated padded protective sleeve for up to 15.6-inch laptops, an internal stationery organizer, anti-theft rear stash pocket, and ergonomic back airflow channels.',
    features: [
      'Padded shock-absorbing laptop compartment accommodating laptops and tablets up to 15.6 inches',
      'Weather-resistant 420D nylon ripstop shell that repels monsoon downpours and dust',
      'Multi-level internal stationery organizer with dedicated key clip, pen slots, and charger pouch',
      'Ergonomic back panel with air-flow ventilation channels to keep back cool during daily travel'
    ]
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
