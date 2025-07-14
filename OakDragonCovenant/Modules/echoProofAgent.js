const BaseAgent = require('../../RealtyCovenantProtocol/Core/baseAgent');

/**
 * Verifies agent signals to prevent impersonation. It maintains a registry
 * of authentic agent signals to check against.
 */
class EchoProofAgent extends BaseAgent {
    constructor(name) {
        super(name, "EchoProof Agent");
        this.authenticSignals = new Set();
    }

    registerSignal(signal) {
        this.authenticSignals.add(signal);
        console.log(`${this.name}: Registered authentic signal -> ${signal}`);
    }

    verifySignal(signal) {
        if (this.authenticSignals.has(signal)) {
            console.log(`${this.name}: ✅ Signal VERIFIED: ${signal}`);
            return true;
        } else {
            console.error(`${this.name}: ❌ ALERT! Impersonation attempt or unregistered signal: ${signal}`);
            return false;
        }
    }
}

module.exports = EchoProofAgent;