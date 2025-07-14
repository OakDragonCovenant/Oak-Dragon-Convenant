const AppreciationAgent = require('./appreciationAgent');
const aa = new AppreciationAgent();

aa.recordValue(200000);
aa.recordValue(220000);
aa.recordValue(240000);

const pct = aa.getAppreciationPercentage();
console.log('History:', aa.getHistory());
console.log('Calculated Appreciation %:', pct.toFixed(2));