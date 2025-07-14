const BaseAgent = require('../../RealtyCovenantProtocol/Core/baseAgent');

/**
 * Manages DNS, hosting, and other technical configurations for domains.
 */
class NameLoreAgent extends BaseAgent {
    constructor(name) {
        super(name, "NameLore Agent");
        this.dnsConfigurations = new Map();
    }

    createDnsRecord(domainName, recordType, value) {
        console.log(`${this.name}: Configuring DNS for ${domainName}...`);
        if (!this.dnsConfigurations.has(domainName)) {
            this.dnsConfigurations.set(domainName, []);
        }
        const records = this.dnsConfigurations.get(domainName);
        const newRecord = { type: recordType, value: value, createdAt: new Date().toISOString() };
        records.push(newRecord);
        console.log(`  -> Created ${recordType} record with value: ${value}`);
    }

    listConfigurations() {
        console.log(`\n--- ${this.name} DNS Configurations ---`);
        if (this.dnsConfigurations.size === 0) {
            console.log("No DNS configurations set.");
        } else {
            this.dnsConfigurations.forEach((records, domain) => {
                console.log(`\nDomain: ${domain}`);
                records.forEach(record => {
                    console.log(`  - Type: ${record.type}, Value: ${record.value}`);
                });
            });
        }
        console.log(`--- End of Configurations ---`);
    }
}

module.exports = NameLoreAgent;