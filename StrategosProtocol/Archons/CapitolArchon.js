const BaseAgent = require('../Core/BaseAgent');

/**
 * The highest-level financial manager. Allocates capital among different strategies.
 */
class CapitalArchon extends BaseAgent {
    constructor(name, { portfolioArchon }) {
        super(name, "Capital Archon");
        this.portfolioArchon = portfolioArchon;
        this.strategyAllocations = new Map([
            ['Momentum_Strategy_AI', 0.5], // 50% of capital to this strategy
            ['Mean_Reversion_ETH', 0.3], // 30% to another
            ['Reserve', 0.2]             // 20% held in reserve
        ]);
        console.log(`${this.name}: Capital allocation protocols are active.`);
    }

    /**
     * Reviews the performance and rebalances capital between strategies.
     */
    reviewAndRebalance() {
        const totalCapital = this.portfolioArchon.getPortfolioState().totalValueUSD;
        console.log(`\n[${this.name}]: Reviewing capital allocations for total capital of $${totalCapital.toLocaleString()}.`);
        for (const [strategy, allocation] of this.strategyAllocations.entries()) {
            const allocatedAmount = totalCapital * allocation;
            console.log(`[${this.name}]: Strategy '${strategy}' is allocated ${allocation * 100}% ($${allocatedAmount.toLocaleString()}).`);
        }
        // In a real system, this would trigger actual rebalancing logic.
        console.log(`[${this.name}]: Capital review complete. No changes made at this time.`);
    }
}

module.exports = CapitalArchon;