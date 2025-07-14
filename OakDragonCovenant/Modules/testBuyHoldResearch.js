// Modules/testBuyHoldResearch.js
const BuyHoldAgent = require('./buyHoldAgent');

(async () => {
  const bh = new BuyHoldAgent();
  console.log('Roles:', bh.listRoles());

  // Call the scout’s researchComps via the orchestrator
  const comps = await bh.roles.scout.researchComps('Detroit');
  console.log('Comps via BuyHoldAgent:', comps);
})();