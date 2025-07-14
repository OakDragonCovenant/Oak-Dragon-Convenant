# 🏰 Oak Dragon Covenant - Advanced AI Agent Ecosystem

![Oak Dragon Covenant](https://img.shields.io/badge/Oak%20Dragon-Covenant-gold?style=for-the-badge&logo=dragon)
![Version](https://img.shields.io/badge/version-2.0.0-blue?style=flat-square)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

## 🌟 Overview

The **Oak Dragon Covenant** is a sophisticated multi-protocol AI agent ecosystem that combines real estate investment management with cryptocurrency trading automation. Built with enterprise-grade security, performance, and scalability in mind.

### 🏗️ System Architecture

```
Oak Dragon Covenant
├── 🏠 RealtyCovenantProtocol (Real Estate Investment)
├── 💰 StrategosProtocol (Cryptocurrency Trading)
├── 🤖 OakDragonCovenant (Agent Orchestration)
├── 🛡️ Security Layer (Authentication & Validation)
├── 📊 Logging & Monitoring
└── 🔧 Configuration Management
```

## 🚀 Features

### 💰 StrategosProtocol (Cryptocurrency Trading)
- **Automated Trading**: Live trading with Coinbase Pro integration
- **Risk Management**: Advanced risk assessment and position sizing
- **Technical Analysis**: Multi-indicator trading strategies
- **Portfolio Management**: Dynamic rebalancing and capital allocation
- **Market Research**: AI-powered market analysis and sentiment

### 🏠 RealtyCovenantProtocol (Real Estate Investment)
- **Property Acquisition**: Automated deal analysis and acquisition
- **Fund Management**: Multi-series investment fund structure
- **Portfolio Analytics**: Performance tracking and reporting
- **Compliance**: Regulatory compliance and reporting
- **Valuation Models**: AI-powered property valuation

### 🤖 OakDragonCovenant (Agent Network)
- **Agent Orchestration**: Centralized agent lifecycle management
- **Mythic Theming**: Unique fantasy-themed agent identities
- **Scalable Architecture**: Dynamic agent spawning and management
- **Inter-Agent Communication**: Sophisticated agent coordination

## 🛠️ Installation & Setup

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/oak-dragon-covenant.git
cd oak-dragon-covenant

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure your API keys (see Configuration section)
# Edit .env file with your credentials

# Run tests
npm test

# Start development server
npm run dev

# Start production server
npm start
```

### Docker Setup

```bash
# Development environment
docker-compose up -d

# Production environment
docker-compose -f docker-compose.prod.yml up -d
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file with the following configuration:

```bash
# 🌐 Server Configuration
NODE_ENV=development
PORT=3000
HOST=localhost
LOG_LEVEL=info

# 💰 Trading Configuration
COINBASE_API_KEY=your_api_key_here
COINBASE_API_SECRET=your_api_secret_here
COINBASE_SANDBOX=true
DEFAULT_TRADING_PAIR=BTC-USD
MAX_TRADE_AMOUNT=100
DAILY_LOSS_LIMIT=50
AUTO_TRADING_ENABLED=false

# 🏠 Real Estate Configuration
FUND_SIZE=10000000
TARGET_IRR=0.15
MAX_LEVERAGE=0.75
GEOGRAPHIC_FOCUS="Sun Belt States"

# 🔒 Security Configuration
JWT_SECRET=your_jwt_secret_here
SESSION_TIMEOUT=3600000
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

### API Key Setup

#### Coinbase Pro
1. Visit [Coinbase Pro API](https://pro.coinbase.com/profile/api)
2. Create new API key with trading permissions
3. Add to your `.env` file

#### Binance (Optional)
1. Visit [Binance API Management](https://www.binance.com/en/my/settings/api-management)
2. Create new API key
3. Add to your `.env` file

## 🧪 Testing

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

## 📖 API Documentation

### Health Check
```
GET /health
```

### Real Estate API
```
GET /api/covenant/fund-status
POST /api/covenant/acquisition/initiate
```

### Trading API
```
GET /api/strategos/v1/portfolio-status
POST /api/strategos/v1/execute-cycle
POST /api/strategos/v1/rebalance-capital
POST /api/strategos/v1/review-performance
```

## 🚀 Deployment

### Cloud Platforms

#### Render
```bash
npm run deploy:render
```

#### Railway
```bash
npm run deploy:railway
```

#### Heroku
```bash
heroku create oak-dragon-covenant
git push heroku main
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🛡️ Security

- **Environment Variables**: All sensitive data stored in environment variables
- **Rate Limiting**: API endpoints protected with rate limiting
- **Input Validation**: Comprehensive input validation using Joi
- **Error Handling**: Secure error handling without information leakage
- **Helmet.js**: Security headers for Express.js
- **CORS**: Configurable Cross-Origin Resource Sharing

## 📊 Monitoring & Logging

- **Structured Logging**: JSON-formatted logs with Winston
- **Performance Metrics**: Built-in performance monitoring
- **Health Checks**: Comprehensive health check endpoints
- **Error Tracking**: Detailed error logging and tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki](https://github.com/your-username/oak-dragon-covenant/wiki)
- **Issues**: [GitHub Issues](https://github.com/your-username/oak-dragon-covenant/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/oak-dragon-covenant/discussions)

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Core agent architecture
- ✅ Real estate protocol
- ✅ Cryptocurrency trading
- ✅ Enhanced security

### Phase 2 (Q3 2025)
- 🔄 Machine learning integration
- 🔄 Advanced portfolio optimization
- 🔄 Multi-exchange support
- 🔄 Mobile application

### Phase 3 (Q4 2025)
- 🔄 Decentralized finance (DeFi) integration
- 🔄 NFT marketplace integration
- 🔄 Advanced AI reasoning
- 🔄 Global expansion

---

**Built with 🐉 by the Oak Dragon Covenant Development Team**
