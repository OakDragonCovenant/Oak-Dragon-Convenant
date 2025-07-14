const BaseAgent = require('../Core/BaseAgent');

/**
 * A MOCK agent that simulates a real cryptocurrency exchange API.
 * This is used for safe testing without real money.
 */
class ExchangeGateway_Mock extends BaseAgent {
    constructor(name) {
        super(name, "Mock Exchange Gateway");
        console.log(`${this.name}: Mock exchange is online. No real trades will be made.`);
    }

    /**
     * Pretends to place an order on the exchange.
     * @param {object} order - The order details.
     * @returns {object} A fake confirmation that the order was placed.
     */
    placeOrder(order) {
        const orderId = `MOCK-${Date.now()}`;
        console.log(`[${this.name}] Received order to ${order.side} ${order.quantity} of ${order.symbol}.`);
        console.log(`[${this.name}] Order ${orderId} has been successfully PLACED.`);
        
        // In a real system, this would be an API call. Here, we just return a success message.
        return {
            success: true,
            status: 'PLACED',
            orderId: orderId,
            filled: false // The order is on the books, but not yet filled.
        };
    }
}

module.exports = ExchangeGateway_Mock;