const BaseAgent = require('../Core/BaseAgent');

/**
 * Research Archon - Coordinates market research and analysis
 */
class ResearchArchon extends BaseAgent {
    constructor(name, { llmOracle }) {
        super(name, "Research Archon");
        this.llmOracle = llmOracle;
        console.log(`${this.name}: Research department online. Connected to LLM Oracle.`);
    }
    
    /**
     * Get current market sentiment
     * @param {string} symbol - Trading symbol
     * @returns {Promise<string>} Current sentiment
     */
    async getPresentSentiment(symbol = 'BTC/USDT') {
        console.log(`[${this.name}]: Gathering market sentiment for ${symbol}...`);
        return await this.llmOracle.getMarketSentiment(symbol);
    }
    
    /**
     * Conduct comprehensive market research
     * @param {string} symbol - Trading symbol
     * @returns {Promise<object>} Research report
     */
    async conductMarketResearch(symbol) {
        console.log(`[${this.name}]: Conducting comprehensive research for ${symbol}...`);
        
        const sentiment = await this.getPresentSentiment(symbol);
        const recommendation = await this.llmOracle.getTradeRecommendation({ symbol });
        
        return {
            symbol,
            sentiment,
            recommendation,
            timestamp: new Date().toISOString(),
            confidence: recommendation.confidence
        };
    }
}

module.exports = ResearchArchon;
