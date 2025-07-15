const BaseAgent = require('../Core/BaseAgent');

/**
 * 🛡️ Enhanced Risk Archon - Optimized for Small Account Trading
 * Protects $8.89 USDT starting capital with smart risk management
 */
class RiskArchon extends BaseAgent {
    constructor(name) {
        super(name, "Risk Archon");
        
        // 🎯 Small Account Risk Management
        this.maxRiskPerTrade = 0.30; // Allow up to 30% risk for small accounts to enable growth
        this.maxOpenPositions = 5;   // Limit concurrent positions for small accounts
        this.minTradeSize = 0.50;    // Coinbase minimum
        this.emergencyStopLoss = 0.50; // Stop trading if balance falls below $0.50
        
        console.log(`${this.name}: Risk management protocols active. Max risk per trade: ${this.maxRiskPerTrade * 100}%`);
        console.log(`${this.name}: Small account optimization: Min trade $${this.minTradeSize}, Emergency stop at $${this.emergencyStopLoss}`);
    }

    /**
     * Enhanced trade validation for small accounts
     * @param {object} proposedTrade - e.g., { symbol: 'ADA/USDT', value: 1.50 }
     * @param {object} portfolioState - Current portfolio state
     * @returns {object} Approval status and detailed reasoning
     */
    validateTrade(proposedTrade, portfolioState) {
        // 🚨 Emergency Stop Check
        if (portfolioState.cashUSD < this.emergencyStopLoss) {
            return {
                approved: false,
                reason: `🚨 EMERGENCY STOP: Balance $${portfolioState.cashUSD.toFixed(2)} below emergency threshold $${this.emergencyStopLoss}`
            };
        }

        // 💰 Minimum Trade Size Check
        if (proposedTrade.value < this.minTradeSize) {
            return {
                approved: false,
                reason: `Trade value $${proposedTrade.value.toFixed(2)} below Coinbase minimum $${this.minTradeSize}`
            };
        }

        // 📊 Portfolio Risk Check (relaxed for small accounts)
        const tradeRisk = proposedTrade.value / portfolioState.totalValueUSD;
        if (tradeRisk > this.maxRiskPerTrade) {
            return {
                approved: false,
                reason: `Trade risk ${(tradeRisk * 100).toFixed(1)}% exceeds max ${(this.maxRiskPerTrade * 100)}%`
            };
        }

        // 🎯 Position Count Check
        const currentPositions = Object.keys(portfolioState.holdings).length;
        if (currentPositions >= this.maxOpenPositions) {
            return {
                approved: false,
                reason: `Max positions (${this.maxOpenPositions}) reached. Current: ${currentPositions}`
            };
        }

        // 💵 Cash Availability Check
        if (proposedTrade.side === 'BUY' && proposedTrade.value > portfolioState.cashUSD) {
            return {
                approved: false,
                reason: `Insufficient cash: Need $${proposedTrade.value.toFixed(2)}, have $${portfolioState.cashUSD.toFixed(2)}`
            };
        }

        // ✅ All checks passed
        return { 
            approved: true,
            reason: `Trade approved: ${proposedTrade.symbol} ${proposedTrade.side} $${proposedTrade.value.toFixed(2)}`
        };
    }
}

module.exports = RiskArchon;