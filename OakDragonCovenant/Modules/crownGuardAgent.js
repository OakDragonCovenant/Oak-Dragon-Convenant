const BaseAgent = require('./baseAgent');

class CrownGuardAgent extends BaseAgent {
    constructor(name) {
        super(name, "Crown Guard");
        this.milestones = [];
    }

    trackMilestone(milestone) {
        this.milestones.push(milestone);
        console.log(`${this.name} tracked milestone: ${milestone}`);
    }

    listMilestones() {
        console.log(`${this.name} has tracked these milestones:`);
        this.milestones.forEach((m, i) => console.log(`${i + 1}. ${m}`));
    }
}

module.exports = CrownGuardAgent;