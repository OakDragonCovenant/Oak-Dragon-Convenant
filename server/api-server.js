// Simple Express backend for LenderAgent and Bank Loan Bot API endpoints

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// --- Security: API Key Middleware ---
const API_KEY = process.env.API_KEY || 'dragon-secret-key';
app.use('/api', (req, res, next) => {
  const key = req.headers['x-api-key'];
  if (key !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }
  next();
});

// In-memory lender list (simulate discovery)
let lenders = [
  { name: 'Live Oak Bank', email: 'info@liveoakbank.com', website: 'https://liveoakbank.com' },
  { name: 'Wells Fargo', email: 'business@wellsfargo.com', website: 'https://wellsfargo.com/biz' },
  { name: 'Kabbage (AmEx)', email: 'support@kabbage.com', website: 'https://kabbage.com' }
];

// In-memory loan applications
let applications = [];

// LenderAgent endpoint
app.get('/api/lenders/discover', (req, res) => {
  res.json(lenders);
});

// Bank Loan Bot endpoints
app.get('/api/loan-applications', (req, res) => {
  res.json(applications);
});

app.post('/api/loan-applications', (req, res) => {
  const appData = req.body;
  appData.id = Date.now();
  appData.status = 'Under Review';
  applications.push(appData);
  res.json({ success: true, id: appData.id });
});

app.delete('/api/loan-applications/:id', (req, res) => {
  const id = parseInt(req.params.id);
  applications = applications.filter(a => a.id !== id);
  res.json({ success: true });
});

// AI Lender Match endpoint (simulated)
app.get('/api/lenders/match', (req, res) => {
  res.json([
    { name: 'Live Oak Bank', match: 92 },
    { name: 'Wells Fargo', match: 88 }
  ]);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API server running on port ${PORT}`));
