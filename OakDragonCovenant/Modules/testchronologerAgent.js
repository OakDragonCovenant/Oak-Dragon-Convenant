const ChronologerAgent = require('./chronologerAgent');
const chron = new ChronologerAgent();

chron.recordEvent('VaultwrightAgent', 'Opened vault');
chron.recordEvent('TransferAgent', 'Moved 50 Dragon Coin');

console.log('Timeline:', chron.getTimeline());