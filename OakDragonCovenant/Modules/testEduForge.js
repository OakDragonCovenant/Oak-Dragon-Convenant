const EduForgeAgent = require('./eduForgeAgent');

const forge = new EduForgeAgent("CurriculumSmith");
forge.reportStatus();
forge.activate();
forge.createBundle("Foundations of Mythic Governance", ["Intro to Sigils", "Legacy Rites"]);
forge.createBundle("Advanced Rituals", ["Flameborne Mastery", "Vault Protocols"]);
forge.listBundles();