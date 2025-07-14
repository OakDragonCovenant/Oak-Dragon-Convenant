// Modules/testGuildWeaver.js

const GuildWeaverAgent = require('./guildWeaverAgent');
const industries = ['RitualCraft', 'Banking', 'Insurance', 'Education'];

industries.forEach(ind => {
  const guild = new GuildWeaverAgent(ind);
  guild.summonAgents();
  console.log(`${ind} Roster:`, guild.getRoster());
});