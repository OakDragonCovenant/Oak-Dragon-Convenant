// Modules/cashFlowAgent.js

class CashFlowAgent {
  constructor() {
    this.income = [];
    this.expenses = [];
  }

  recordIncome(source, amount) {
    const entry = { source, amount, date: new Date().toISOString() };
    this.income.push(entry);
    console.log(`Income recorded: ${source} → $${amount}`);
  }

  recordExpense(item, amount) {
    const entry = { item, amount, date: new Date().toISOString() };
    this.expenses.push(entry);
    console.log(`Expense recorded: ${item} → $${amount}`);
  }

  getNetCashFlow() {
    const totalIncome   = this.income.reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = this.expenses.reduce((sum, e) => sum + e.amount, 0);
    const net           = totalIncome - totalExpenses;
    console.log(`Net Cash Flow: $${net}`);
    return net;
  }
}

module.exports = CashFlowAgent;