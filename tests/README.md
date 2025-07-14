# 🧪 Oak Dragon Covenant Testing Framework

## Test Structure

```
tests/
├── unit/                    # Unit tests for individual agents
├── integration/             # Integration tests for agent interactions
├── system/                  # End-to-end system tests
├── security/                # Security testing
├── performance/             # Performance benchmarks
└── fixtures/                # Test data and mocks
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:security

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

## Test Categories

### 🤖 Agent Tests
- BaseAgent functionality
- Agent lifecycle management
- Error handling and recovery
- Agent communication

### 💰 Trading Tests
- Portfolio management
- Risk assessment
- Trade execution simulation
- Market data processing

### 🏠 Real Estate Tests
- Property acquisition workflow
- Fund management
- Valuation calculations
- Compliance checks

### 🔒 Security Tests
- API authentication
- Rate limiting
- Input validation
- Error message sanitization

### 📊 Performance Tests
- System startup time
- Memory usage monitoring
- API response times
- Concurrent request handling

## Test Data Management

All test data should be anonymized and not contain real:
- API keys or credentials
- Personal information
- Financial data
- Property addresses

## Continuous Integration

Tests are automatically run on:
- Pull requests
- Main branch commits
- Scheduled nightly runs

## Mocking Strategy

External services are mocked for:
- Cryptocurrency exchanges
- Real estate APIs
- Payment processors
- Third-party data providers
