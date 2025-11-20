// src/api/binanceUS.js
// Minimal Binance US helper for REST & WebSocket
// Public endpoints only (no API key). For production behind a backend proxy is recommended.

const REST_BASE = "https://api.binance.us";
const WS_BASE = "wss://stream.binance.us:9443/ws";

/**
 * Get klines (candlestick history)
 * @param {string} symbol e.g. "BTCUSDT"
 * @param {string} interval e.g. "1m", "5m", "1h"
 * @param {number} limit number of candles
 */
export async function getKlines(symbol = "BTCUSDT", interval = "1m", limit = 500) {
    const url = `${REST_BASE}/api/v3/klines?symbol=${encodeURIComponent(symbol)}&interval=${interval}&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`getKlines failed: ${res.status}`);
    return res.json();
}

/**
 * Get 24hr ticker for all symbols
 */
export async function get24hrAll() {
    const url = `${REST_BASE}/api/v3/ticker/24hr`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`get24hrAll failed: ${res.status}`);
    return res.json();
}

/**
 * Create a websocket for kline stream of a symbol/interval
 * @param {string} symbolLowercase e.g. 'btcusdt'
 * @param {string} interval '1m' ...
 * @returns WebSocket instance
 */
export function createKlineSocket(symbolLowercase = "btcusdt", interval = "1m") {
    const stream = `${symbolLowercase}@kline_${interval}`;
    const ws = new WebSocket(`${WS_BASE}/${stream}`);
    return ws;
}

/**
 * Create a websocket for single-ticker updates (miniTicker or ticker)
 * @param {string} symbolLowercase e.g. 'btcusdt'
 */
export function createTickerSocket(symbolLowercase = "btcusdt") {
    const stream = `${symbolLowercase}@ticker`;
    const ws = new WebSocket(`${WS_BASE}/${stream}`);
    return ws;
}
