const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id, role = 'customer') => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'supersecretjwtkey',
    { expiresIn: '30d' }
  );
};

// Format currency as INR
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Generate standard Order ID
const generateOrderId = () => {
  return `STM-${Date.now().toString().slice(-6)}`;
};

module.exports = {
  generateToken,
  formatCurrency,
  generateOrderId
};
