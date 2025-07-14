// Modules/testBankingAgent.js

const BankingAgent = require('./bankingAgent');
const bank = new BankingAgent();

console.log('Banking Roles:', bank.listRoles());

// Optional: inspect each role instance
Object.entries(bank.roles).forEach(([role, agent]) => {
  console.log(`${role}:`, agent.constructor.name);
});