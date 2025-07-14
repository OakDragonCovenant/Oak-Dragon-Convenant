// Modules/propertyScoutAgent.js
const BaseAgent = require('./baseAgent');

class PropertyScoutAgent extends BaseAgent {
  constructor() {
    super();
    this.criteria = {
      location: 'Any',
      minRentYield: 0.07,
      type: 'Residential',
      maxPrice: 250000
    };
    this.leads = [];
  }

  updateCriteria(newCriteria = {}) {
    Object.assign(this.criteria, newCriteria);
    console.log('Updated search criteria:', this.criteria);
  }

  addLead(property) {
    this.leads.push(property);
    console.log('Lead added:', property.address);
  }

  shortlistLeads() {
    return this.leads.filter(p =>
      p.rentYield >= this.criteria.minRentYield &&
      p.price <= this.criteria.maxPrice &&
      p.type === this.criteria.type
    );
  }

  async researchComps(area) {
    const CompsResearchAssistant = require('./compsResearchAssistant');
    const assistant = this.spawnAssistant(CompsResearchAssistant, { area });
    return await assistant.fetchComps();
  }
}

module.exports = PropertyScoutAgent;
