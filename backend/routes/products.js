const express = require('express');
const router = express.Router();
const products = require('../data/products.json');

// GET /api/products — list all products, with optional filters
router.get('/', (req, res) => {
  let result = [...products];

  // Filter by category
  if (req.query.category) {
    const cat = req.query.category.toLowerCase();
    result = result.filter(p => p.category === cat);
  }

  // Search by name or description
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: result.length, data: result });
});

// GET /api/products/categories — list distinct categories
router.get('/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  const categoryInfo = categories.map(cat => {
    const count = products.filter(p => p.category === cat).length;
    const icons = {
      fruits: '🍎',
      vegetables: '🥬',
      dairy: '🥛',
      bakery: '🍞',
      beverages: '☕',
      snacks: '🥜'
    };
    return { name: cat, icon: icons[cat] || '📦', count };
  });
  res.json({ success: true, data: categoryInfo });
});

// GET /api/products/:id — single product
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

module.exports = router;
