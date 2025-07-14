const RitualFlowAgent = require('./ritualFlowAgent');

const ritualist = new RitualFlowAgent("Pathweaver");
ritualist.reportStatus();
ritualist.activate();
ritualist.designFunnel("Initiate Onboarding");
ritualist.designFunnel("Legacy Succession");
ritualist.showFlows();