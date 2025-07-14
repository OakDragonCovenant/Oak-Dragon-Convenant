const BaseAgent = require('../Core/BaseAgent');
const credentials = require('./credentials');
const SymbolNormalizer = require('./SymbolNormalizer');
const { CoinbasePro } = require('coinbase-pro-node'); // <-- Import the live API client

class Gateway_Coinbase extends BaseAgent {
    constructor() {
        super("Coinbase-Gateway", "Coinbase Exchange Gateway");
        this.client = null;
        this.credentials = credentials.coinbase;

        if (this.credentials) {
            this.client = new CoinbasePro(this.credentials);
            console.log(`[${this.name}]: LIVE connection to Coinbase is active.`);
        } else {
            console.warn(`[${this.name}]: Connection DISABLED due to missing credentials.`);
        }
    }

    /**
     * Places a real market order on Coinbase.
     * @param {object} order - { symbol, side, quantity }
     */
    async placeOrder(order) {
        if (!this.client) return { success: false, reason: 'Gateway disabled' };

        const exchangeSymbol = SymbolNormalizer.toExchange(order.symbol, 'coinbase');
        console.log(`[${this.name}] Routing order to LIVE Coinbase exchange for symbol ${exchangeSymbol}.`);

        try {
            const response = await this.client.rest.order.placeOrder({
                product_id: exchangeSymbol,
                side: order.side.toLowerCase(),
                type: 'market',
                size: order.quantity.toString(), // Must be a string
            });
            console.log(`[${this.name}] Successfully placed order on Coinbase:`, response);
            return { success: true, status: 'PLACED_LIVE', orderId: response.id };
        } catch (error) {
            console.error(`[${this.name}] FAILED to place order on Coinbase:`, error.message);
            return { success: false, reason: error.message };
        }
    }

    /**
     * --- NEW LIVE METHOD ---
     * Fetches the live ticker price for a given symbol.
     * @param {string} internalSymbol - e.g., 'BTC/USDT'
     * @returns {Promise<number|null>} The current price or null if an error occurs.
     */
    async getTicker(internalSymbol) {
        if (!this.client) return null;

        const exchangeSymbol = SymbolNormalizer.toExchange(internalSymbol, 'coinbase');
        try {
            const ticker = await this.client.rest.product.getProductTicker(exchangeSymbol);
            return parseFloat(ticker.price);
        } catch (error) {
            console.error(`[${this.name}] FAILED to fetch ticker for ${exchangeSymbol}:`, error.message);
            return null;
        }
    }
}

module.exports = Gateway_Coinbase;