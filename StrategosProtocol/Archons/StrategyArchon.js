const BaseAgent = require('../Core/BaseAgent');
const TradingPairs = require('../Config/TradingPairs');

/**
 * 🎯 ENHANCED Strategy Archon - Multi-Cryptocurrency Trading Engine
 * Optimized for small accounts with $8.89 USDT starting capital
 */
class StrategyArchon extends BaseAgent {
    constructor(name, { riskArchon, executionArchon, taLegate, researchArchon, portfolioArchon, marketScanner }) {
        super(name, "Strategy Archon");
        this.riskArchon = riskArchon;
        this.executionArchon = executionArchon;
        this.taLegate = taLegate;
        this.researchArchon = researchArchon;
        this.portfolioArchon = portfolioArchon;
        this.marketScanner = marketScanner;
        
        // 🎯 Small Account Optimization
        this.activePairs = TradingPairs.getSmallAccountPairs();
        this.allocation = TradingPairs.getSmallAccountAllocation();
        this.minTradeSize = 0.50; // Minimum $0.50 trade for Coinbase
        
        console.log(`${this.name}: Strategy engine online. Multi-crypto trading with ${this.activePairs.length} pairs enabled.`);
        console.log(`${this.name}: Active trading pairs:`, this.activePairs.join(', '));
    }

    async developTradeIdea() {
        console.log(`\n[${this.name}]: --- 🚀 MULTI-CRYPTO APEX PREDATOR Analysis Cycle ---`);
        
        const portfolioState = this.portfolioArchon.getPortfolioState();
        console.log(`[${this.name}]: Available capital: $${portfolioState.cashUSD.toFixed(2)} USDT`);
        
        // 🎯 Small Account Strategy: Focus on highest potential pairs
        for (const symbol of this.activePairs) {
            await this.analyzeSymbol(symbol, portfolioState);
        }
    }

    async analyzeSymbol(symbol, portfolioState) {
        console.log(`\n[${this.name}]: 🔍 Analyzing ${symbol}...`);
        
        const currentHoldings = portfolioState.holdings[symbol];
        const maxTradeValue = this.calculateMaxTradeValue(symbol, portfolioState.cashUSD);
        
        if (maxTradeValue < this.minTradeSize) {
            console.log(`[${this.name}]: ⚠️  Insufficient funds for ${symbol} (need min $${this.minTradeSize})`);
            return;
        }

        // 1. GATHER INTELLIGENCE
        const sentiment = await this.researchArchon.getPresentSentiment(symbol);
        // Note: In production, would fetch live price data here

        // 2. STRATEGY DECISION TREE
        if (currentHoldings) {
            await this.evaluateSellOpportunity(symbol, currentHoldings, sentiment);
        } else {
            await this.evaluateBuyOpportunity(symbol, maxTradeValue, sentiment);
        }
    }

    calculateMaxTradeValue(symbol, availableCash) {
        // Use allocation percentage for this symbol
        const allocation = this.allocation[symbol] || 0.1; // Default 10%
        const maxByAllocation = availableCash * allocation;
        
        // For small accounts, limit individual trades to preserve capital
        const maxByRisk = Math.min(availableCash * 0.3, 2.00); // Max 30% or $2, whichever is smaller
        
        return Math.min(maxByAllocation, maxByRisk);
    }

    async evaluateSellOpportunity(symbol, holdings, sentiment) {
        console.log(`[${this.name}]: 🌾 FARMER MODE - Evaluating sell for ${symbol}`);
        
        // Simple profit-taking logic for small accounts
        if (holdings.value > holdings.avgPrice * 1.05) { // 5% profit target
            console.log(`[${this.name}]: 📈 Profit target reached for ${symbol} (+5%)`);
            
            const proposedTrade = {
                symbol: symbol,
                side: 'SELL', 
                quantity: holdings.quantity,
                value: holdings.value
            };
            
            this.executionArchon.executeTrade(proposedTrade);
        }
    }

    async evaluateBuyOpportunity(symbol, maxTradeValue, sentiment) {
        console.log(`[${this.name}]: 🏹 HUNTER MODE - Evaluating buy for ${symbol}`);
        
        // Enhanced buy logic for small accounts
        if (sentiment.includes("Positive") || Math.random() > 0.7) { // Demo logic
            console.log(`[${this.name}]: 🎯 BUY Signal detected for ${symbol}`);
            
            const proposedTrade = {
                symbol: symbol,
                side: 'BUY',
                quantity: this.calculateQuantity(symbol, maxTradeValue),
                value: maxTradeValue
            };
            
            const portfolioState = this.portfolioArchon.getPortfolioState();
            const validation = this.riskArchon.validateTrade(proposedTrade, portfolioState);
            
            if (validation.approved) {
                this.executionArchon.executeTrade(proposedTrade);
            } else {
                console.log(`[${this.name}]: ❌ Trade REJECTED by Risk Archon: ${validation.reason}`);
            }
        }
    }

    calculateQuantity(symbol, tradeValue) {
        // For demo purposes, assuming $1 per unit price
        // In production, this would use real market prices
        const estimatedPrice = 1.0; // Placeholder
        return tradeValue / estimatedPrice;
    }
}

module.exports = StrategyArchon;