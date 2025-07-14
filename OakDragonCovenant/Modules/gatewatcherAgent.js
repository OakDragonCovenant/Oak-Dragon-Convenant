const BaseAgent = require('./baseAgent');

class GatewatcherAgent extends BaseAgent {
    constructor(name) {
        super(name, "Gatewatcher");
        this.trustedProtocols = [];
    }

    addTrustProtocol(protocol) {
        this.trustedProtocols.push(protocol);
        console.log(`${this.name} added trust protocol: ${protocol}`);
    }

    defendSite(siteName) {
        console.log(`${this.name} is defending site: ${siteName} using protocols: ${this.trustedProtocols.join(', ')}`);
    }
}

module.exports = GatewatcherAgent;