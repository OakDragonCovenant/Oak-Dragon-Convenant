/**
 * This is our dictionary. It translates our internal name for a crypto pair
 * into the specific format that each exchange needs.
 */
const SymbolNormalizer = {
    toExchange(internalSymbol, exchangeName) {
        const [base, quote] = internalSymbol.split('/');
        switch (exchangeName.toLowerCase()) {
            case 'coinbase':
                return `${base}-${quote}`; // Coinbase uses a dash
            case 'binance':
            case 'kucoin':
                return `${base}${quote}`; // Binance and KuCoin use no separator
            case 'kraken':
                return `XBT/USD`; // Kraken is special
            default:
                return internalSymbol;
        }
    }
};

module.exports = Object.freeze(SymbolNormalizer);