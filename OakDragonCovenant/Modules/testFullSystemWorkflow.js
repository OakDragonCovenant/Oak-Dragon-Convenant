const CovenantSystem = require('../Core/covenantSystem');

console.log("--- Testing Upgraded Full System Workflow ---");

const Covenant = new CovenantSystem();
Covenant.boot();

const fundManager = Covenant.getAgent("Fund-Steward");
const acquisitionAgent = Covenant.getAgent("Realty-Prime");

const propertyPrice = 1200000;
const financingSeries = "Series B";
const propertyName = "456 Maple Ave";

console.log(`\n--- Initiating acquisition for [${propertyName}] ---`);

if (fundManager.checkSeriesCapacity(financingSeries)) {
    // Step A: Acquisition
    acquisitionAgent.prepareOffer(propertyPrice);
    acquisitionAgent.setFinancing(`Oak Dragon REO Fund, ${financingSeries}`);
    acquisitionAgent.finalizePurchase();

    // Step B: Update Portfolio
    // The Acquisition Agent notifies the Fund Manager of the new asset.
    console.log("\n--- Notifying Fund Manager to update portfolio ---");
    fundManager.addAssetToPortfolio(propertyName, propertyPrice, financingSeries);

    // Step C: Final Verification
    console.log("\n--- Verifying Final Portfolio Status ---");
    const finalReport = fundManager.getFundStatusReport();
    console.log(JSON.stringify(finalReport.livePortfolio, null, 2));
}

console.log("\n--- Upgraded Workflow Test Complete ---");