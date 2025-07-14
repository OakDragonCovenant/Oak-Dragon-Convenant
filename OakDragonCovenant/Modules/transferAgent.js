class TransferAgent {
  constructor() {
    this.transactions = [];
  }

  performTransfer(fromVault, toVault, asset, amount) {
    const tx = {
      from: fromVault,
      to: toVault,
      asset,
      amount,
      timestamp: new Date().toISOString()
    };
    this.transactions.push(tx);
    console.log(`Transferred ${amount} ${asset} from ${fromVault} to ${toVault}.`);
    return tx;
  }

  getHistory() {
    return this.transactions;
  }
}

module.exports = TransferAgent;