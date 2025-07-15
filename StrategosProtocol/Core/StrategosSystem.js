// Core System Imports
const BaseAgent = require('./BaseAgent');
const AgentNames = require('./AgentNames');

// Archon Imports
const PortfolioArchon = require('../Archons/PortfolioArchon');
const ExecutionArchon = require('../Archons/ExecutionArchon');
const RiskArchon = require('../Archons/RiskArchon');
const ResearchArchon = require('../Archons/ResearchArchon');
const StrategyArchon = require('../Archons/StrategyArchon');
const CapitalArchon = require('../Archons/CapitolArchon');
const AdaptationArchon = require('../Archons/AdaptationArchon');

// Legate Imports
const TA_Legate = require('../Legates/TA_Legate');
const LLM_Oracle = require('../Legates/LLM_Oracle');
const MarketScanner_Legate = require('../Legates/MarketScanner_Legate');

// Gateway Imports - LIVE TRADING
const Gateway_Coinbase = require('../Exchanges/Gateway_Coinbase');
// Mock Gateway for testing (commented out for live trading)
// const ExchangeGateway_Mock = require('../Legates/ExchangeGateway_Mock');

class StrategosSystem {
    constructor() {
        this.agents = new Map();
        this.riskProfiles = this.initializeRiskProfiles();
        this.ultraMicroConfig = this.initializeUltraMicroConfig();
        this.extremeRiskConfig = this.initializeExtremeRiskConfig();
        console.log("🐉 Strategos Protocol System initialized with Ultra-Micro & Extreme Risk capabilities.");
    }

    initializeRiskProfiles() {
        return {
            ULTRA_CONSERVATIVE: { maxRisk: 0.001, maxPosition: 0.01 },  // 0.1% risk, 1% position
            CONSERVATIVE: { maxRisk: 0.02, maxPosition: 0.15 },          // 2% risk, 15% position  
            MODERATE: { maxRisk: 0.05, maxPosition: 0.25 },              // 5% risk, 25% position
            AGGRESSIVE: { maxRisk: 0.10, maxPosition: 0.50 },            // 10% risk, 50% position
            EXTREME_HIGH_RISK: { maxRisk: 0.50, maxPosition: 0.90 },     // 50% risk, 90% position
            ULTRA_HIGH_RISK: { maxRisk: 0.80, maxPosition: 0.95 },       // 80% risk, 95% position
            MAXIMUM_RISK: { maxRisk: 1.00, maxPosition: 1.00 }           // 100% risk, 100% position
        };
    }

    initializeUltraMicroConfig() {
        return {
            enabled: true,
            dustThreshold: 0.0000001,        // Ultra-micro minimum
            ultraMicroThreshold: 0.001,      // Ultra-micro classification
            precisionMode: 'ultra',          // Ultra precision mode
            maxDecimalPlaces: 8,             // 8-decimal precision
            microPortfolioOptimization: true // Optimize for small accounts
        };
    }

    initializeExtremeRiskConfig() {
        return {
            enabled: true,
            leverageAllowed: true,
            maxLeverage: 10,                 // 10x leverage for extreme trades
            stopLossRequired: false,         // Allow no-stop-loss trades
            emergencyStopEnabled: true,      // Emergency stop at 95% loss
            extremePositionSizing: true,     // Allow 90%+ position sizes
            highVolatilityTargets: true,     // Target volatile assets
            moonShotMode: true,              // All-in moonshot capability
            riskWarnings: true               // Show extreme risk warnings
        };
    }
    
    spawnAgent(AgentClass, name, config = {}) {
        const agent = new AgentClass(name, config);
        this.agents.set(name, agent);
        return agent;
    }
    
    getAgent(name) {
        return this.agents.get(name);
    }
    boot() {
        console.log("🚀 Strategos Protocol LIVE TRADING boot sequence initiated...");
        
        // Tier 3: Foundational Agents
        const portfolioArchon = this.spawnAgent(PortfolioArchon, AgentNames.Portfolio);
        
        // 🔥 LIVE TRADING: Use Coinbase Gateway instead of Mock
        const coinbaseGateway = this.spawnAgent(Gateway_Coinbase, AgentNames.Gateway);
        console.log("⚡ LIVE TRADING MODE: Coinbase Gateway activated!");
        console.log("🎯 Small Account Mode: Optimized for $8.89 USDT starting balance");
        
        const taLegate = this.spawnAgent(TA_Legate, AgentNames.TA);
        const llmOracle = this.spawnAgent(LLM_Oracle, AgentNames.LLM);
        const marketScanner = this.spawnAgent(MarketScanner_Legate, "Market-Scanner");
        const executionArchon = this.spawnAgent(ExecutionArchon, AgentNames.Execution, { 
            exchangeGateway: coinbaseGateway, 
            portfolioArchon: portfolioArchon 
        });

        // Tier 2: Department Heads
        const riskArchon = this.spawnAgent(RiskArchon, AgentNames.Risk);
        const researchArchon = this.spawnAgent(ResearchArchon, AgentNames.Research, { llmOracle: llmOracle });
        const strategyArchon = this.spawnAgent(StrategyArchon, AgentNames.Strategy, { 
            riskArchon, executionArchon, taLegate, researchArchon, portfolioArchon, marketScanner
        });

        // Tier 1: The Executive Suite
        this.spawnAgent(CapitalArchon, AgentNames.Capital, { portfolioArchon: portfolioArchon });
        this.spawnAgent(AdaptationArchon, AgentNames.Adaptation);

        console.log("🎯 Strategos LIVE TRADING boot sequence complete. All Tiers active and connected to Coinbase!");
        console.log("💰 Ready to trade with 8 optimized cryptocurrency pairs using $8.89 USDT balance!");
    }
}
module.exports = StrategosSystem;