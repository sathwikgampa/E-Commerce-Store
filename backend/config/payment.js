// Payment gateway configuration helper
// Supports Razorpay, UPI QR parameters, and Store Cash-on-Delivery (COD)

module.exports = {
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    currency: 'INR'
  },
  storeUpi: {
    upiId: process.env.STORE_UPI_ID || 'srithirumala@upi',
    merchantName: 'Sri Thirumala Book & Stationery Store'
  },
  allowedMethods: ['COD', 'UPI', 'CARD', 'NETBANKING']
};
