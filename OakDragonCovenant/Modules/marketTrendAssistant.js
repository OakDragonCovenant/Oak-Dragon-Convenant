// Modules/marketTrendAssistant.js
class MarketTrendAssistant {
  constructor() {
    this.data = [];
  }

  async fetchTrends(area) {
    // mock async fetch 
    this.data = [
      { year: 2023, index: 100 },
      { year: 2024, index: 105 },
      { year: 2025, index: 110 }
    ];
    console.log(`Trends for ${area}:`, this.data);
    return this.data;
  }
}

module.exports = MarketTrendAssistant;