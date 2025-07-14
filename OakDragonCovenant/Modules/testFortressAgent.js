const FortressAgent = require('./fortressAgent');

console.log("--- Testing Fortress Agent ---");

// 1. Create an instance of our agent
const fort = new FortressAgent("Ironwall");

// 2. Use its methods
fort.activateProtocol("Zero Trust Network");
fort.activateProtocol("Sigil-Based Authentication");
fort.reportBreach("Unauthorized access attempt on /vault");

// 3. Show the final log
fort.showSecurityLog();

console.log("\n--- Test Complete ---");