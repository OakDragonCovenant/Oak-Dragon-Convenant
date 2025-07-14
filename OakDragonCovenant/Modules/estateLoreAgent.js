const BaseAgent = require('./baseAgent');

class EstateLoreAgent extends BaseAgent {
    constructor(name) {
        super(name, "EstateLore");
        this.trainings = [];
    }

    addTraining(trainingName, topic) {
        this.trainings.push({ trainingName, topic });
        console.log(`${this.name} added training: ${trainingName} on topic: ${topic}`);
    }

    listTrainings() {
        console.log(`${this.name} offers these trainings:`);
        this.trainings.forEach((t, i) =>
            console.log(`${i + 1}. ${t.trainingName} (Topic: ${t.topic})`)
        );
    }
}

module.exports = EstateLoreAgent;