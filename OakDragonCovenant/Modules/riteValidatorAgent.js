const BaseAgent = require('./baseAgent');

class RiteValidatorAgent extends BaseAgent {
    constructor(name) {
        super(name, "Rite Validator");
        this.validatedRites = [];
    }

    validateRite(studentName, riteName) {
        this.validatedRites.push({ studentName, riteName });
        console.log(`${this.name} validated ${studentName} for rite: ${riteName}`);
    }

    listValidatedRites() {
        console.log(`${this.name} has validated these rites:`);
        this.validatedRites.forEach((r, i) =>
            console.log(`${i + 1}. ${r.studentName} - ${r.riteName}`)
        );
    }
}

module.exports = RiteValidatorAgent;