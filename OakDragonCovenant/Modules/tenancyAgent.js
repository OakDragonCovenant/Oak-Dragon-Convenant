// Modules/tenancyAgent.js

class TenancyAgent {
  constructor() {
    this.tenants = [];
    this.rentRecords = [];
    this.maintenanceRequests = [];
  }

  addTenant(name, leaseTermMonths) {
    this.tenants.push({ name, leaseTermMonths, startDate: new Date().toISOString() });
    console.log(`Tenant added: ${name}`);
  }

  collectRent(name, amount) {
    const record = { name, amount, date: new Date().toISOString() };
    this.rentRecords.push(record);
    console.log(`Rent collected from ${name}: $${amount}`);
  }

  requestMaintenance(name, issue) {
    this.maintenanceRequests.push({ name, issue, date: new Date().toISOString() });
    console.log(`Maintenance requested by ${name}: ${issue}`);
  }

  evictTenant(name) {
    this.tenants = this.tenants.filter(t => t.name !== name);
    console.log(`Tenant evicted: ${name}`);
  }

  listTenants() {
    return this.tenants.map(t => t.name);
  }
}

module.exports = TenancyAgent;