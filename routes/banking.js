const express = require('express');
const router = express.Router();

// --- In-memory demo data ---
let accounts = [
  { id: 'main', name: 'Main Account', balance: 1200000 },
  { id: 'reserve', name: 'Reserve Account', balance: 200000 },
  { id: 'treasury', name: 'Treasury', balance: 500000 }
];
let loans = [
  { id: '1001', amount: 10000, status: 'active' },
  { id: '1002', amount: 25000, status: 'repaid' }
];
let auditLog = [];

// --- AccountAgent ---
router.post('/accounts', (req, res) => {
  const { id, name, balance } = req.body;
  if (!id || !name) return res.status(400).json({ success: false, error: 'Missing id or name' });
  accounts.push({ id, name, balance: balance || 0 });
  auditLog.push({ type: 'account-create', id, ts: Date.now() });
  res.json({ success: true });
});

// Mark account as closed (for AccountLifecycleAgent)
router.post('/accounts/:id/close', (req, res) => {
  const acc = accounts.find(a => a.id === req.params.id);
  if (!acc) return res.status(404).json({ success: false, error: 'Account not found' });
  acc.status = 'closed';
  auditLog.push({ type: 'account-close', id: acc.id, ts: Date.now() });
  res.json({ success: true });
});

router.get('/accounts', (req, res) => {
  res.json(accounts);
});

// --- TransferAgent ---
router.post('/transfer', (req, res) => {
  const { from, to, amount } = req.body;
  const fromAcc = accounts.find(a => a.id === from);
  const toAcc = accounts.find(a => a.id === to);
  if (!fromAcc || !toAcc) return res.status(400).json({ success: false, error: 'Invalid account' });
  if (fromAcc.balance < amount) return res.status(400).json({ success: false, error: 'Insufficient funds' });
  fromAcc.balance -= amount;
  toAcc.balance += amount;
  auditLog.push({ type: 'transfer', from, to, amount, ts: Date.now() });
  res.json({ success: true });
});

// --- LendingAgent ---
router.post('/loans', (req, res) => {
  const { id, amount } = req.body;
  if (!id || !amount) return res.status(400).json({ success: false, error: 'Missing id or amount' });
  loans.push({ id, amount, status: 'active' });
  auditLog.push({ type: 'loan-create', id, amount, ts: Date.now() });
  res.json({ success: true });
});
router.get('/loans', (req, res) => {
  res.json(loans);
});

// --- ComplianceAgent ---
router.get('/compliance', (req, res) => {
  // Demo: always passes
  auditLog.push({ type: 'compliance-check', ts: Date.now() });
  res.json({ success: true, result: 'pass' });
});

// --- TreasuryAgent ---
router.post('/treasury/optimize', (req, res) => {
  // Demo: just logs
  auditLog.push({ type: 'treasury-optimize', ts: Date.now() });
  res.json({ success: true, result: 'optimized' });
});

// --- DashboardAgent ---
router.get('/dashboard', (req, res) => {
  res.json({
    total: accounts.reduce((sum, a) => sum + a.balance, 0),
    reserve: accounts.find(a => a.id === 'reserve')?.balance || 0,
    accounts,
    loans
  });
});

// --- RulesEngineAgent ---
router.post('/rules/run', (req, res) => {
  auditLog.push({ type: 'rules-run', ts: Date.now() });
  res.json({ success: true, result: 'rules-executed' });
});

// --- IntegrationAgent ---
router.post('/integrations/sync', (req, res) => {
  auditLog.push({ type: 'integrations-sync', ts: Date.now() });
  res.json({ success: true, result: 'integrations-synced' });
});

// --- RiskAgent ---
router.get('/risk', (req, res) => {
  auditLog.push({ type: 'risk-analysis', ts: Date.now() });
  res.json({ success: true, risk: 'low' });
});

// --- AuditAgent ---
router.get('/audit', (req, res) => {
  res.json({ success: true, log: auditLog });
});

module.exports = router;
