const ConfigManager = require('../../config/configManager');

// Mock environment variables for testing
const originalEnv = process.env;

describe('ConfigManager', () => {
    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    describe('server configuration', () => {
        it('should use default values when env vars not set', () => {
            delete process.env.PORT;
            delete process.env.HOST;
            
            const config = require('../../config/configManager');
            
            expect(config.server.port).toBe(3000);
            expect(config.server.host).toBe('localhost');
            expect(config.server.nodeEnv).toBe('development');
        });

        it('should use environment variables when set', () => {
            process.env.PORT = '8080';
            process.env.HOST = '0.0.0.0';
            process.env.NODE_ENV = 'production';
            
            // Need to require fresh instance
            delete require.cache[require.resolve('../../config/configManager')];
            const config = require('../../config/configManager');
            
            expect(config.server.port).toBe(8080);
            expect(config.server.host).toBe('0.0.0.0');
            expect(config.server.nodeEnv).toBe('production');
        });
    });

    describe('trading configuration', () => {
        it('should handle API credentials correctly', () => {
            process.env.COINBASE_API_KEY = 'test_key';
            process.env.COINBASE_API_SECRET = 'test_secret';
            process.env.COINBASE_SANDBOX = 'true';
            
            delete require.cache[require.resolve('../../config/configManager')];
            const config = require('../../config/configManager');
            
            expect(config.trading.coinbase.apiKey).toBe('test_key');
            expect(config.trading.coinbase.apiSecret).toBe('test_secret');
            expect(config.trading.coinbase.sandbox).toBe(true);
        });

        it('should use default trading parameters', () => {
            const config = require('../../config/configManager');
            
            expect(config.trading.defaultPair).toBe('BTC-USD');
            expect(config.trading.maxTradeAmount).toBe(100);
            expect(config.trading.dailyLossLimit).toBe(50);
            expect(config.trading.autoTradingEnabled).toBe(false);
        });
    });

    describe('security configuration', () => {
        it('should generate secure JWT secret when none provided', () => {
            const config = require('../../config/configManager');
            
            expect(config.security.jwtSecret).toBeDefined();
            expect(config.security.jwtSecret.length).toBeGreaterThan(50);
        });

        it('should use provided JWT secret', () => {
            process.env.JWT_SECRET = 'custom_secret_key';
            
            delete require.cache[require.resolve('../../config/configManager')];
            const config = require('../../config/configManager');
            
            expect(config.security.jwtSecret).toBe('custom_secret_key');
        });
    });

    describe('isLiveTradingEnabled', () => {
        it('should return false in development', () => {
            process.env.NODE_ENV = 'development';
            process.env.AUTO_TRADING_ENABLED = 'true';
            process.env.COINBASE_API_KEY = 'real_key';
            
            delete require.cache[require.resolve('../../config/configManager')];
            const config = require('../../config/configManager');
            
            expect(config.isLiveTradingEnabled()).toBe(false);
        });

        it('should return true when all conditions met', () => {
            process.env.NODE_ENV = 'production';
            process.env.AUTO_TRADING_ENABLED = 'true';
            process.env.COINBASE_API_KEY = 'real_key';
            
            delete require.cache[require.resolve('../../config/configManager')];
            const config = require('../../config/configManager');
            
            expect(config.isLiveTradingEnabled()).toBe(true);
        });

        it('should return false with placeholder API key', () => {
            process.env.NODE_ENV = 'production';
            process.env.AUTO_TRADING_ENABLED = 'true';
            process.env.COINBASE_API_KEY = 'your_coinbase_api_key_here';
            
            delete require.cache[require.resolve('../../config/configManager')];
            const config = require('../../config/configManager');
            
            expect(config.isLiveTradingEnabled()).toBe(false);
        });
    });
});
