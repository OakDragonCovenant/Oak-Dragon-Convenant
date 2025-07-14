/**
 * This file represents the data blueprint for the Oak Dragon Real Estate Opportunity Fund.
 * It is not an agent, but a static data structure that agents can load and reference.
 */
const oakDragonREOFund = {
    overview: {
        fundName: "Oak Dragon Real Estate Opportunity Fund I",
        targetRaise: 5000000, // $5 Million
        netReturnTarget: "15-20% IRR",
        investmentPeriod: "3 Years",
        fundTerm: "7 Years"
    },
    legalStructure: {
        fundVehicle: "Delaware Limited Partnership (LP)",
        generalPartner: "Oak Dragon Capital LLC",
        series: [
            {
                name: "Series A",
                description: "Initial seed funding for single-family residential acquisitions.",
                target: 1000000
            },
            {
                name: "Series B",
                description: "Funding for multi-family and small commercial properties.",
                target: 2500000
            },
            {
                name: "Series C",
                description: "Funding for land acquisition and development projects.",
                target: 1500000
            }
        ]
    },
    investmentThesis: {
        strategy: "Value-add and opportunistic investments in emerging markets.",
        targetAssets: [
            "Single-Family Rentals (SFR)",
            "Multi-Family (2-10 units)",
            "Undeveloped Land"
        ],
        geographicFocus: "Sun Belt States (USA)"
    }
};

module.exports = oakDragonREOFund;