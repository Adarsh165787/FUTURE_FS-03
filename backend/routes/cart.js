const express = require('express');
const router = express.Router();
const cart = require('../models/Cart');
const products = require('../data/products.json');

// Helper: populate cart items with full product details + computed prices
function populateCart() {
  const items = cart.getItems().map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return null;

    const originalPrice = product.price;
    const discountedPrice = product.discount > 0
      ? Math.round(originalPrice * (1 - product.discount / 100) * 100) / 100
      : originalPrice;

    return {
      ...item,
      product,
      unitPrice: discountedPrice,
      lineTotal: Math.round(discountedPrice * item.quantity * 100) / 100
    };
  }).filter(Boolean);

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    total: Math.round(subtotal * 100) / 100,
    totalItems
  };
}

// GET /api/cart
router.get('/', (req, res) => {
  res.json({ success: true, data: populateCart() });
});

// POST /api/cart/add
router.post('/add', (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json({ success: false, error: 'productId is required' });
  }

  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  if (!product.inStock) {
    return res.status(400).json({ success: false, error: 'Product is out of stock' });
  }

  cart.addItem(productId, quantity);
  res.json({ success: true, message: `${product.name} added to cart`, data: populateCart() });
});

// PUT /api/cart/update
router.put('/update', (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || quantity === undefined) {
    return res.status(400).json({ success: false, error: 'productId and quantity are required' });
  }

  const result = cart.updateItem(productId, quantity);
  if (result === null) {
    return res.status(404).json({ success: false, error: 'Item not in cart' });
  }

  res.json({ success: true, data: populateCart() });
});

// DELETE /api/cart/remove/:productId
router.delete('/remove/:productId', (req, res) => {
  const result = cart.removeItem(req.params.productId);
  if (result === null) {
    return res.status(404).json({ success: false, error: 'Item not in cart' });
  }

  res.json({ success: true, data: populateCart() });
});

// DELETE /api/cart/clear
router.delete('/clear', (req, res) => {
  cart.clear();
  res.json({ success: true, data: populateCart() });
});

module.exports = router;
