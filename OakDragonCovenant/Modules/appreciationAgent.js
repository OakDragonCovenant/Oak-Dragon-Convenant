// Modules/appreciationAgent.js

class AppreciationAgent {
  constructor() {
    this.history = [];
    this.initialIndex = null;
    this.currentIndex = null;
  }

  recordValue(value) {
    const entry = { value, date: new Date().toISOString() };
    this.history.push(entry);

    if (this.history.length === 1) {
      this.initialIndex = 0;
    }
    this.currentIndex = this.history.length - 1;

    console.log(`Recorded property value: $${value.toLocaleString()}`);
  }

  getAppreciationPercentage() {
    if (this.history.length < 2) {
      console.warn('Need at least two value records to calculate appreciation.');
      return 0;
    }

    const initial = this.history[this.initialIndex].value;
    const current = this.history[this.currentIndex].value;
    const pct = ((current - initial) / initial) * 100;

    console.log(`Appreciation: ${pct.toFixed(2)}%`);
    return pct;
  }

  getHistory() {
    return this.history;
  }
}

module.exports = AppreciationAgent;