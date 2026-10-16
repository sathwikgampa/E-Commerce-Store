const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide product title'],
      trim: true
    },
    author: {
      type: String,
      default: ''
    },
    publisher: {
      type: String,
      default: ''
    },
    edition: {
      type: String,
      default: ''
    },
    isbn: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: 'English'
    },
    pages: {
      type: String,
      default: ''
    },
    binding: {
      type: String,
      default: 'Paperback'
    },
    curriculum: {
      type: String,
      default: ''
    },
    features: {
      type: [String],
      default: []
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: 0
    },
    originalPrice: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      trim: true
    },
    inStock: {
      type: Boolean,
      default: true
    },
    stockQuantity: {
      type: Number,
      default: 50,
      min: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 0
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5
    },
    ratingCount: {
      type: Number,
      default: 1
    },
    badge: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: '/images/products/default-book.jpg'
    },
    description: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Index for search optimization
ProductSchema.index({ title: 'text', author: 'text', publisher: 'text', isbn: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
