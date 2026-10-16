const mongoose = require('mongoose');

const InventoryTransactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      unique: true,
      default: () => `TXN-${Date.now().toString().slice(-8)}`
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    productIdString: {
      type: String,
      default: ''
    },
    productTitle: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['INCOMING', 'OUTGOING', 'DAMAGED', 'RETURNED', 'ADJUSTMENT'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    previousStock: {
      type: Number,
      default: 0
    },
    newStock: {
      type: Number,
      default: 0
    },
    unitCost: {
      type: Number,
      default: 0
    },
    totalValue: {
      type: Number,
      default: 0
    },
    supplierName: {
      type: String,
      default: ''
    },
    invoiceNumber: {
      type: String,
      default: ''
    },
    reason: {
      type: String,
      default: ''
    },
    performedBy: {
      type: String,
      default: 'Admin'
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('InventoryTransaction', InventoryTransactionSchema);
