const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

/**
 * 🔐 Secure Configuration Manager for Oak Dragon Covenant
 * Centralizes all configuration and provides validation
 */
class ConfigManager {
    constructor() {
        this.validateRequiredEnvVars();
    }

    // 🌐 Server Configuration
    get server() {
        return {
            port: parseInt(process.env.PORT) || 3000,
            host: process.env.HOST || 'localhost',
            nodeEnv: process.env.NODE_ENV || 'development',
            logLevel: process.env.LOG_LEVEL || 'info'
        };
    }

    // 💰 Trading Configuration
    get trading() {
        return {
            coinbase: {
                apiKey: process.env.COINBASE_API_KEY,
                apiSecret: process.env.COINBASE_API_SECRET,
                sandbox: process.env.COINBASE_SANDBOX === 'true'
            },
            binance: {
                apiKey: process.env.BINANCE_API_KEY,
                apiSecret: process.env.BINANCE_API_SECRET
            },
            defaultPair: process.env.DEFAULT_TRADING_PAIR || 'BTC-USD',
            maxTradeAmount: parseFloat(process.env.MAX_TRADE_AMOUNT) || 100,
            dailyLossLimit: parseFloat(process.env.DAILY_LOSS_LIMIT) || 50,
            riskTolerance: process.env.RISK_TOLERANCE || 'medium',
            autoTradingEnabled: process.env.AUTO_TRADING_ENABLED === 'true'
        };
    }

    // 🏠 Real Estate Configuration
    get realEstate() {
        return {
            fundSize: parseFloat(process.env.FUND_SIZE) || 10000000,
            targetIRR: parseFloat(process.env.TARGET_IRR) || 0.15,
            maxLeverage: parseFloat(process.env.MAX_LEVERAGE) || 0.75,
            geographicFocus: process.env.GEOGRAPHIC_FOCUS || 'Sun Belt States'
        };
    }

    // 🔒 Security Configuration
    get security() {
        return {
            jwtSecret: process.env.JWT_SECRET || this.generateSecureSecret(),
            sessionTimeout: parseInt(process.env.SESSION_TIMEOUT) || 3600000,
            rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 900000,
            rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100
        };
    }

    /**
     * Validates that all required environment variables are present
     */
    validateRequiredEnvVars() {
        const requiredVars = [];
        
        // Only require API keys in production
        if (process.env.NODE_ENV === 'production') {
            if (!process.env.COINBASE_API_KEY || process.env.COINBASE_API_KEY === 'your_coinbase_api_key_here') {
                requiredVars.push('COINBASE_API_KEY');
            }
            if (!process.env.COINBASE_API_SECRET || process.env.COINBASE_API_SECRET === 'your_coinbase_api_secret_here') {
                requiredVars.push('COINBASE_API_SECRET');
            }
        }

        if (requiredVars.length > 0) {
            console.error('❌ Missing required environment variables:', requiredVars.join(', '));
            console.error('📝 Please update your .env file with valid credentials');
            if (process.env.NODE_ENV === 'production') {
                process.exit(1);
            }
        }
    }

    /**
     * Generates a secure secret for JWT if none provided
     */
    generateSecureSecret() {
        const crypto = require('crypto');
        return crypto.randomBytes(64).toString('hex');
    }

    /**
     * Checks if we're in a safe environment for live trading
     */
    isLiveTradingEnabled() {
        return process.env.NODE_ENV === 'production' && 
               this.trading.autoTradingEnabled &&
               this.trading.coinbase.apiKey &&
               this.trading.coinbase.apiKey !== 'your_coinbase_api_key_here';
    }

    /**
     * Gets the appropriate database URL based on environment
     */
    getDatabaseUrl() {
        if (process.env.NODE_ENV === 'production') {
            return process.env.DATABASE_URL;
        }
        return process.env.DEV_DATABASE_URL || 'sqlite://./oak_dragon_dev.db';
    }
}

module.exports = new ConfigManager();
