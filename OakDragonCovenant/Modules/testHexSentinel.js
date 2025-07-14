const HexSentinelAgent = require('./hexSentinelAgent');

const hex = new HexSentinelAgent("Cipherwatch");
hex.reportStatus();
hex.activate();
hex.detectIntrusion("Unknown IP 192.168.1.99");
hex.runForensics("Breach Event #42");