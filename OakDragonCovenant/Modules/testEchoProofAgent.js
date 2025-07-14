const EchoProofAgent = require('./echoProofAgent');

console.log("--- Testing EchoProof Agent ---");

// 1. Create an instance of the EchoProof Agent
const signalGuard = new EchoProofAgent("SignalGuard");

// 2. Register some known, authentic agent signals
signalGuard.registerSignal("Fortress:Ironwall:AuthToken-A");
signalGuard.registerSignal("Originator:Genesis:AuthToken-B");

console.log("\n--- Verification Checks ---");

// 3. Verify the authentic signals
signalGuard.verifySignal("Fortress:Ironwall:AuthToken-A"); // This should pass

// 4. Verify a fake or unregistered signal
signalGuard.verifySignal("UnknownAgent:Impersonator:AuthToken-X"); // This should fail

console.log("\n--- Test Complete ---");