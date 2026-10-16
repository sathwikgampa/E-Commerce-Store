const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getTransactions,
  addIncomingStock,
  addOutgoingStock,
  getLowStockProducts,
  getSuppliers,
  createSupplier
} = require('../controllers/inventoryController');

router.get('/stats', getDashboardStats);
router.get('/transactions', getTransactions);
router.post('/incoming', addIncomingStock);
router.post('/outgoing', addOutgoingStock);
router.get('/low-stock', getLowStockProducts);
router.route('/suppliers')
  .get(getSuppliers)
  .post(createSupplier);

module.exports = router;
