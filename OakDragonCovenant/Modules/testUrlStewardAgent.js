const URLStewardAgent = require('./urlStewardAgent');

console.log("--- Testing URL Steward Agent ---");

// 1. Create an instance of the URL Steward Agent
const steward = new URLStewardAgent("Domainkeeper");

// 2. Use it to reserve some domains
steward.reserveDomain("oakdragoncovenant.com");
steward.reserveDomain("luminark.academy");
steward.reserveDomain("sigilmarket.store");

// 3. Try to reserve a domain that's already taken
steward.reserveDomain("oakdragoncovenant.com");

// 4. List all registered domains
steward.listDomains();

console.log("\n--- Test Complete ---");