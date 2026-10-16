const InventoryTransaction = require('../models/InventoryTransaction');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const mongoose = require('mongoose');

// In-memory fallback transactions
let inMemoryTransactions = [
  {
    transactionId: 'TXN-809214',
    productTitle: 'NCERT Physics Class 12 (Part 1 & 2)',
    type: 'INCOMING',
    quantity: 50,
    previousStock: 10,
    newStock: 60,
    supplierName: 'NCERT Regional Depot Hyderabad',
    invoiceNumber: 'INV-2025-0981',
    reason: 'New Academic Session Consignment',
    date: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    transactionId: 'TXN-809215',
    productTitle: 'Classmate Premium Single Line Notebook - 200 Pages (Pack of 6)',
    type: 'OUTGOING',
    quantity: 20,
    previousStock: 100,
    newStock: 80,
    reason: 'Counter Retail Sale',
    date: new Date(Date.now() - 86400000).toISOString()
  }
];

let inMemorySuppliers = [
  {
    _id: 'sup-1',
    name: 'NCERT Regional Depot Hyderabad',
    contactPerson: 'S. K. Ramanathan',
    phone: '+91 94401 22345',
    email: 'depot.hyderabad@ncert.gov.in',
    address: 'LB Nagar, Hyderabad, Telangana - 500074',
    gstNumber: '36AAAAA0000A1Z5',
    categoriesSupplied: ['Textbooks'],
    status: 'Active'
  },
  {
    _id: 'sup-2',
    name: 'ITC Stationery Products Division',
    contactPerson: 'Ramesh Reddy',
    phone: '+91 98480 33412',
    email: 'sales.reddy@itc.in',
    address: 'Secunderabad Logistics Park, Hyderabad',
    gstNumber: '36AAACI1681G1ZM',
    categoriesSupplied: ['Notebooks', 'Stationery'],
    status: 'Active'
  }
];

// @desc    Get Inventory Dashboard Statistics
// @route   GET /api/inventory/stats
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const totalProducts = await Product.countDocuments();
      const products = await Product.find();
      const totalStock = products.reduce((acc, p) => acc + (p.stockQuantity || 0), 0);
      const lowStockCount = products.filter(
        (p) => (p.stockQuantity || 0) <= (p.lowStockThreshold || 10)
      ).length;
      const totalSuppliers = await Supplier.countDocuments();
      const totalTransactions = await InventoryTransaction.countDocuments();

      return res.json({
        totalProducts,
        totalStock,
        lowStockCount,
        totalSuppliers,
        totalTransactions
      });
    }

    res.json({
      totalProducts: 11,
      totalStock: 342,
      lowStockCount: 2,
      totalSuppliers: inMemorySuppliers.length,
      totalTransactions: inMemoryTransactions.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all inventory movement transactions
// @route   GET /api/inventory/transactions
// @access  Admin
const getTransactions = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const transactions = await InventoryTransaction.find().sort({ createdAt: -1 });
      return res.json(transactions.length > 0 ? transactions : inMemoryTransactions);
    }
    res.json(inMemoryTransactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add incoming stock consignment
// @route   POST /api/inventory/incoming
// @access  Admin
const addIncomingStock = async (req, res) => {
  try {
    const { productId, productTitle, quantity, supplierName, invoiceNumber, unitCost, notes } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than zero' });
    }

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(productId)) {
      const product = await Product.findById(productId);
      if (product) {
        const prev = product.stockQuantity || 0;
        const next = prev + Number(quantity);
        product.stockQuantity = next;
        product.inStock = next > 0;
        await product.save();

        const txn = new InventoryTransaction({
          product: product._id,
          productTitle: product.title,
          type: 'INCOMING',
          quantity: Number(quantity),
          previousStock: prev,
          newStock: next,
          unitCost: unitCost || 0,
          totalValue: (unitCost || 0) * Number(quantity),
          supplierName: supplierName || '',
          invoiceNumber: invoiceNumber || '',
          reason: notes || 'Incoming stock shipment'
        });
        await txn.save();
        return res.status(201).json({ message: 'Stock received and logged', transaction: txn });
      }
    }

    // In-memory fallback
    const newTxn = {
      transactionId: `TXN-${Date.now().toString().slice(-6)}`,
      productTitle: productTitle || 'Item',
      type: 'INCOMING',
      quantity: Number(quantity),
      previousStock: 20,
      newStock: 20 + Number(quantity),
      supplierName: supplierName || '',
      invoiceNumber: invoiceNumber || '',
      reason: notes || 'Incoming consignment',
      date: new Date().toISOString()
    };
    inMemoryTransactions.unshift(newTxn);
    res.status(201).json({ message: 'Stock logged in fallback session', transaction: newTxn });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Record outgoing stock (counter sale, school delivery, damaged)
// @route   POST /api/inventory/outgoing
// @access  Admin
const addOutgoingStock = async (req, res) => {
  try {
    const { productId, productTitle, quantity, type, reason } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than zero' });
    }

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(productId)) {
      const product = await Product.findById(productId);
      if (product) {
        const prev = product.stockQuantity || 0;
        const next = Math.max(0, prev - Number(quantity));
        product.stockQuantity = next;
        product.inStock = next > 0;
        await product.save();

        const txn = new InventoryTransaction({
          product: product._id,
          productTitle: product.title,
          type: type || 'OUTGOING',
          quantity: Number(quantity),
          previousStock: prev,
          newStock: next,
          reason: reason || 'Stock outflow'
        });
        await txn.save();
        return res.status(201).json({ message: 'Stock dispatched and ledger updated', transaction: txn });
      }
    }

    const newTxn = {
      transactionId: `TXN-${Date.now().toString().slice(-6)}`,
      productTitle: productTitle || 'Item',
      type: type || 'OUTGOING',
      quantity: Number(quantity),
      previousStock: 40,
      newStock: Math.max(0, 40 - Number(quantity)),
      reason: reason || 'Outgoing dispatch',
      date: new Date().toISOString()
    };
    inMemoryTransactions.unshift(newTxn);
    res.status(201).json({ message: 'Outgoing stock logged', transaction: newTxn });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all low-stock products
// @route   GET /api/inventory/low-stock
// @access  Admin
const getLowStockProducts = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const products = await Product.find({
        $expr: { $lte: ['$stockQuantity', '$lowStockThreshold'] }
      });
      return res.json(products);
    }
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get suppliers directory
// @route   GET /api/inventory/suppliers
// @access  Admin
const getSuppliers = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const suppliers = await Supplier.find().sort({ name: 1 });
      return res.json(suppliers.length > 0 ? suppliers : inMemorySuppliers);
    }
    res.json(inMemorySuppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new supplier
// @route   POST /api/inventory/suppliers
// @access  Admin
const createSupplier = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const supplier = new Supplier(req.body);
      const saved = await supplier.save();
      return res.status(201).json(saved);
    }

    const newSupplier = { ...req.body, _id: `sup-${Date.now()}` };
    inMemorySuppliers.push(newSupplier);
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getTransactions,
  addIncomingStock,
  addOutgoingStock,
  getLowStockProducts,
  getSuppliers,
  createSupplier
};
