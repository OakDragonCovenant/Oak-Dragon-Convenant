const TenancyAgent = require('./tenancyAgent');
const ta = new TenancyAgent();

ta.addTenant('Alice Johnson', 12);
ta.collectRent('Alice Johnson', 1200);
ta.requestMaintenance('Alice Johnson', 'Leaky faucet in kitchen');
console.log('Tenants:', ta.listTenants());
ta.evictTenant('Alice Johnson');
console.log('Tenants after eviction:', ta.listTenants());