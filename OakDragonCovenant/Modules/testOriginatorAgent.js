const OriginatorAgent = require('./originatorAgent');

console.log("--- Testing Originator Agent ---");

// 1. Create an instance of the Originator Agent
const genesis = new OriginatorAgent("Genesis");

// 2. Use its methods to spawn other agents
genesis.spawnAgent("Fortress Agent", "Ironwall");
genesis.spawnAgent("Scrollscribe Agent", "Lorekeeper");
genesis.spawnAgent("Gatewatcher Agent", "Vigil");

// 3. Show the final list of spawned agents
genesis.listSpawnedAgents();

console.log("\n--- Test Complete ---");