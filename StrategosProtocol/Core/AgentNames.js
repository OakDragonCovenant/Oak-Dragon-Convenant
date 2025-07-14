/**
 * Centralized agent names for the Strategos Protocol
 * This ensures consistent naming across the entire system
 */
const AgentNames = {
    // Core Archons
    Portfolio: "Portfolio-Archon",
    Execution: "Execution-Archon", 
    Risk: "Risk-Archon",
    Research: "Research-Archon",
    Strategy: "Strategy-Archon",
    Capital: "Capital-Archon",
    Adaptation: "Adaptation-Archon",
    
    // Legates & Oracles
    TA: "TA-Legate",
    LLM: "LLM-Oracle",
    MarketScanner: "Market-Scanner-Legate",
    
    // Gateways
    Gateway: "Exchange-Gateway",
    CoinbaseGateway: "Coinbase-Gateway",
    BinanceGateway: "Binance-Gateway",
    
    // System Components
    System: "Strategos-System"
};

module.exports = Object.freeze(AgentNames);
