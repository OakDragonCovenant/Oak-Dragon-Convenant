const BaseAgent = require('../Core/BaseAgent');

/**
 * A high-level Archon that provides Best Execution intelligence.
 * It queries all available exchange gateways to find the optimal venue for a trade.
 * This version is architected for maximum safety and clarity.
 */
class ArbitrageurArchon extends BaseAgent {
    constructor(name) {
        super(name, "Arbitrageur Archon");
        this.gateways = [];
        console.log(`[${this.name}]: Best Execution protocol is online.`);
    }

    /**
     * Registers a gateway instance with the Archon.
     * @param {object} gatewayInstance The instance of the gateway agent.
     */
    registerGateway(gatewayInstance) {
        this.gateways.push(gatewayInstance);
    }

    /**
     * Dynamically gets the ticker price from the actual gateway instance.
     * It checks for a live method and falls back to simulation if it doesn't exist.
     * @param {object} gateway The gateway agent instance.
     * @returns {Promise<number|null>} The live price or null.
     */
    async getTickerFromGateway(gateway) {
        if (typeof gateway.getTicker === 'function') {
            return gateway.getTicker('BTC/USDT');
        } else {
            console.warn(`[${this.name}]: Gateway ${gateway.name} does not have a live getTicker method. Using simulation.`);
            switch (gateway.name) {
                case 'Kraken-Gateway': return 60052.43;
                default: return 60100.00;
            }
        }
    }

    /**
     * Finds the best exchange to perform a trade on by querying all registered gateways.
     * @param {'BUY' | 'SELL'} side The side of the trade.
     * @returns {Promise<{exchange: string, price: number}|null>} The best venue or null if none are found.
     */
    async findBestExecutionVenue(side) {
        console.log(`[${this.name}]: Searching for best execution venue across ${this.gateways.length} exchanges...`);
        
        const pricePromises = this.gateways.map(gateway => 
            this.getTickerFromGateway(gateway).then(price => ({
                exchange: gateway.name.replace('-Gateway', ''),
                price: price
            }))
        );

        const results = await Promise.all(pricePromises);
        
        const validPrices = results.filter(r => r.price !== null && !isNaN(r.price));

        if (validPrices.length === 0) {
            console.error(`[${this.name}]: CRITICAL FAILURE - Could not fetch a valid price from ANY exchange.`);
            return null;
        }

        console.log(`[${this.name}]: Live prices acquired:`, validPrices);

        let bestVenue = validPrices[0]; 

        for (let i = 1; i < validPrices.length; i++) {
            const currentVenue = validPrices[i];
            if (side === 'BUY') {
                if (currentVenue.price < bestVenue.price) {
                    bestVenue = currentVenue;
                }
            } else { // SELL
                if (currentVenue.price > bestVenue.price) {
                    bestVenue = currentVenue;
                }
            }
        }

        // This final check guarantees the object is valid before use, satisfying the IDE.
        if (bestVenue && bestVenue.exchange && typeof bestVenue.price === 'number') {
            console.log(`[${this.name}]: Optimal venue found for ${side} order: ${bestVenue.exchange} at $${bestVenue.price}`);
            return bestVenue;
        } else {
            console.error(`[${this.name}]: CRITICAL FAILURE - Failed to determine best venue from valid prices.`);