const Product = require('../models/Product');
const mongoose = require('mongoose');

// Seed / Fallback catalog for regional Sri Thirumala bookstore
const initialProducts = [
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
    stockQuantity: 45,
    lowStockThreshold: 10,
    rating: 4.8,
    badge: 'State Recommended',
    image: '/images/products/ncert-physics-12.jpg',
    description: 'The official recommended physics textbook set for Class 12 Intermediate CBSE and State Board examinations. Features comprehensive treatment of Electrostatics, Current Electricity, Magnetism, Optics, and Modern Physics with solved numericals and NCERT exemplar questions.',
    features: [
      'Strictly aligned with latest NCERT rationalised syllabus and NEP 2020 guidelines',
      'Includes both Volume I (Mechanics, Electromagnetism) and Volume II (Optics, Modern Physics)',
      'Essential base reference for CBSE Board, JEE Main & Advanced, and NEET entrance tests'
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
    stockQuantity: 60,
    lowStockThreshold: 15,
    rating: 4.9,
    badge: 'Core Curriculum',
    image: '/images/products/ncert-maths-10.jpg',
    description: 'The core mathematics textbook prescribed for Class 10 students. Covers foundational and advanced secondary mathematics including Real Numbers, Polynomials, Linear Equations, Quadratic Equations, Arithmetic Progressions, Coordinate Geometry, Trigonometry, and Circles.',
    features: [
      'Prescribed textbook for Class 10 SSC & CBSE Board exams across India',
      'Step-by-step rigorous geometric proofs and coordinate graphing examples'
    ]
  },
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
    price: 360,
    originalPrice: 420,
    category: 'Notebooks',
    inStock: true,
    stockQuantity: 80,
    lowStockThreshold: 20,
    rating: 4.7,
    badge: 'Top Choice',
    image: '/images/products/classmate-notebooks.jpg',
    description: 'Pack of 6 high-finish ITC Classmate single-line ruled notebooks featuring ozone-treated Elemental Chlorine Free (ECF) paper.',
    features: ['Eco-friendly Elemental Chlorine Free (ECF) paper', 'Smooth 58 GSM paper prevents ink bleed-through']
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
    price: 85,
    originalPrice: 100,
    category: 'Notebooks',
    inStock: true,
    stockQuantity: 30,
    lowStockThreshold: 10,
    rating: 4.6,
    badge: 'Store Special',
    image: '/images/products/practical-register.jpg',
    description: 'Heavy hardbound laboratory practical record book specifically manufactured to Telangana State Board & University specifications.',
    features: ['Heavy 70 GSM archival cartridge paper', 'Reinforced calico cloth spine']
  },
  {
    _id: 'ss-1',
    title: 'Maped Premium Mathematical Geometry Box',
    author: 'Maped Essentials',
    publisher: 'Maped Stationery Tools',
    edition: 'Precision Student Metal Set',
    isbn: '3154141194103',
    language: 'Universal Dual Metric (cm & mm)',
    binding: 'Shock-Resistant Embossed Metal Tin Case',
    price: 180,
    originalPrice: 220,
    category: 'School Supplies',
    inStock: true,
    stockQuantity: 25,
    lowStockThreshold: 5,
    rating: 4.8,
    badge: '15% OFF',
    image: '/images/products/maped-geometry-box.jpg',
    description: 'All-metal precision mathematical drawing instrument set housed in a crush-proof embossed metal tin.',
    features: ['Heavy-duty die-cast metal self-centering compass', 'Optical-grade scratch-resistant 15cm ruler & set squares']
  },
  {
    _id: 'eng-1',
    title: 'Higher Engineering Mathematics - 44th Edition',
    author: 'Dr. B.S. Grewal',
    publisher: 'Khanna Publishers, New Delhi',
    edition: '44th Golden Jubilee Edition',
    isbn: '978-81-7409-195-5',
    language: 'English',
    pages: '1,314 Pages',
    binding: 'Hardcover Deluxe Maroon with Gold Foil Embossing',
    curriculum: 'AICTE / JNTUH / Osmania University Engineering Syllabi',
    price: 850,
    originalPrice: 995,
    category: 'Engineering Materials',
    inStock: true,
    stockQuantity: 15,
    lowStockThreshold: 4,
    rating: 4.9,
    badge: 'Semester Standard',
    image: '/images/products/engineering-maths.jpg',
    description: 'The definitive textbook for undergraduate engineering students across India.',
    features: ['Official syllabus benchmark for B.Tech & B.E students', 'Over 1,500 solved textbook examples']
  },
  {
    _id: 'qb-1',
    title: 'VGS SSC Class 10 General Science Solved Question Bank',
    author: 'VGS Editorial Board',
    publisher: 'VGS Publications, Hyderabad',
    edition: '2025 Telangana Board Exam Special Edition',
    isbn: '978-93-8451-229-1',
    language: 'English Medium',
    pages: '272 Pages',
    binding: 'Paperback',
    curriculum: 'Telangana State SSC Board (Class 10)',
    price: 140,
    originalPrice: 165,
    category: 'Question Banks',
    inStock: true,
    stockQuantity: 50,
    lowStockThreshold: 10,
    rating: 4.9,
    badge: 'Bestseller',
    image: '/images/products/vgs-ssc-science.jpg',
    description: 'The most popular Telangana SSC Class 10 General Science preparation handbook.',
    features: ['Past 10 years of solved question papers', 'Accurate labelled ray diagrams']
  },
  {
    _id: 'comp-1',
    title: 'Quantitative Aptitude for Competitive Examinations',
    author: 'Dr. R.S. Aggarwal',
    publisher: 'S. Chand Publishing, New Delhi',
    edition: 'Revised & Fully Solved Edition',
    isbn: '978-93-5253-402-9',
    language: 'English',
    pages: '960 Pages',
    binding: 'Paperback',
    curriculum: 'UPSC CSAT, TSPSC, SSC, Bank PO, Railways',
    price: 590,
    originalPrice: 695,
    category: 'Competitive Exam Books',
    inStock: true,
    stockQuantity: 20,
    lowStockThreshold: 5,
    rating: 4.9,
    badge: 'Must Have',
    image: '/images/products/rs-aggarwal-quant.jpg',
    description: 'The golden benchmark preparatory book for quantitative ability in Indian competitive exams.',
    features: ['Over 5,500 questions with step-by-step solutions', 'Speed mathematics shortcuts']
  },
  {
    _id: 'comp-2',
    title: 'TSPSC Group-IV General Knowledge Study Guide',
    author: 'Vijeta Competitions Editorial Board',
    publisher: 'Vijeta Competitions, Hyderabad',
    edition: '2024-2025 Latest Telangana Recruitment Edition',
    isbn: '978-93-8947-663-8',
    language: 'Bilingual (English & Telugu)',
    pages: '680 Pages',
    binding: 'Paperback',
    curriculum: 'TSPSC Group-IV Services',
    price: 320,
    originalPrice: 380,
    category: 'Competitive Exam Books',
    inStock: true,
    stockQuantity: 35,
    lowStockThreshold: 8,
    rating: 4.8,
    badge: 'Latest Release',
    image: '/images/products/tspsc-group4-guide.jpg',
    description: 'Comprehensive study material specifically formulated for TSPSC Group-IV recruitment.',
    features: ['Telangana Movement & State Formation chapters', 'Paper 1 & Paper 2 complete theory & MCQs']
  },
  {
    _id: 'bag-1',
    title: 'Skybags Ergonomic Triple-Compartment School Backpack',
    author: 'Skybags Design Studio',
    publisher: 'VIP Industries Limited',
    edition: 'Student Pro 2024 Edition',
    isbn: 'SKU: SKY-BP-32L-BLU',
    price: 1199,
    originalPrice: 1699,
    category: 'School Bags',
    inStock: true,
    stockQuantity: 12,
    lowStockThreshold: 3,
    rating: 4.7,
    badge: 'Heavy Discount',
    image: '/images/products/skybags-school-backpack.jpg',
    description: 'Ergonomic 32-liter student backpack designed to distribute book weight evenly across developing spines.',
    features: ['3 full-size zippered compartments', 'Anatomical air-mesh shoulder cushioning']
  },
  {
    _id: 'bag-2',
    title: 'Wildcraft Unisex Laptop College Backpack',
    author: 'Wildcraft Gear Works',
    publisher: 'Wildcraft India Private Limited',
    edition: 'Urban Commuter Series',
    isbn: 'SKU: WC-LAP-30L-BLK',
    price: 1499,
    originalPrice: 1999,
    category: 'College Bags',
    inStock: true,
    stockQuantity: 10,
    lowStockThreshold: 2,
    rating: 4.8,
    badge: 'Waterproof',
    image: '/images/products/wildcraft-college-backpack.jpg',
    description: 'Urban commuter laptop backpack built with ultra-durable ripstop nylon fabric.',
    features: ['Padded 15.6" laptop compartment', 'Weather-resistant ripstop nylon shell']
  }
];

