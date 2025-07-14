const BaseAgent = require('../Core/BaseAgent');

/**
 * Responsible for the reliable execution of approved trade signals.
 */
class ExecutionArchon extends BaseAgent {
    constructor(name, { exchangeGateway, portfolioArchon }) { // <-- Add portfolioArchon here
        super(name, "Execution Archon");
        this.gateway = exchangeGateway;
        this.portfolioArchon = portfolioArchon; // <-- Store the portfolioArchon
        console.log(`${this.name}: Order execution system is active. Will report to Scribe.`);
    }

    /**
     * Takes a validated trade signal and sends it to the exchange.
     * @param {object} approvedTrade - A trade signal that has been approved by the RiskArchon.
     */
    executeTrade(approvedTrade) {
        console.log(`[${this.name}]: Received approved trade signal for ${approvedTrade.symbol}.`);
        
        const orderConfirmation = this.gateway.placeOrder(approvedTrade);

        // CRITICAL: Report the executed trade to the PortfolioArchon to update the state.
        if (orderConfirmation.success) {
            this.portfolioArchon.recordTrade(approvedTrade);
        }
        
        return orderConfirmation;
    }
}

module.exports = ExecutionArchon;