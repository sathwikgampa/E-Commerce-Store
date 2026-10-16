const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: String
});

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      default: () => `STM-${Date.now().toString().slice(-6)}`
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
      type: String,
      required: [true, 'Please provide customer name']
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number']
    },
    address: {
      type: String,
      required: [true, 'Please provide delivery address or pickup note']
    },
    pincode: {
      type: String,
      default: '503111'
    },
    deliveryType: {
      type: String,
      enum: ['pickup', 'delivery'],
      default: 'pickup'
    },
    deliveryFee: {
      type: Number,
      default: 0
    },
    couponCode: {
      type: String,
      default: null
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    orderNotes: {
      type: String,
      default: ''
    },
    paymentMethod: {
      type: String,
      enum: ['COD', 'UPI', 'ONLINE'],
      default: 'COD'
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: Date,
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String
    },
    items: [OrderItemSchema],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    deliveredAt: Date,
    pickupVerificationCode: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', OrderSchema);
