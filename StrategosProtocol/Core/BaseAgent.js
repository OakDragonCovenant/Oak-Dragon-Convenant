/**
 * The foundational class for all agents within the Strategos Protocol.
 */
class BaseAgent {
    constructor(name, role) {
        this.name = name;
        this.role = role;
    }
}

module.exports = BaseAgent;