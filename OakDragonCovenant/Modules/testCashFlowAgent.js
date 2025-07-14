const CashFlowAgent = require('./cashFlowAgent');
const cf = new CashFlowAgent();

cf.recordIncome('Rent', 1200);
cf.recordExpense('Repair: Leaky faucet', 150);
cf.recordExpense('Property manager fees', 100);

const net = cf.getNetCashFlow();
console.log('Net Cash Flow:', net);