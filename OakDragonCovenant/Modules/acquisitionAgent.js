const BaseAgent = require('../../RealtyCovenantProtocol/Core/baseAgent');

/**
 * Manages the process of acquiring real estate assets for the Covenant.
 */
class AcquisitionAgent extends BaseAgent {
    constructor(name) {
        super(name, "Acquisition Agent");
        this.offerAmount = 0;
        this.downPayment = 0;
        this.closingCosts = 0;
        this.financingSource = 'Conventional Mortgage';
        this.status = 'Idle';
    }

    prepareOffer(propertyPrice, downPercent = 0.2, estimatedClosing = 6000) {
        this.offerAmount = propertyPrice;
        this.downPayment = propertyPrice * downPercent;
        this.closingCosts = estimatedClosing;
        this.status = 'Offer Prepared';
        console.log(`${this.name}: Offer prepared for property valued at $${propertyPrice.toLocaleString()}`);
    }

    setFinancing(source) {
        this.financingSource = source;
        console.log(`${this.name}: Financing method updated to: ${source}`);
    }

    finalizePurchase() {
        if (this.status !== 'Offer Prepared') {
            console.warn(`${this.name}: ⚠️ Cannot finalize purchase. No offer has been prepared.`);
            return;
        }
        this.status = 'Purchased';
        console.log(`${this.name}: ✅ Property successfully acquired using ${this.financingSource}.`);
    }
}

module.exports = AcquisitionAgent;