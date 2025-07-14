const BaseAgent = require('../Core/BaseAgent');

/**
 * The learning center of the protocol. Analyzes past performance to adapt future strategies.
 */
class AdaptationArchon extends BaseAgent {
    constructor(name) {
        super(name, "Adaptation Archon");
        console.log(`${this.name}: Meta-learning and adaptation systems are online.`);
    }

    /**
     * Reviews a history of trades and suggests strategic changes.
     */
    reviewPerformance() {
        // In a real system, this data would come from the PortfolioArchon's trade history.
        const mockTradeHistory = [
            { pnl: 150, strategy: 'Momentum' },
            { pnl: -50, strategy: 'Momentum' },
            { pnl: -75, strategy: 'Momentum' },
            { pnl: 200, strategy: 'Momentum' }
        ];
        console.log(`\n[${this.name}]: Reviewing performance of ${mockTradeHistory.length} past trades.`);
        const totalPnl = mockTradeHistory.reduce((sum, trade) => sum + trade.pnl, 0);

        if (totalPnl > 0) {
            console.log(`[${this.name}]: Performance is positive ($${totalPnl}). Recommending to increase risk allocation to 'Momentum' strategy.`);
        } else {
            console.log(`[${this.name}]: Performance is negative ($${totalPnl}). Recommending to decrease risk or halt 'Momentum' strategy.`);
        }
        // This would then send a command to the CapitalArchon or StrategyArchon.
        console.log(`[${this.name}]: Performance review complete.`);
    }
}

module.exports = AdaptationArchon;