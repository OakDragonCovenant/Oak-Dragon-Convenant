// Modules/buyHoldAgent.js
const assistantSpawner = new AssistantSpawner("BuyHoldAgent");

async function handleAdvancedAnalysis() {
  const output = await assistantSpawner.spawn(
    "Research rental growth in Grand Rapids",
    "DeepResearch"
  );

  console.log("Delegation Output:", output);
}
const PropertyScoutAgent   = require('./propertyScoutAgent');
const AcquisitionAgent     = require('./acquisitionAgent');
const TenancyAgent         = require('./tenancyAgent');
const CashFlowAgent        = require('./cashFlowAgent');
const AppreciationAgent    = require('./appreciationAgent');

class BuyHoldAgent {
  constructor() {
    this.roles = {
      scout:        new PropertyScoutAgent(),
      buyer:        new AcquisitionAgent(),
      landlord:     new TenancyAgent(),
      accountant:   new CashFlowAgent(),
      analyst:      new AppreciationAgent()
    };
  }

  listRoles() {
    return Object.keys(this.roles);
  }
}

module.exports = BuyHoldAgent;