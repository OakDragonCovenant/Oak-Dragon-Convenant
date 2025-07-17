const express = require('express');
const router = express.Router();

// In-memory product store for demo (replace with DB in production)
let products = [
  { name: 'Sample T-Shirt', sku: 'TSHIRT001', price: 19.99 },
  { name: 'Coffee Mug', sku: 'MUG001', price: 12.5 },
  { name: 'Digital Download', sku: 'DIGI001', price: 7.99 }
];

// GET /api/products?search=keyword
router.get('/', (req, res) => {
  const search = (req.query.search || '').toLowerCase();
  if (!search) return res.json([]);
  const results = products.filter(p =>
    p.name.toLowerCase().includes(search) ||
    (p.sku && p.sku.toLowerCase().includes(search))
  );
  res.json(results);
});

// POST /api/products (create new product)
router.post('/', (req, res) => {
  const { name, sku, price } = req.body;
  if (!name || !sku || typeof price !== 'number') {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }
  if (products.find(p => p.sku === sku)) {
    return res.status(409).json({ success: false, error: 'SKU already exists' });
  }
  const newProduct = { name, sku, price };
  products.push(newProduct);
  res.json({ success: true, product: newProduct });
});

// PUT /api/products/:sku (update product)
router.put('/:sku', (req, res) => {
  const { sku } = req.params;
  const { name, price } = req.body;
  const product = products.find(p => p.sku === sku);
  if (!product) return res.status(404).json({ success: false, error: 'Product not found' });
  if (name) product.name = name;
  if (typeof price === 'number') product.price = price;
  res.json({ success: true, product });
});

// DELETE /api/products/:sku (remove product)
router.delete('/:sku', (req, res) => {
  const { sku } = req.params;
  const idx = products.findIndex(p => p.sku === sku);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Product not found' });
  const removed = products.splice(idx, 1)[0];
  res.json({ success: true, removed });
});

module.exports = router;
