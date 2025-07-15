/**
 * 🎯 Small Account Trading Configuration
 * Optimized settings for accounts starting with $8.89 USDT
 */

class SmallAccountConfig {
    static getConfiguration() {
        return {
            // 💰 Account Settings
            initialBalance: 8.89,
            baseCurrency: 'USDT',
            minTradeSize: 0.50,        // Coinbase minimum
            emergencyStopLoss: 0.50,   // Emergency stop threshold
            
            // 📊 Risk Management
            maxRiskPerTrade: 0.30,     // 30% max risk per trade (higher for growth)
            maxDailyLoss: 0.20,        // 20% max daily loss
            maxOpenPositions: 5,       // Limit concurrent positions
            
            // 🎯 Trading Strategy
            profitTarget: 0.05,        // 5% profit taking
            stopLoss: 0.03,           // 3% stop loss
            rebalanceThreshold: 0.10,  // 10% portfolio imbalance trigger
            
            // 🚀 Position Sizing
            defaultAllocation: 0.20,   // 20% default position size
            maxSinglePosition: 0.30,   // 30% max single position
            reserveCash: 0.10,         // Keep 10% cash reserve
            
            // ⏰ Timing Settings
            tradingCooldown: 300,      // 5 minutes between trades (seconds)
            portfolioReviewInterval: 3600, // 1 hour portfolio review
            riskCheckInterval: 1800,   // 30 minutes risk assessment
            
            // 🎨 UI Display
            showSmallAccountTips: true,
            displayFractionalShares: true,
            highlightLowCostAssets: true,
            
            // 🔔 Notifications
            alertOnProfitTargets: true,
            alertOnStopLoss: true,
            alertOnEmergencyStop: true,
            dailyPerformanceReport: true
        };
    }
    
    /**
     * Get trading pairs optimized for small accounts
     */
    static getOptimizedTradingPairs() {
        return [
            // 🎯 Low Price, High Potential (Best for $8.89 account)
            {
                symbol: 'ADA/USDT',
                allocation: 0.25,
                priority: 1,
                reasoning: 'Low price, strong fundamentals, high growth potential'
            },
            {
                symbol: 'MATIC/USDT', 
                allocation: 0.20,
                priority: 2,
                reasoning: 'Layer 2 leader, low price, ecosystem growth'
            },
            {
                symbol: 'ALGO/USDT',
                allocation: 0.15,
                priority: 3,
                reasoning: 'Stable technology, academic backing, low price'
            },
            {
                symbol: 'ATOM/USDT',
                allocation: 0.15,
                priority: 4,
                reasoning: 'Inter-blockchain protocol, growing ecosystem'
            },
            {
                symbol: 'LINK/USDT',
                allocation: 0.15,
                priority: 5,
                reasoning: 'Oracle infrastructure, enterprise adoption'
            },
            {
                symbol: 'UNI/USDT',
                allocation: 0.10,
                priority: 6,
                reasoning: 'DeFi exposure, proven protocol'
            }
        ];
    }
    
    /**
     * Get progressive trading milestones
     */
    static getTradingMilestones() {
        return [
            {
                targetBalance: 10.00,
                reward: 'Unlock additional trading pair',
                message: '🎉 First $10 milestone reached!'
            },
            {
                targetBalance: 15.00,
                reward: 'Increase max position size to 35%',
                message: '🚀 Account growing! $15 milestone!'
            },
            {
                targetBalance: 25.00,
                reward: 'Enable automated rebalancing',
                message: '💪 Strong growth! $25 milestone!'
            },
            {
                targetBalance: 50.00,
                reward: 'Unlock advanced trading strategies',
                message: '🏆 Excellent! $50 milestone achieved!'
            },
            {
                targetBalance: 100.00,
                reward: 'Graduate to intermediate account settings',
                message: '🎊 Outstanding! Ready for advanced trading!'
            }
        ];
    }
    
    /**
     * Calculate optimal trade size for current balance
     */
    static calculateOptimalTradeSize(currentBalance, targetAllocation = 0.20) {
        const config = this.getConfiguration();
        
        // Ensure we don't go below minimum trade size
        const idealSize = currentBalance * targetAllocation;
        const adjustedSize = Math.max(idealSize, config.minTradeSize);
        
        // Don't exceed maximum single position
        const maxSize = currentBalance * config.maxSinglePosition;
        
        return Math.min(adjustedSize, maxSize);
    }
    
    /**
     * Get risk-adjusted recommendations
     */
    static getRiskAdjustedRecommendations(currentBalance) {
        if (currentBalance < 5.00) {
            return {
                strategy: 'ultra-conservative',
                maxRisk: 0.15,
                recommendedPairs: 2,
                message: 'Focus on capital preservation and slow growth'
            };
        } else if (currentBalance < 15.00) {
            return {
                strategy: 'conservative',
                maxRisk: 0.25,
                recommendedPairs: 3,
                message: 'Moderate risk with diversification'
            };
        } else if (currentBalance < 50.00) {
            return {
                strategy: 'balanced',
                maxRisk: 0.30,
                recommendedPairs: 4,
                message: 'Balanced approach with growth focus'
            };
        } else {
            return {
                strategy: 'growth-oriented',
                maxRisk: 0.35,
                recommendedPairs: 6,
                message: 'Ready for more aggressive growth strategies'
            };
        }
    }
}

module.exports = SmallAccountConfig;
