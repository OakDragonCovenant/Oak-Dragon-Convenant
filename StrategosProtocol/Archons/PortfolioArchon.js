const BaseAgent = require('../Core/BaseAgent');

/**
 * The master record-keeper for all cryptocurrency assets and liquid capital.
 * UPGRADED to handle both BUY and SELL orders and track cash reserves.
 */
class PortfolioArchon extends BaseAgent {
    constructor(name) {
        super(name, "Portfolio Archon");
        // Initialize with actual Coinbase USDT balance
        this.cashUSD = 8.89; // Real USDT balance from Coinbase account
        this.holdings = new Map(); // Map<string, { quantity: number, avgPrice: number, value: number }>
        console.log(`${this.name}: Portfolio management initialized. Initial capital: $${this.cashUSD.toLocaleString()} USDT`);
    }

    /**
     * Provides a comprehensive snapshot of the current portfolio state.
     * @returns {object} The current state of the portfolio.
     */
    getPortfolioState() {
        const assetsValue = Array.from(this.holdings.values()).reduce((sum, asset) => sum + asset.value, 0);
        const totalValue = this.cashUSD + assetsValue;
        
        return {
            totalValueUSD: totalValue,
            cashUSD: this.cashUSD,
            assetsValueUSD: assetsValue,
            holdings: Object.fromEntries(this.holdings)
        };
    }

    /**
     * Records a completed trade, updating holdings and cash reserves accordingly.
     * @param {object} trade - e.g., { symbol, side: 'BUY'|'SELL', quantity, value }
     */
    recordTrade(trade) {
        console.log(`[${this.name}]: Recording executed '${trade.side}' trade for ${trade.quantity} ${trade.symbol} at a value of $${trade.value}.`);

        // --- UPGRADE: Data validation for robustness
        if (!trade.symbol || !trade.side || !trade.quantity || !trade.value) {
            console.error(`[${this.name}]: REJECTED invalid trade record. Missing data.`, trade);
            return;
        }

        if (trade.side.toUpperCase() === 'BUY') {
            this.handleBuy(trade);
        } else if (trade.side.toUpperCase() === 'SELL') {
            this.handleSell(trade);
        } else {
            console.error(`[${this.name}]: REJECTED trade record with unknown side: ${trade.side}`);
        }
        
        console.log(`[${this.name}]: Portfolio updated. New cash balance: $${this.cashUSD.toLocaleString()}`);
    }

    /**
     * --- NEW METHOD ---
     * Handles the logic for a BUY order.
     */
    handleBuy(trade) {
        if (this.cashUSD < trade.value) {
            console.error(`[${this.name}]: CRITICAL ALERT: Insufficient cash to cover buy order value of $${trade.value}.`);
            // In a real system, this would trigger an emergency halt.
            return;
        }
        this.cashUSD -= trade.value;

        const existingAsset = this.holdings.get(trade.symbol);
        if (existingAsset) {
            const newTotalValue = existingAsset.value + trade.value;
            const newQuantity = existingAsset.quantity + trade.quantity;
            existingAsset.quantity = newQuantity;
            existingAsset.value = newTotalValue;
            existingAsset.avgPrice = newTotalValue / newQuantity;
        } else {
            this.holdings.set(trade.symbol, {
                quantity: trade.quantity,
                value: trade.value,
                avgPrice: trade.value / trade.quantity
            });
        }
    }

    /**
     * --- NEW METHOD ---
     * Handles the logic for a SELL order.
     */
    handleSell(trade) {
        const existingAsset = this.holdings.get(trade.symbol);
        if (!existingAsset || existingAsset.quantity < trade.quantity) {
            console.error(`[${this.name}]: CRITICAL ALERT: Attempted to sell ${trade.quantity} of ${trade.symbol}, but only hold ${existingAsset ? existingAsset.quantity : 0}.`);
            return;
        }
        this.cashUSD += trade.value;

        existingAsset.quantity -= trade.quantity;
        // We assume the value of the sold portion is reflected in the trade.value
        existingAsset.value -= trade.value; 

        if (existingAsset.quantity <= 0.0000001) { // Use a small threshold for float precision
            this.holdings.delete(trade.symbol);
            console.log(`[${this.name}]: All holdings of ${trade.symbol} have been sold.`);
        }
    }
}

module.exports = PortfolioArchon;