/**
 * Symbol Normalizer for converting between internal and exchange-specific symbols
 */
class SymbolNormalizer {
    /**
     * Convert internal symbol format to exchange-specific format
     * @param {string} internalSymbol - e.g., 'BTC/USDT'
     * @param {string} exchange - exchange name (e.g., 'coinbase')
     * @returns {string} Exchange-specific symbol
     */
    static toExchange(internalSymbol, exchange) {
        // Convert 'BTC/USDT' to exchange format
        const [base, quote] = internalSymbol.split('/');
        
        switch (exchange.toLowerCase()) {
            case 'coinbase':
                // Coinbase uses 'BTC-USD' format
                return `${base}-${quote}`;
            case 'binance':
                // Binance uses 'BTCUSDT' format
                return `${base}${quote}`;
            default:
                // Default to internal format
                return internalSymbol;
        }
    }
    
    /**
     * Convert exchange-specific symbol to internal format
     * @param {string} exchangeSymbol - e.g., 'BTC-USD'
     * @param {string} exchange - exchange name
     * @returns {string} Internal symbol format
     */
    static fromExchange(exchangeSymbol, exchange) {
        switch (exchange.toLowerCase()) {
            case 'coinbase':
                // Convert 'BTC-USD' to 'BTC/USD'
                return exchangeSymbol.replace('-', '/');
            case 'binance':
                // This is more complex for Binance, would need a mapping
                // For now, just assume USDT pairs
                if (exchangeSymbol.endsWith('USDT')) {
                    const base = exchangeSymbol.slice(0, -4);
                    return `${base}/USDT`;
                }
                return exchangeSymbol;
            default:
                return exchangeSymbol;
        }
    }
}

module.exports = SymbolNormalizer;
