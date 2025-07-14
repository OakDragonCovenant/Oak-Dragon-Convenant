const BaseAgent = require('../../RealtyCovenantProtocol/Core/baseAgent');

/**
 * Spawns, registers, and manages the lifecycle of all other agents.
 * This is the central factory for the Covenant's agent network.
 */
class OriginatorAgent extends BaseAgent {
    constructor(name) {
        super(name, "Originator Agent");
        this.agentRegistry = new Map();
    }

    /**
     * Spawns a new agent instance, injects dependencies, and adds it to the registry.
     * @param {class} AgentClass - The actual class of the agent to spawn (e.g., ScrollscribeAgent).
     * @param {string} agentName - The unique name for the new agent instance.
     * @param {object} dependencies - An object containing dependencies for the agent (e.g., { contextBinder }).
     */
    spawnAgent(AgentClass, agentName, dependencies = {}) {
        if (this.agentRegistry.has(agentName)) {
            console.warn(`${this.name}: ⚠️  Request denied. Agent '${agentName}' already exists.`);
            return;
        }
        // Pass the dependencies when creating the new agent instance.
        const agentInstance = new AgentClass(agentName, dependencies);
        this.agentRegistry.set(agentName, agentInstance);
        console.log(`${this.name}: ✨ Spawned and registered agent '${agentName}'.`);
    }

    /**
     * Retrieves a running agent instance from the registry.
     * @param {string} agentName - The name of the agent to retrieve.
     * @returns {object|undefined} The agent instance, or undefined if not found.
     */
    getAgent(agentName) {
        const agent = this.agentRegistry.get(agentName);
        if (!agent) {
            console.error(`${this.name}: Could not find an agent named '${agentName}' in the registry.`);
        }
        return agent;
    }
}

module.exports = OriginatorAgent;