/**
 * 🚀 Comprehensive Coinbase Trading Pairs Configuration
 * Oak Dragon Covenant - All Available Cryptocurrencies
 */

class TradingPairs {
    /**
     * All major Coinbase Pro trading pairs available for Oak Dragon Covenant
     * Base currency / Quote currency (USDT, USD, BTC, ETH)
     */
    static getAllPairs() {
        return {
            // 🥇 Major Cryptocurrencies (USDT Pairs)
            major: [
                'BTC/USDT',    // Bitcoin
                'ETH/USDT',    // Ethereum  
                'ADA/USDT',    // Cardano
                'SOL/USDT',    // Solana
                'AVAX/USDT',   // Avalanche
                'MATIC/USDT',  // Polygon
                'DOT/USDT',    // Polkadot
                'ATOM/USDT',   // Cosmos
                'LINK/USDT',   // Chainlink
                'UNI/USDT',    // Uniswap
            ],

            // 🥈 Alternative Coins (USDT Pairs)
            altcoins: [
                'XRP/USDT',    // Ripple
                'LTC/USDT',    // Litecoin
                'BCH/USDT',    // Bitcoin Cash
                'ETC/USDT',    // Ethereum Classic
                'FIL/USDT',    // Filecoin
                'ALGO/USDT',   // Algorand
                'AAVE/USDT',   // Aave
                'COMP/USDT',   // Compound
                'MKR/USDT',    // Maker
                'SNX/USDT',    // Synthetix
            ],

            // 🎯 DeFi Tokens (USDT Pairs)
            defi: [
                'SUSHI/USDT',  // SushiSwap
                'CRV/USDT',    // Curve
                'YFI/USDT',    // Yearn Finance
                '1INCH/USDT',  // 1inch
                'BAL/USDT',    // Balancer
                'BAND/USDT',   // Band Protocol
                'REN/USDT',    // Ren
                'LRC/USDT',    // Loopring
                'GRT/USDT',    // The Graph
                'ENS/USDT',    // Ethereum Name Service
            ],

            // 🌟 Layer 2 & Scaling Solutions
            layer2: [
                'MATIC/USDT',  // Polygon
                'LRC/USDT',    // Loopring
                'OMG/USDT',    // OMG Network
                'SKALE/USDT',  // SKALE
            ],

            // 🏛️ Enterprise & Institutional
            enterprise: [
                'XLM/USDT',    // Stellar
                'MANA/USDT',   // Decentraland
                'SAND/USDT',   // The Sandbox
                'ENJ/USDT',    // Enjin
                'BAT/USDT',    // Basic Attention Token
                'ZRX/USDT',    // 0x Protocol
            ],

            // 💎 High-Growth Potential
            emerging: [
                'ICP/USDT',    // Internet Computer
                'NEAR/USDT',   // NEAR Protocol
                'FTM/USDT',    // Fantom
                'LUNA/USDT',   // Terra Luna
                'RUNE/USDT',   // THORChain
                'KAVA/USDT',   // Kava
            ],

            // 🔥 Coinbase USD Pairs (Alternative base)
            usdPairs: [
                'BTC/USD',     // Bitcoin/USD
                'ETH/USD',     // Ethereum/USD
                'ADA/USD',     // Cardano/USD
                'SOL/USD',     // Solana/USD
                'AVAX/USD',    // Avalanche/USD
                'MATIC/USD',   // Polygon/USD
                'LINK/USD',    // Chainlink/USD
                'UNI/USD',     // Uniswap/USD
            ]
        };
    }

    /**
     * Get all pairs as a flat array
     */
    static getAllPairsFlat() {
        const pairs = this.getAllPairs();
        return [
            ...pairs.major,
            ...pairs.altcoins, 
            ...pairs.defi,
            ...pairs.layer2,
            ...pairs.enterprise,
            ...pairs.emerging,
            ...pairs.usdPairs
        ];
    }

    /**
     * Get priority pairs for initial trading (highest liquidity)
     */
    static getPriorityPairs() {
        return [
            'BTC/USDT',    // Bitcoin - Highest liquidity
            'ETH/USDT',    // Ethereum - Second highest
            'ADA/USDT',    // Cardano - Strong momentum
            'SOL/USDT',    // Solana - High growth potential
            'MATIC/USDT',  // Polygon - Layer 2 leader
            'LINK/USDT',   // Chainlink - Oracle leader
            'AVAX/USDT',   // Avalanche - Ecosystem growth
            'DOT/USDT',    // Polkadot - Cross-chain future
        ];
    }

    /**
     * Get pairs suitable for small account trading (good for $8.89 USDT)
     */
    static getSmallAccountPairs() {
        return [
            'ADA/USDT',    // Low price, good for fractional trading
            'MATIC/USDT',  // Low price, high potential
            'ALGO/USDT',   // Low price, stable project
            'XRP/USDT',    // Low price, institutional adoption
            'ATOM/USDT',   // Medium price, ecosystem growth
            'LINK/USDT',   // Good fundamentals
            'UNI/USDT',    // DeFi exposure
            'AAVE/USDT',   // DeFi blue chip
        ];
    }

    /**
     * Check if a trading pair is supported
     */
    static isSupported(pair) {
        return this.getAllPairsFlat().includes(pair);
    }

    /**
     * Get recommended allocation for small accounts
     */
    static getSmallAccountAllocation() {
        return {
            'ADA/USDT': 0.25,    // 25% - Low price, high potential
            'MATIC/USDT': 0.20,  // 20% - Layer 2 growth
            'ALGO/USDT': 0.15,   // 15% - Stable technology
            'ATOM/USDT': 0.15,   // 15% - Cosmos ecosystem
            'LINK/USDT': 0.15,   // 15% - Oracle infrastructure
            'UNI/USDT': 0.10,    // 10% - DeFi exposure
        };
    }
}

module.exports = TradingPairs;
