const BaseAgent = require('../Core/BaseAgent');
const axios = require('axios');

/**
 * The "ticker follower." This agent is responsible for fetching live market data.
 */
class MarketScanner_Legate extends BaseAgent {
    constructor(name) {
        super(name, "Market Scanner Legate");
        console.log(`${this.name}: Live market scanner is online.`);
    }

    /**
     * Fetches the latest price data for a given symbol.
     * NOTE: This is a simplified example. A real system would fetch OHLCV (Open, High, Low, Close, Volume) data.
     * We are using a free public API from CoinGecko for this example.
     * @param {string} symbol - The symbol to fetch, e.g., 'bitcoin'.
     * @returns {Promise<number[]>} A promise that resolves to an array of recent prices.
     */
    async getLatestPriceData(symbol = 'bitcoin') {
        try {
            console.log(`[${this.name}]: Fetching live market data for ${symbol}...`);
            const url = `https://api.coingecko.com/api/v3/coins/${symbol}/market_chart?vs_currency=usd&days=1&interval=hourly`;
            const response = await axios.get(url);
            
            // The API returns pairs of [timestamp, price]. We only need the prices.
            const prices = response.data.prices.map(p => p[1]);
            
            console.log(`[${this.name}]: Successfully fetched ${prices.length} data points.`);
            return prices;
        } catch (error) {
            console.error(`[${this.name}]: CRITICAL ERROR fetching market data:`, error.message);
            // Return a fallback array of a fixed price to prevent system crash on API failure.
            return Array(15).fill(50000); 
        }
    }
}

module.exports = MarketScanner_Legate;