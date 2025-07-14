const BaseAgent = require('./baseAgent');

class EduForgeAgent extends BaseAgent {
    constructor(name) {
        super(name, "EduForge");
        this.bundles = [];
    }

    createBundle(bundleName, courses) {
        this.bundles.push({ bundleName, courses });
        console.log(`${this.name} created bundle: ${bundleName} with courses: ${courses.join(', ')}`);
    }

    listBundles() {
        console.log(`${this.name} has created these curriculum bundles:`);
        this.bundles.forEach((b, i) =>
            console.log(`${i + 1}. ${b.bundleName}: ${b.courses.join(', ')}`)
        );
    }
}

module.exports = EduForgeAgent;
