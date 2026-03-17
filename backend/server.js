require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// We'll define routes inline for brevity initially, or separate them. Let's do inline for MVP setup.

// Sample Data
const mockProducts = [
  { title: 'NCERT Physics Class 12', author: 'NCERT', price: 250, category: 'School Books', inStock: true },
  { title: 'Quantitative Aptitude', author: 'R.S. Aggarwal', price: 650, category: 'Competitive Exams', inStock: true }
];

// Product Schema
const ProductSchema = new mongoose.Schema({
  title: String,
  author: String,
  price: Number,
  category: String,
  inStock: Boolean,
  image: String,
  description: String
});
const Product = mongoose.model('Product', ProductSchema);

// Order Schema
const OrderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  paymentMethod: String,
  items: Array,
  totalAmount: Number,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

// API Endpoints: Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products.length > 0 ? products : mockProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API Endpoints: Orders
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Login Demo (JWT bypass for simplicity in MVP, but requested JWT)
const jwt = require('jsonwebtoken');
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if(email === 'admin@bookstore.com' && password === 'admin123') {
    const token = jwt.sign({ id: 'admin1', role: 'admin' }, 'supersecretjwtkey', { expiresIn: '1d' });
    return res.json({ token, message: 'Login successful' });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bookstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
