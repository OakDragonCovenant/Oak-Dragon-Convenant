const Covenant = require('../Core/covenantSystem');

console.log("--- Testing Real Estate Acquisition Workflow ---");

// 1. Boot the entire Covenant system
Covenant.boot();

// 2. Get the required agents from the system
const acquisitionAgent = Covenant.getAgent("Realty-Prime");
const scribe = Covenant.getAgent("Lorekeeper");
const contextBinder = Covenant.contextBinder;

// 3. Define the deal and create a symbolic context for it
const propertyPrice = 750000;
const dealSession = {};
contextBinder.bindContext(dealSession, { sigil: "emberward" }); // Mark this as a financial operation

console.log(`\n--- Orchestrating acquisition for a property valued at $${propertyPrice.toLocaleString()} ---`);

// 4. Delegate tasks to the agents
if (acquisitionAgent && scribe) {
    // Task 1: The Acquisition Agent prepares the offer
    acquisitionAgent.prepareOffer(propertyPrice);
    acquisitionAgent.setFinancing("Oak Dragon REO Fund, Series B");

    // Task 2: The Scribe drafts the offer letter, influenced by the context
    const offerLetter = scribe.draftContent(dealSession, `Formal offer for property acquisition.`);
    console.log("\n--- Generated Offer Letter ---");
    console.log(offerLetter);

    // Task 3: The Acquisition Agent finalizes the purchase
    console.log("\n--- Finalizing Purchase ---");
    acquisitionAgent.finalizePurchase();
}

console.log("\n--- Real Estate Workflow Test Complete ---");