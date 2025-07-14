// Global test setup
const logger = require('../utils/logger');

// Mock logger for tests to avoid noise
jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  agentAction: jest.fn(),
  agentError: jest.fn(),
  tradeExecuted: jest.fn(),
  tradeError: jest.fn(),
  propertyAcquisition: jest.fn(),
  securityEvent: jest.fn(),
  performanceMetric: jest.fn()
}));

// Global test utilities
global.testUtils = {
  // Create mock agent
  createMockAgent: (name = 'TestAgent', type = 'Test') => {
    const BaseAgent = require('../RealtyCovenantProtocol/Core/baseAgent');
    return new BaseAgent(name, type);
  },
  
  // Create mock trading data
  createMockTrade: (overrides = {}) => ({
    symbol: 'BTC-USD',
    side: 'buy',
    amount: 100,
    price: 50000,
    type: 'market',
    ...overrides
  }),
  
  // Create mock property data
  createMockProperty: (overrides = {}) => ({
    address: '123 Test Street',
    price: 500000,
    financing: 'Oak Dragon REO Fund, Series A',
    propertyType: 'SFR',
    ...overrides
  }),
  
  // Wait for async operations
  waitFor: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Clean up after tests
  cleanup: () => {
    jest.clearAllMocks();
  }
};

// Clean up after each test
afterEach(() => {
  global.testUtils.cleanup();
});

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'error'; // Reduce log noise in tests
process.env.COINBASE_API_KEY = 'test_key';
process.env.COINBASE_API_SECRET = 'test_secret';
