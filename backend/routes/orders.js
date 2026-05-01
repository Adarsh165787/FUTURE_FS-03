const express = require('express');
const router = express.Router();
const cart = require('../models/Cart');
const orderStore = require('../models/Order');
const products = require('../data/products.json');
const authMiddleware = require('../middleware/auth');

// POST /api/orders — place an order (requires authentication)
router.post('/', authMiddleware, (req, res) => {
  if (cart.isEmpty()) {
    return res.status(400).json({ success: false, error: 'Cart is empty' });
  }

  // Use authenticated user's info, with optional address override
  const { address } = req.body;
  const customerInfo = {
    name: req.user.name,
    phone: req.user.phone || '',
    address: address || req.user.address || ''
  };

  if (!customerInfo.address) {
    return res.status(400).json({
      success: false,
      error: 'Delivery address is required. Please update your profile or provide an address.'
    });
  }

  const cartItems = cart.getItems();
  const order = orderStore.createOrder(cartItems, products, customerInfo);
  order.userId = req.user._id;

  // Clear the cart after placing order
  cart.clear();

  res.status(201).json({
    success: true,
    message: 'Order placed successfully!',
    data: order
  });
});

// GET /api/orders — list orders for the authenticated user
router.get('/', authMiddleware, (req, res) => {
  const allOrders = orderStore.getAll();
  const userOrders = allOrders.filter(o =>
    o.userId && o.userId.toString() === req.user._id.toString()
  );
  res.json({ success: true, count: userOrders.length, data: userOrders });
});

// GET /api/orders/:id — single order (must belong to user)
router.get('/:id', authMiddleware, (req, res) => {
  const order = orderStore.getById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: 'Order not found' });
  }
  if (order.userId && order.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, error: 'Access denied' });
  }
  res.json({ success: true, data: order });
});

module.exports = router;
