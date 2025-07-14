// Modules/testMarketTrendAssistant.js

const MarketTrendAssistant = require('./marketTrendAssistant');

(async () => {
  const assistant = new MarketTrendAssistant();

  try {
    const trends = await assistant.fetchTrends("US");
    console.log("Fetched Trends:", trends);

    // Optional: Add growth rate logic if implemented
    if (typeof assistant.getGrowthRate === "function") {
      const growth = assistant.getGrowthRate();
      console.log("Growth Rate:", growth + "%");
    }
  } catch (error) {
    console.error("Error testing MarketTrendAssistant:", error);
  }
})();