const BaseAgent = require('../../RealtyCovenantProtocol/Core/baseAgent');

let oakDragonREOFund;
try {
    oakDragonREOFund = require('./oakDragonREOFund');
} catch (error) {
    oakDragonREOFund = null;
}

class FundManagerAgent extends BaseAgent {
    constructor(name) {
        super(name, "Fund Manager Agent");
        if (!oakDragonREOFund) {
            console.error(`[${this.name}] 致命的エラー: oakDragonREOFund.js の設計図が見つからないか、破損しています。`);
            this.fundData = null;
            this.portfolio = [];
            return;
        }
        this.fundData = oakDragonREOFund;
        this.portfolio = [];
        console.log(`${this.name}: Now managing the Oak Dragon REO Fund.`);
    }

    addAssetToPortfolio(propertyName, purchasePrice, financingSeries) {
        if (!this.fundData) return;
        const asset = { propertyName, purchasePrice, financingSeries, acquiredOn: new Date().toISOString() };
        this.portfolio.push(asset);
        console.log(`${this.name}: New asset [${propertyName}] added to portfolio under ${financingSeries}.`);
    }

    getFundStatusReport() {
        if (!this.fundData) return { error: "Fund data blueprint is missing." };
        const totalPortfolioValue = this.portfolio.reduce((sum, asset) => sum + asset.purchasePrice, 0);
        const report = {
            fundName: this.fundData.overview.fundName,
            fundTarget: this.fundData.overview.targetRaise,
            legalStructure: this.fundData.legalStructure.fundVehicle,
            livePortfolio: {
                assetCount: this.portfolio.length,
                totalValue: totalPortfolioValue,
                assets: this.portfolio
            }
        };
        console.log(`\n--- ${this.name} generating full fund status report... ---`);
        return report;
    }

    /**
     * THIS IS THE MISSING FUNCTION.
     * It must be present in this file.
     */
    checkSeriesCapacity(seriesName) {
        if (!this.fundData) return false;
        const seriesExists = this.fundData.legalStructure.series.some(s => s.name === seriesName);
        if (seriesExists) {
            console.log(`${this.name}: ✅ Series [${seriesName}] is a valid investment vehicle.`);
            return true;
        } else {
            console.warn(`${this.name}: ⚠️ Series [${seriesName}] is not a valid series in this fund.`);
            return false;
        }
    }

    getSeriesDetails(seriesName) {
        if (!this.fundData) return null;
        const series = this.fundData.legalStructure.series.find(s => s.name === seriesName);
        if (series) {
            const portfolioAssets = this.portfolio.filter(a => a.financingSeries === seriesName);
            const capitalDeployed = portfolioAssets.reduce((sum, asset) => sum + asset.purchasePrice, 0);
            return {
                ...series,
                capitalDeployed: capitalDeployed,
                assetCount: portfolioAssets.length
            };
        }
        return null;
    }
}

module.exports = FundManagerAgent;