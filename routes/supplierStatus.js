const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

// Map supplier names to their status page endpoints
const supplierStatusPages = {
  'Printful': 'https://status.printful.com/api/v2/status.json',
  'ShipBob': 'https://status.shipbob.com/api/v2/status.json',
  'Stripe': 'https://status.stripe.com/current',
  'PayPal': 'https://paypal-status.com/api/v1/status',
  'Square': 'https://squareup.statuspage.io/api/v2/status.json',
  'Adyen': 'https://status.adyen.com/api/v2/status.json',
  'Shopify': 'https://status.shopify.com/api/v2/status.json',
  'AWS': 'https://status.aws.amazon.com/data.json'
  // Add more as needed
};

// Helper to fetch and normalize status
async function fetchSupplierStatus(name, url) {
  try {
    const res = await fetch(url, { timeout: 5000 });
    if (!res.ok) throw new Error('Status fetch failed');
    const data = await res.json();
    // Normalize status for known APIs
    let status = 'Unknown';
    if (data.status && data.status.description) status = data.status.description;
    else if (data.status && data.status.indicator) status = data.status.indicator;
    else if (data.status) status = data.status;
    else if (data.current_status) status = data.current_status;
    return { name, status, checkedAt: new Date().toISOString() };
  } catch (e) {
    return { name, status: 'Unavailable', checkedAt: new Date().toISOString() };
  }
}

// GET /api/suppliers/status
router.get('/status', async (req, res) => {
  const statuses = await Promise.all(
    Object.entries(supplierStatusPages).map(([name, url]) => fetchSupplierStatus(name, url))
  );
  res.json(statuses);
});

module.exports = router;
