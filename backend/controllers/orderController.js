const Order = require('../models/Order');
const Product = require('../models/Product');
const { generateOrderId } = require('../utils/helpers');
const { sendOrderConfirmationEmail } = require('../utils/emailService');
const mongoose = require('mongoose');

let inMemoryOrders = [];

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
  try {
    const { name, phone, address, pincode, deliveryType, deliveryFee, couponCode, discountAmount, paymentMethod, items, totalAmount, orderNotes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items found in request' });
    }

    if (mongoose.connection.readyState === 1) {
      const order = new Order({
        name,
        phone,
        address,
        pincode: pincode || '503111',
        deliveryType: deliveryType || 'pickup',
        deliveryFee: deliveryFee || 0,
        couponCode: couponCode || null,
        discountAmount: discountAmount || 0,
        orderNotes: orderNotes || '',
        paymentMethod: paymentMethod || 'COD',
        items,
        totalAmount,
        status: 'Pending',
        pickupVerificationCode: Math.floor(1000 + Math.random() * 9000).toString()
      });

      const savedOrder = await order.save();

      // Trigger asynchronous email confirmation
      sendOrderConfirmationEmail({ to: phone, order: savedOrder }).catch(() => {});

      return res.status(201).json(savedOrder);
    }

    // In-memory fallback
    const fallbackOrder = {
      ...req.body,
      _id: generateOrderId(),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      pickupVerificationCode: Math.floor(1000 + Math.random() * 9000).toString()
    };
    inMemoryOrders.unshift(fallbackOrder);
    res.status(201).json(fallbackOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public / Admin
const getOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json(orders.length > 0 ? orders : inMemoryOrders);
    }
    res.json(inMemoryOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const order = await Order.findById(id);
      if (order) return res.json(order);
    }

    const found = inMemoryOrders.find((o) => o._id === id || o.orderId === id);
    if (found) return res.json(found);

    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Pickup verification or delivery complete)
// @route   PATCH /api/orders/:id/status
// @access  Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, pickupVerificationCode } = req.body;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const order = await Order.findById(id);
      if (order) {
        order.status = status || order.status;
        if (status === 'Delivered') {
          order.deliveredAt = new Date();
          order.isPaid = true;
        }
        const updated = await order.save();
        return res.json(updated);
      }
    }

    const index = inMemoryOrders.findIndex((o) => o._id === id || o.orderId === id);
    if (index !== -1) {
      inMemoryOrders[index].status = status;
      if (status === 'Delivered') inMemoryOrders[index].deliveredAt = new Date().toISOString();
      return res.json(inMemoryOrders[index]);
    }

    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
};
