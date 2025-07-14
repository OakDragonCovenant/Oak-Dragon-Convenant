const EstateLoreAgent = require('./estateLoreAgent');

const lore = new EstateLoreAgent("Rootwise");
lore.reportStatus();
lore.activate();
lore.addTraining("REI Foundations", "Real Estate Basics");
lore.addTraining("Dynasty Wealth", "Trusts & Succession");
lore.listTrainings();