const GatewatcherAgent = require('./gatewatcherAgent');

const gate = new GatewatcherAgent("SentinelPrime");
gate.reportStatus();
gate.activate();
gate.addTrustProtocol("2FA");
gate.addTrustProtocol("SSL");
gate.defendSite("oakdragoncovenant.com");