const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide supplier name'],
      trim: true
    },
    contactPerson: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      required: [true, 'Please provide supplier phone number'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    gstNumber: {
      type: String,
      trim: true,
      default: ''
    },
    categoriesSupplied: {
      type: [String],
      default: ['Textbooks', 'Notebooks']
    },
    paymentTerms: {
      type: String,
      default: 'Net 30 Days'
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Supplier', SupplierSchema);
