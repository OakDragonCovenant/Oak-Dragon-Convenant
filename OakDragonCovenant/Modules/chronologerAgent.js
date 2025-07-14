class ChronologerAgent {
  constructor() {
    this.timeline = [];
  }

  recordEvent(agentName, action) {
    const entry = {
      agent: agentName,
      action,
      timestamp: new Date().toISOString()
    };
    this.timeline.push(entry);
    console.log(`Event recorded: ${agentName} → ${action}`);
    return entry;
  }

  getTimeline() {
    return this.timeline;
  }
}

module.exports = ChronologerAgent;