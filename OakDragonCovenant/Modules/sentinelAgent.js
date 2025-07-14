const BaseAgent = require('./baseAgent');

class SentinelAgent extends BaseAgent {
    constructor(name, domain = "General") {
        super(name, "Sentinel");
        this.domain = domain;
    }

    monitor() {
        console.log(`${this.name} is monitoring the ${this.domain} domain.`);
    }

    alert(issue) {
        console.log(`${this.name} ALERT: Issue detected in ${this.domain} - ${issue}`);
    }
}

module.exports = SentinelAgent;