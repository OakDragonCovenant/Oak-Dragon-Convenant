const FundManagerAgent = require('./fundManagerAgent');

console.log("--- Testing Upgraded Fund Manager Agent ---");

const fundManager = new FundManagerAgent("Fund-Steward");

// 1. Simulate adding assets to the portfolio
console.log("\n--- Acquiring Assets ---");
fundManager.addAssetToPortfolio("123 Oak St", 550000, "Series A");
fundManager.addAssetToPortfolio("456 Maple Ave", 1200000, "Series B");
fundManager.addAssetToPortfolio("789 Pine Ln", 475000, "Series A");

// 2. Get detailed report for a specific series
console.log("\n--- Requesting Series A Details ---");
const seriesADetails = fundManager.getSeriesDetails("Series A");
console.log(seriesADetails);

// 3. Get the full, comprehensive fund status report
console.log("\n--- Requesting Full Fund Status Report ---");
// This line is now calling the correct method name: getFundStatusReport()
const fullReport = fundManager.getFundStatusReport(); 
console.log(JSON.stringify(fullReport, null, 2)); // Pretty-print the JSON report

console.log("\n--- Test Complete ---");