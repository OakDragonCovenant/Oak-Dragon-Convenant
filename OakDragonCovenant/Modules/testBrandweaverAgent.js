const BrandweaverAgent = require('./brandweaverAgent');

console.log("--- Testing Brandweaver Agent ---");

// 1. Create an instance of the Brandweaver Agent
const weaver = new BrandweaverAgent("Sigilcrafter");

// 2. Use it to create a branding package
const luminarkTheme = weaver.createBrandingPackage("Luminark Academy", "Glowing Tome");

// 3. Print the result to the console
console.log("\nGenerated Branding Package:");
console.log(luminarkTheme);

console.log("\n--- Test Complete ---");
