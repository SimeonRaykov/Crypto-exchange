const backendUrls = {
    prices: {
        get: {
            binance: (symbol) => `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`,
            huobi: (symbol) => `https://api.huobi.pro/market/detail/merged?symbol=${symbol}`,
            kraken: (symbol) => `https://api.kraken.com/0/public/Ticker?pair=${symbol}`
        },
    },
    exchanges: {
        get: {
            binance: (symbol, limit) => `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=${limit}`,
            huobi: (symbol, limit) => `https://api.huobi.pro/market/depth?symbol=${symbol}&type=step0&depth=${limit}`,
            kraken: (symbol, limit) => `https://api.kraken.com/0/public/Depth?pair=${symbol}&count=${limit}`
        }
    }
}

export default backendUrls;