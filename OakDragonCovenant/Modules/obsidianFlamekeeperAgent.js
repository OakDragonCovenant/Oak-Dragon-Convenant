const BaseAgent = require('./baseAgent');

class ObsidianFlamekeeperAgent extends BaseAgent {
    constructor(name) {
        super(name, "Obsidian Flamekeeper");
    }

    guardVault(vaultName) {
        console.log(`${this.name} is guarding the vault: ${vaultName}`);
    }

    logRitual(ritualName) {
        console.log(`${this.name} logs the ritual: ${ritualName}`);
    }
}

module.exports = ObsidianFlamekeeperAgent;