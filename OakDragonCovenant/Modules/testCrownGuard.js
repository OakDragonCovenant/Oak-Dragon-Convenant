const CrownGuardAgent = require('./crownGuardAgent');

const guard = new CrownGuardAgent("Regulus");
guard.reportStatus();
guard.activate();
guard.trackMilestone("First Succession Rite");
guard.trackMilestone("Sigil Transfer Ceremony");
guard.listMilestones();