const PropertyScoutAgent = require('./propertyScoutAgent');
(async () => {
  const scout = new PropertyScoutAgent();
  const comps = await scout.researchComps('Detroit');
  console.log('Received comps:', comps);
})();