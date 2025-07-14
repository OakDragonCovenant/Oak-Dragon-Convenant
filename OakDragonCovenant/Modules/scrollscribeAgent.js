const BaseAgent = require('../../RealtyCovenantProtocol/Core/baseAgent');

/**
 * The content creator of the Covenant. It drafts documents and its tone
 * is influenced by the active symbolic context.
 */
class ScrollscribeAgent extends BaseAgent {
    constructor(name, dependencies = {}) {
        super(name, "Scrollscribe Agent");
        this.contextBinder = dependencies.contextBinder;
    }

    draftContent(session, prompt) {
        let tone = "Formal";
        let header = "Standard Document";
        if (this.contextBinder) {
            const context = this.contextBinder.getContext(session);
            if (context.rite === "initiation") {
                tone = "Mythic and Solemn";
                header = "Rite of Initiation Scroll";
            }
            if (context.sigil === "emberward") {
                tone = "Urgent and Financial";
                header = "Emberward Finance Directive";
            }
        }
        console.log(`${this.name}: Drafting "${header}" for prompt "${prompt}" with a ${tone} tone...`);
        const content = `--- ${header} ---\nTopic: ${prompt}\n\nThis text is written with a ${tone} tone, reflecting the gravity of the current context.\n--- END DRAFT ---`;
        return content;
    }
}

module.exports = ScrollscribeAgent;