let inMemoryProducts = [...initialProducts];

// @desc    Fetch all products with optional search & filter
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search, inStock } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = {};

      if (category && category !== 'All') {
        query.category = category;
      }

      if (inStock !== undefined) {
        query.inStock = inStock === 'true';
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
          { publisher: { $regex: search, $options: 'i' } },
          { isbn: { $regex: search, $options: 'i' } }
        ];
      }

      const products = await Product.find(query).sort({ createdAt: -1 });
      return res.json(products.length > 0 ? products : inMemoryProducts);
    }

    // In-memory fallback
    let filtered = [...inMemoryProducts];
    if (category && category !== 'All') {
      filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(s) ||
          p.author?.toLowerCase().includes(s) ||
          p.publisher?.toLowerCase().includes(s) ||
          p.isbn?.toLowerCase().includes(s)
      );
    }
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const product = await Product.findById(id);
      if (product) return res.json(product);
    }

    const found = inMemoryProducts.find((p) => p._id.toString() === id);
    if (found) return res.json(found);

    res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Public / Admin
const createProduct = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const product = new Product(req.body);
      const saved = await product.save();
      return res.status(201).json(saved);
    }

    const newProduct = {
      ...req.body,
      _id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    inMemoryProducts.unshift(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
      if (updated) return res.json(updated);
    }

    const index = inMemoryProducts.findIndex((p) => p._id.toString() === id);
    if (index !== -1) {
      inMemoryProducts[index] = { ...inMemoryProducts[index], ...req.body };
      return res.json(inMemoryProducts[index]);
    }

    res.status(404).json({ message: 'Product not found' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      await Product.findByIdAndDelete(id);
      return res.json({ message: 'Product deleted successfully' });
    }

    inMemoryProducts = inMemoryProducts.filter((p) => p._id.toString() !== id);
    res.json({ message: 'Product removed from catalog' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
