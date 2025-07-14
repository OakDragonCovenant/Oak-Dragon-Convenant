const AcquisitionAgent = require('./acquisitionAgent');

console.log("--- Testing Acquisition Agent ---");

// 1. Create an instance of the agent
const acqAgent = new AcquisitionAgent("Realty-Prime");
acqAgent.reportStatus();

// --- Scenario 1: Successful Purchase ---
console.log("\n--- Simulating a successful property acquisition ---");

// 2. Prepare an offer for a property
acqAgent.prepareOffer(500000);

// 3. Set a specific financing source
acqAgent.setFinancing("Oak Dragon REO Fund, Series A");

// 4. Finalize the purchase
acqAgent.finalizePurchase();

// --- Scenario 2: Failed Purchase ---
console.log("\n--- Simulating a failed acquisition (no offer prepared) ---");
const failedAgent = new AcquisitionAgent("Realty-Secondary");
failedAgent.reportStatus();
failedAgent.finalizePurchase(); // This should fail and show a warning

console.log("\n--- Test Complete ---");