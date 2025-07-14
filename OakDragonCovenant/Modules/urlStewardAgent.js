const BaseAgent = require('../../RealtyCovenantProtocol/Core/baseAgent');

/**
 * Manages domain name registration and tracking for the Covenant.
 */
class URLStewardAgent extends BaseAgent {
    constructor(name) {
        super(name, "URL Steward Agent");
        this.domainRegistry = new Map();
    }

    claimDomain(domainName) {
        console.log(`${this.name}: Probing the aether for [${domainName}]...`);
        if (this.domainRegistry.has(domainName)) {
            console.warn(`${this.name}: ⚠️  The domain [${domainName}] is already under Covenant protection.`);
            return false;
        }
        const registrationInfo = {
            claimedOn: new Date().toISOString(),
            renewalDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            status: "Secured"
        };
        this.domainRegistry.set(domainName, registrationInfo);
        console.log(`${this.name}: ✅ The domain [${domainName}] has been claimed and sealed.`);
        return true;
    }

    listClaimedDomains() {
        console.log(`\n--- ${this.name}'s Scroll of Digital Lands ---`);
        if (this.domainRegistry.size === 0) {
            console.log("The scroll is blank. No domains are claimed.");
        } else {
            this.domainRegistry.forEach((info, domain) => {
                console.log(`- [${domain}] | Status: ${info.status}, Renewal: ${info.renewalDate}`);
            });
        }
        console.log(`--- End of Scroll ---`);
    }
}

module.exports = URLStewardAgent;