const ScrollscribeAgent = require('./scrollscribeAgent');

console.log("--- Testing Scrollscribe Agent ---");

// 1. Create an instance of the Scrollscribe Agent
const lorekeeper = new ScrollscribeAgent("Lorekeeper");

// 2. Use it to draft different types of content
const charterDraft = lorekeeper.draftContent("The Founding of the Oak Dragon Covenant", "Mythic");
console.log(charterDraft);

const technicalDoc = lorekeeper.draftContent("The Protocol for Sigil Authentication", "Technical");
console.log(technicalDoc);

console.log("\n--- Test Complete ---");