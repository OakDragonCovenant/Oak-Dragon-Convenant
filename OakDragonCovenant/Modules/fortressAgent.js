const BaseAgent = require('../../RealtyCovenantProtocol/Core/baseAgent');

/**
 * The security guardian of the Covenant. It handles activating security protocols
 * and logging all security-related events.
 */
class FortressAgent extends BaseAgent {
    constructor(name) {
        super(name, "Fortress Agent");
        this.securityLog = [];
    }

    activateProtocol(protocolName) {
        const logEntry = `Protocol Activated: ${protocolName}`;
        this.securityLog.push(logEntry);
        console.log(`${this.name}: ${logEntry}`);
    }

    reportBreach(details) {
        const logEntry = `SECURITY ALERT: Breach reported - ${details}`;
        this.securityLog.push(logEntry);
        console.error(`${this.name}: ${logEntry}`);
    }

    showSecurityLog() {
        console.log(`\n--- ${this.name} Security Log ---`);
        this.securityLog.forEach((entry, i) => console.log(`${i + 1}: ${entry}`));
        console.log(`--- End of Log ---`);
    }
}

module.exports = FortressAgent;