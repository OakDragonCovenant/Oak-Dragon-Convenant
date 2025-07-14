const SentinelAgent = require('./sentinelAgent');

const sentinel = new SentinelAgent("Warden", "Finance");
sentinel.reportStatus();
sentinel.activate();
sentinel.monitor();
sentinel.alert("Unauthorized transaction detected");