require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

// Legacy admin login backward compatibility
const { adminLogin } = require('./controllers/authController');

// Middleware imports
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const upload = require('./middleware/uploadMiddleware');

// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    store: 'Sri Thirumala Book & Stationery Store'
  });
});

// Primary API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/inventory', inventoryRoutes);

// Backwards compatibility endpoint for existing admin frontend login
app.post('/api/admin/login', adminLogin);

// Product Image Upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({
    message: 'Image uploaded successfully',
    imageUrl: `/uploads/${req.file.filename}`
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Sri Thirumala Server running on port ${PORT}`);
});

module.exports = app;
