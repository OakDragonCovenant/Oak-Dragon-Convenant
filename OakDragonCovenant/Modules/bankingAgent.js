const VaultwrightAgent    = require('./vaultwrightAgent');
const TransferAgent       = require('./transferAgent');
const CryptkeeperAgent    = require('./cryptkeeperAgent');
const OracleAgent         = require('./oracleAgent');

class BankingAgent {
  constructor() {
    this.roles = {
      vaultArchitect:      new VaultwrightAgent(),
      transactionHandler:  new TransferAgent(),
      privacyAuditor:      new CryptkeeperAgent(),
      financialModeler:    new OracleAgent()
    };
  }

  listRoles() {
    return Object.keys(this.roles);
  }
}

module.exports = BankingAgent;