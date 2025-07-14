const BaseAgent = require('./baseAgent');

class RitualFlowAgent extends BaseAgent {
    constructor(name) {
        super(name, "RitualFlow");
        this.flows = [];
    }

    designFunnel(funnelName) {
        this.flows.push(funnelName);
        console.log(`${this.name} designed a new ritual funnel: ${funnelName}`);
    }

    showFlows() {
        console.log(`${this.name} has designed these ritual flows:`);
        this.flows.forEach((f, i) => console.log(`${i + 1}. ${f}`));
    }
}

module.exports = RitualFlowAgent;