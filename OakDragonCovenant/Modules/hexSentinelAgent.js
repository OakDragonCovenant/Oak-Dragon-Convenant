const BaseAgent = require('./baseAgent');

class HexSentinelAgent extends BaseAgent {
    constructor(name) {
        super(name, "Hex Sentinel");
    }

    detectIntrusion(source) {
        console.log(`${this.name} detected an intrusion from: ${source}`);
    }

    runForensics(event) {
        console.log(`${this.name} is running forensics on: ${event}`);
    }
}

module.exports = HexSentinelAgent;