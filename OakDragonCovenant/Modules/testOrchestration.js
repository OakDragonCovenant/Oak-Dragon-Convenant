const OriginatorAgent = require('./originatorAgent');
const URLStewardAgent = require('./urlStewardAgent'); // Import the agent classes
const NameLoreAgent = require('./nameLoreAgent');

console.log("--- Testing Agent Orchestration ---");

// 1. Create the master agent
const genesis = new OriginatorAgent("Genesis");

// 2. Spawn the worker agents
genesis.spawnAgent(URLStewardAgent, "Domainkeeper");
genesis.spawnAgent(NameLoreAgent, "TechAdmin");

// 3. Get the running agent instances from the registry
const steward = genesis.getAgent("Domainkeeper");
const techAdmin = genesis.getAgent("TechAdmin");

// 4. Orchestrate a task: Claim a domain, then configure it.
const newDomain = "emberward.finance";

if (steward && steward.claimDomain(newDomain)) {
    // If the domain was successfully claimed, delegate to the NameLore agent
    console.log("\nGenesis: Domain claimed. Delegating to TechAdmin for DNS setup...");
    techAdmin.createDnsRecord(newDomain, "A", "104.26.10.188");
    techAdmin.createDnsRecord(newDomain, "MX", "mail.emberward.finance");
}

// 5. Review the final state
steward.listClaimedDomains();
techAdmin.listConfigurations();

console.log("\n--- Orchestration Test Complete ---");