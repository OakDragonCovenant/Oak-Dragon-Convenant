const BaseAgent = require('../Core/BaseAgent');

/**
 * The ultimate authority on risk. Enforces capital preservation rules on all operations.
 */
class RiskArchon extends BaseAgent {
    constructor(name) {
        super(name, "Risk Archon");
        this.maxRiskPerTrade = 0.02; // Do not risk more than 2% of portfolio on a single trade
        this.maxOpenPositions = 10;  // Do not allow more than 10 concurrent trades
        console.log(`${this.name}: Risk management protocols active. Max risk per trade: ${this.maxRiskPerTrade * 100}%`);
    }

    /**
     * Validates a proposed trade against all risk rules.
     * @param {object} proposedTrade - e.g., { symbol: 'BTC/USDT', value: 1500 }
     * @param {object} portfolioState - The current state from the PortfolioArchon.
     * @returns {object} An object indicating approval status and reason.
     */
    validateTrade(proposedTrade, portfolioState) {
        const tradeRisk = proposedTrade.value / portfolioState.totalValueUSD;

        if (tradeRisk > this.maxRiskPerTrade) {
            return {
                approved: false,
                reason: `Trade risk (${(tradeRisk * 100).toFixed(2)}%) exceeds max risk of ${(this.maxRiskPerTrade * 100)}%`
            };
        }

        // Add more rule checks here in the future...

        return { approved: true };
    }
}

module.exports = RiskArchon;