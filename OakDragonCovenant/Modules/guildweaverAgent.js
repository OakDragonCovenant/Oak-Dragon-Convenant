// Modules/guildWeaverAgent.js

// Base “RitualCraft” Agents
const ObsidianFlamekeeperAgent = require('./obsidianFlamekeeperAgent');
const RiteValidatorAgent       = require('./riteValidatorAgent');
const RitualFlowAgent          = require('./ritualFlowAgent');
const ScrollscribeAgent        = require('./scrollscribeAgent');
const URLStewardAgent          = require('./urlStewardAgent');

// Industry‐Head Agents
const BankingAgent   = require('./bankingAgent');
const InsuranceAgent = require('./insuranceAgent');
const EducationAgent = require('./educationAgent');

class GuildWeaverAgent {
  constructor(industry) {
    this.industry    = industry;
    this.agentRoster = [];
  }

  summonAgents() {
    // RitualCraft: low‐level magical guild
    if (this.industry === 'RitualCraft') {
      this.agentRoster = [
        new ObsidianFlamekeeperAgent(),
        new RiteValidatorAgent(),
        new RitualFlowAgent(),
        new ScrollscribeAgent(),
        new URLStewardAgent()
      ];
    }
    // Banking: self-banking vault & transfer
    else if (this.industry === 'Banking') {
      this.agentRoster = [ new BankingAgent() ];
    }
    // Insurance: private‐insurance policy system
    else if (this.industry === 'Insurance') {
      this.agentRoster = [ new InsuranceAgent() ];
    }
    // Education: training & curriculum system
    else if (this.industry === 'Education') {
      this.agentRoster = [ new EducationAgent() ];
    }
    else {
      console.warn(`Unknown industry: ${this.industry}`);
      this.agentRoster = [];
    }
  }

  getRoster() {
    // Return a simple list of class names
    return this.agentRoster.map(agent => agent.constructor.name);
  }
}

module.exports = GuildWeaverAgent;