const ObsidianFlamekeeperAgent = require('./obsidianFlamekeeperAgent');

const flamekeeper = new ObsidianFlamekeeperAgent("Ashenwatch");
flamekeeper.reportStatus();
flamekeeper.activate();
flamekeeper.guardVault("Obsidian Codex Vault");
flamekeeper.logRitual("Equinox Sealing");