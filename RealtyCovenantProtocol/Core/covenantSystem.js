const OriginatorAgent = require('../../OakDragonCovenant/Modules/originatorAgent');
const FortressAgent = require('../../OakDragonCovenant/Modules/fortressAgent');
const URLStewardAgent = require('../../OakDragonCovenant/Modules/urlStewardAgent');
const NameLoreAgent = require('../../OakDragonCovenant/Modules/nameLoreAgent');
const ScrollscribeAgent = require('../../OakDragonCovenant/Modules/scrollscribeAgent');
const AcquisitionAgent = require('../../OakDragonCovenant/Modules/acquisitionAgent');
const FundManagerAgent = require('../../OakDragonCovenant/Modules/fundManagerAgent');
const SymbolicContextBinder = require('./symbolicContextBinder');

/**
 * The central nervous system of the Oak Dragon Covenant.
 */
class CovenantSystem {
    constructor() {
        this.originator = new OriginatorAgent("Genesis");
        this.contextBinder = new SymbolicContextBinder();
        console.log("Covenant System Initialized. Genesis and Context Binder are active.");
    }

    boot() {
        console.log("System Boot sequence initiated by Genesis...");
        this.originator.spawnAgent(FortressAgent, "Ironwall");
        this.originator.spawnAgent(URLStewardAgent, "Domainkeeper");
        this.originator.spawnAgent(NameLoreAgent, "TechAdmin");
        this.originator.spawnAgent(AcquisitionAgent, "Realty-Prime");
        this.originator.spawnAgent(FundManagerAgent, "Fund-Steward");

        const scribeDependencies = { contextBinder: this.contextBinder };
        this.originator.spawnAgent(ScrollscribeAgent, "Lorekeeper", scribeDependencies);
        console.log("...Boot sequence complete. All foundational agents are active.");
    }

    getAgent(agentName) {
        return this.originator.getAgent(agentName);
    }
}

// Export the class itself, not an instance.
module.exports = CovenantSystem;