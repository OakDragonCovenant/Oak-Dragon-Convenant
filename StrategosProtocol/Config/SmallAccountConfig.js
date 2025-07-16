/**
 * 🎯 Small Account Trading Configuration
 * Optimized for maximum diversification and all available pairs.
 */

const tradingPairs = require('./tradingPairs');

class SmallAccountConfig {
    static getConfiguration() {
        return {
            // 💰 Account Settings
            initialBalance: 8.89,
            baseCurrency: 'USDT',
            minTradeSize: 0.000001,        // Coinbase minimum
            emergencyStopLoss: 0.50,       // Emergency stop threshold

            // 📊 Risk Management
            maxRiskPerTrade: 0.30,         // 30% max risk per trade
            maxDailyLoss: 0.20,            // 20% max daily loss
            maxOpenPositions: tradingPairs.length, // Allow as many positions as pairs

            // 🎯 Trading Strategy
            profitTarget: 0.05,            // 5% profit taking
            stopLoss: 0.03,                // 3% stop loss
            rebalanceThreshold: 0.10,      // 10% portfolio imbalance trigger

            // 🚀 Position Sizing
            defaultAllocation: 1 / tradingPairs.length, // Even allocation across all pairs
            maxSinglePosition: 0.30,       // 30% max single position
            reserveCash: 0.10,             // Keep 10% cash reserve

            // ⏰ Timing Settings
            tradingCooldown: 300,          // 5 minutes between trades (seconds)
            portfolioReviewInterval: 3600, // 1 hour portfolio review
            riskCheckInterval: 1800,       // 30 minutes risk assessment

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
     * Get trading pairs for maximum diversification (all pairs)
     */
    static getOptimizedTradingPairs() {
        return tradingPairs.map(symbol => ({
            symbol,
            allocation: 1 / tradingPairs.length,
            priority: 1,
            reasoning: 'Included for maximum diversification'
        }));
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
    static calculateOptimalTradeSize(currentBalance, targetAllocation = 1 / tradingPairs.length) {
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
                recommendedPairs: tradingPairs.length,
                message: 'Ready for more aggressive growth strategies'
            };
        }
    }
}