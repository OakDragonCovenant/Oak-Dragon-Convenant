const express = require('express');
const router = express.Router();
const {
  createZeroSSLCertificate,
  getZeroSSLCertificate,
  verifyZeroSSLCertificate,
  renewZeroSSLCertificate
} = require('../zerossl');

// POST /ssl/certificate
// Body: { domains: string, csr: string, validityDays: number, strictDomains?: number }
router.post('/certificate', async (req, res) => {
  const { domains, csr, validityDays, strictDomains } = req.body;
  if (!domains || !csr || !validityDays) {
    return res.status(400).json({ error: 'domains, csr, and validityDays are required.' });
  }
  try {
    const result = await createZeroSSLCertificate(domains, csr, validityDays, strictDomains);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

// GET /ssl/certificate/:id - Get certificate status/details
router.get('/certificate/:id', async (req, res) => {
  try {
    const result = await getZeroSSLCertificate(req.params.id);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /ssl/certificate/:id/verify - Trigger domain verification
// Body: { validationMethod: 'EMAIL' | 'CNAME_CSR_HASH' | 'HTTP_CSR_HASH' }
router.post('/certificate/:id/verify', async (req, res) => {
  const { validationMethod } = req.body;
  if (!validationMethod) {
    return res.status(400).json({ error: 'validationMethod is required.' });
  }
  try {
    const result = await verifyZeroSSLCertificate(req.params.id, validationMethod);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /ssl/certificate/:id/renew - Renew certificate
router.post('/certificate/:id/renew', async (req, res) => {
  try {
    const result = await renewZeroSSLCertificate(req.params.id);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /ssl/webhook - Webhook endpoint for ZeroSSL notifications
router.post('/webhook', express.json({ type: '*/*' }), (req, res) => {
  // Log or process webhook payload as needed
  console.log('ZeroSSL Webhook received:', req.body);
  res.status(200).json({ received: true });
});
