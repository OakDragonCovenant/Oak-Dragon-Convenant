// Modules/insuranceAgent.js

const SentinelAgent  = require('./sentinelAgent');
const ArchivistAgent = require('./archivistAgent');
const ObeliskAgent   = require('./obeliskAgent');
const HarbingerAgent = require('./harbingerAgent');

class InsuranceAgent {
  constructor() {
    this.roles = {
      policyDesigner:   new SentinelAgent(),
      claimArchivist:   new ArchivistAgent(),
      riskValidator:    new ObeliskAgent(),
      protocolUpgrader: new HarbingerAgent()
    };
  }

  listRoles() {
    return Object.keys(this.roles);
  }
}

module.exports = InsuranceAgent;