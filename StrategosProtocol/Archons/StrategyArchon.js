const BaseAgent = require('../Core/BaseAgent');

/**
 * The "brain" of the protocol. UPGRADED to consult the Arbitrageur for Best Execution.
 */
class StrategyArchon extends BaseAgent {
    constructor(name, { riskArchon, executionArchon, taLegate, researchArchon, portfolioArchon, arbitrageurArchon }) {
        super(name, "Strategy Archon");
        this.riskArchon = riskArchon;
        this.executionArchon = executionArchon;
        this.taLegate = taLegate;
        this.researchArchon = researchArchon;
        this.portfolioArchon = portfolioArchon;
        this.arbitrageurArchon = arbitrageurArchon; // The Best Execution department
        console.log(`${this.name}: Strategy engine online. Now capable of seeking Best Execution.`);
    }

    async developTradeIdea() {
        console.log(`\n[${this.name}]: --- Starting new APEX PREDATOR analysis cycle ---`);
        const targetSymbol = 'BTC/USDT';

        // 1. GATHER INTEL
        const portfolioState = this.portfolioArchon.getPortfolioState();
        const currentHoldings = portfolioState.holdings[targetSymbol];
        const sentiment = await this.researchArchon.getPresentSentiment();
        // In a real system, live price data would be fetched here for TA.

        // 2. DECIDE STRATEGY MODE: Hunter or Farmer?
        if (currentHoldings) {
            // --- FARMER MODE (SELL LOGIC) ---
            console.log(`[${this.name}]: Operating in FARMER mode for ${targetSymbol}.`);
            // For a SELL, we want the HIGHEST price.
            const bestVenue = await this.arbitrageurArchon.findBestExecutionVenue('SELL');
            
            // Simple take-profit logic (e.g., RSI > 80)
            if (true) { // Placeholder for real TA logic
                console.log(`[${this.name}]: High-Confluence SELL Signal DETECTED.`);
                const proposedTrade = {
                    symbol: targetSymbol,
                    side: 'SELL',
                    quantity: currentHoldings.quantity,
                    value: bestVenue.price * currentHoldings.quantity, // Value at the best available market price
                    exchange: bestVenue.exchange // DYNAMICALLY CHOSEN EXCHANGE
                };
                this.executionArchon.executeTrade(proposedTrade);
            }
        } else {
            // --- HUNTER MODE (BUY LOGIC) ---
            console.log(`[${this.name}]: Operating in HUNTER mode for ${targetSymbol}.`);
            // For a BUY, we want the LOWEST price.
            const bestVenue = await this.arbitrageurArchon.findBestExecutionVenue('BUY');

            // High-confluence logic (e.g., Positive sentiment AND RSI < 30)
            if (sentiment.includes("Positive")) { // Placeholder for real TA logic
                console.log(`[${this.name}]: High-Confluence BUY Signal DETECTED.`);
                const proposedTrade = {
                    symbol: targetSymbol,
                    side: 'BUY',
                    quantity: 0.02,
                    value: 1000, // The amount of capital to deploy
                    exchange: bestVenue.exchange // DYNAMICALLY CHOSEN EXCHANGE
                };
                const validation = this.riskArchon.validateTrade(proposedTrade, portfolioState);
                if (validation.approved) {
                    this.executionArchon.executeTrade(proposedTrade);
                } else {
                    console.log(`[${this.name}]: Trade REJECTED by Risk Archon: ${validation.reason}`);
                }
            }
        }
        console.log(`[${this.name}]: --- Apex Predator analysis cycle complete ---`);
    }
}

module.exports = StrategyArchon;