// Step 1: Define the AlchemistAgent class
class AlchemistAgent {
    constructor(name) {
        this.name = name;
        this.state = "Glyph Sealed"; // Starting lifecycle phase
    }

    // Step 2: Method to transform state
    transformState(newState) {
        console.log(`${this.name} transforming from ${this.state} to ${newState}`);
        this.state = newState;
    }

    // Step 3: Method to perform a ritual (placeholder)
    performRitual(ritualName) {
        console.log(`${this.name} is performing the ritual: ${ritualName}`);
    }
}

// Step 4: Export the class so you can use it elsewhere
module.exports = AlchemistAgent;