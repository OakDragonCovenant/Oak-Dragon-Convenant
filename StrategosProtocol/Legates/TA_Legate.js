const BaseAgent = require('../Core/BaseAgent');
const ti = require('technicalindicators');

/**
 * A specialized worker agent for performing technical analysis calculations.
 */
class TA_Legate extends BaseAgent {
    constructor(name) {
        super(name, "Technical Analysis Legate");
        console.log(`${this.name}: Ready to perform calculations.`);
    }

    /**
     * Calculates the Relative Strength Index (RSI).
     * @param {number[]} values - An array of closing prices.
     * @returns {number} The latest RSI value.
     */
    calculateRSI(values) {
        const rsiInput = {
            values: values,
            period: 14 // Standard RSI period
        };
        const rsiResult = ti.rsi(rsiInput);
        // Return the very last calculated RSI value
        return rsiResult[rsiResult.length - 1];
    }
}

module.exports = TA_Legate;