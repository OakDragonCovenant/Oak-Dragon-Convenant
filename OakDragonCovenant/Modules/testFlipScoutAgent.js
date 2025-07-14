const FlipScoutAgent = require('./flipscoutAgent');
(async () => {
  const scout = new FlipScoutAgent();
  scout.addOffer({ address:'123 Elm St', price:170000, arv:200000 });
  console.log('Shortlist:', scout.shortlistOffers());
  const trends = await scout.researchMarket('Detroit');
  console.log('Market trends:', trends);
})();PerformanceResourceTiming