/**
 * A centralized registry of all official agent names.
 * This prevents "magic string" errors and makes the system more maintainable.
 */
const AgentNames = {
    // Tier 1: Executives
    Capital: "Treasurer",
    Adaptation: "Master-Strategist",

    // Tier 2: Department Heads
    Portfolio: "Scribe",
    Risk: "Sentinel",
    Execution: "Executor",
    Research: "Spymaster",
    Strategy: "Oracle",

    // Tier 3: Legates & Oracles
    Gateway: "Binance-Gateway",
    TA: "Calculator",
    LLM: "Seer"
};

Object.freeze(AgentNames); // Makes the object immutable

module.exports = AgentNames;