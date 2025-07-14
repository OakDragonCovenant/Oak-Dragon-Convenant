const AlchemistAgent = require('./alchemist');

// Step 1: Create an instance
const myAlchemist = new AlchemistAgent("Aurelius");

// Step 2: Test transforming state
myAlchemist.transformState("Sigil Stirring");

// Step 3: Test performing a ritual
myAlchemist.performRitual("Flameborne Synthesis");