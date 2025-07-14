// Modules/houseFlipAgent.js
const BaseAgent            = require('./baseAgent');
const FlipScoutAgent       = require('./flipScoutAgent');
const RenovationAgent      = require('./renovationAgent');
const ArvAgent             = require('./arvAgent');
const SalesAgent           = require('./salesAgent');
const ProfitAnalysisAgent  = require('./profitAnalysisAgent');

class HouseFlipAgent extends BaseAgent {
  constructor() {
    super();
    this.roles = {
      scout:    this.spawnAssistant(FlipScoutAgent),
      renovator:this.spawnAssistant(RenovationAgent),
      appraiser:this.spawnAssistant(ArvAgent),
      seller:   this.spawnAssistant(SalesAgent),
      analyst:  this.spawnAssistant(ProfitAnalysisAgent)
    };
  }

  listRoles() {
    return Object.keys(this.roles);
  }
}

module.exports = HouseFlipAgent;