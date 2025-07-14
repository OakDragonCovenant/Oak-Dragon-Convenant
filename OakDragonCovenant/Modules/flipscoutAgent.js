// Modules/flipScoutAgent.js
const BaseAgent = require('./baseAgent');

class FlipScoutAgent extends BaseAgent {
  constructor() {
    super();
    this.criteria = {
      maxPurchasePrice: 200000,
      minDiscountRate: 0.15  // at least 15% below ARV
    };
    this.offers = [];
  }

  addOffer(property) {
    this.offers.push(property);
    console.log('Offer added:', property.address);
  }

  shortlistOffers() {
    return this.offers.filter(p =>
      p.price <= this.criteria.maxPurchasePrice &&
      ((p.arv - p.price) / p.arv) >= this.criteria.minDiscountRate
    );
  }

  async researchMarket(area) {
    const MarketAnalysisAssistant = require('./marketTrendAssistant');
    const assistant = this.spawnAssistant(MarketAnalysisAssistant, { area });
    return await assistant.fetchTrends(area);
  }
}

module.exports = FlipScoutAgent;