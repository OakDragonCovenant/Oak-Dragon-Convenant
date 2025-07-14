const LoreSmithAgent     = require('./loreSmithAgent');
const ChronologerAgent   = require('./chronologerAgent');
const SentienceGateAgent = require('./sentienceGateAgent');
const AlchemistAgent     = require('./alchemistAgent');

class EducationAgent {
  constructor() {
    this.roles = {
      curriculumWeaver:  new LoreSmithAgent(),
      knowledgeTracker:  new ChronologerAgent(),
      accessGatekeeper:  new SentienceGateAgent(),
      learningAlchemist: new AlchemistAgent()
    };
  }

  listRoles() {
    return Object.keys(this.roles);
  }
}

module.exports = EducationAgent;