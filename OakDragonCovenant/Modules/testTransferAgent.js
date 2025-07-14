const TransferAgent = require('./transferAgent');
const ta = new TransferAgent();

// simulate two vaults
ta.performTransfer('Vault A', 'Vault B', 'Dragon Coin', 42);
ta.performTransfer('Vault B', 'Vault C', 'Dragon Coin', 13);

console.log('Transaction History:', ta.getHistory());