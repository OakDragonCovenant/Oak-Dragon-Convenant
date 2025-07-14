const RiteValidatorAgent = require('./riteValidatorAgent');

const validator = new RiteValidatorAgent("CeremonyGuard");
validator.reportStatus();
validator.activate();
validator.validateRite("Aurelius", "Sigil Initiation");
validator.validateRite("Selene", "Legacy Rite");
validator.listValidatedRites();