// src/components/KlineChart.jsx
import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { Box, FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";
import { createKlineSocket, getKlines } from "../api/binanceUS";

const DEFAULT_SYMBOLS = ["BTCUSDT", "ETHUSDT", "BNBUSDT", "SOLUSDT", "ADAUSDT"];
const INTERVALS = ["1m", "5m", "15m", "1h", "4h", "1d"];

export default function KlineChart({ initialSymbol = "BTCUSDT", initialInterval = "1m" }) {
    const containerRef = useRef(null);
    const chartRef = useRef(null);
    const seriesRef = useRef(null);
    const wsRef = useRef(null);
    const [symbol, setSymbol] = useState(initialSymbol);
    const [interval, setInterval] = useState(initialInterval);
    const [loading, setLoading] = useState(true);

    // create chart + initial data + websocket
    useEffect(() => {
        let mounted = true;
        setLoading(true);

        // create chart
        const container = containerRef.current;
        if (!container) return;

        const chart = createChart(container, {
            width: container.clientWidth,
            height: 380,
            layout: { backgroundColor: "#071024", textColor: "#BBD5E1" },
            grid: { vertLines: { visible: false }, horzLines: { color: "#0b2a3b" } },
            rightPriceScale: { borderVisible: false },
            timeScale: { borderVisible: false, timeVisible: true },
            crosshair: { mode: 1 }
        });
        chartRef.current = chart;

        seriesRef.current = chart.addCandlestickSeries({
            upColor: "#09b85c",
            downColor: "#ff5c5c",
            wickUpColor: "#09b85c",
            wickDownColor: "#ff5c5c",
            borderVisible: false
        });

        // resize observer
        const ro = new ResizeObserver(() => {
            if (container) chart.applyOptions({ width: container.clientWidth });
        });
        ro.observe(container);

        async function loadHistoryAndConnect() {
            try {
                const raw = await getKlines(symbol, interval, 500);
                if (!mounted) return;
                const formatted = raw.map(k => ({
                    time: Math.floor(k[0] / 1000),
                    open: parseFloat(k[1]),
                    high: parseFloat(k[2]),
                    low: parseFloat(k[3]),
                    close: parseFloat(k[4])
                }));
                seriesRef.current.setData(formatted);

                // close existing ws if any
                if (wsRef.current) {
                    try { wsRef.current.close(); } catch (e) { }
                    wsRef.current = null;
                }

                // open ws
                const symbolLower = symbol.toLowerCase();
                const ws = createKlineSocket(symbolLower, interval);
                wsRef.current = ws;

                ws.onmessage = (ev) => {
                    try {
                        const msg = JSON.parse(ev.data);
                        const k = msg.k;
                        const candle = {
                            time: Math.floor(k.t / 1000),
                            open: parseFloat(k.o),
                            high: parseFloat(k.h),
                            low: parseFloat(k.l),
                            close: parseFloat(k.c)
                        };
                        // update current candle (or append when closed)
                        seriesRef.current.update(candle);
                    } catch (err) {
                        console.error("ws parse error", err);
                    }
                };

                ws.onopen = () => {
                    // optionally mark ready
                };

                ws.onerror = (e) => console.warn("WS error", e);
                ws.onclose = () => {
                    // try to reconnect after a short delay
                    setTimeout(() => {
                        if (mounted) {
                            // re-establish by re-running effect (state hasn't changed)
                        }
                    }, 1000);
                };

                setLoading(false);
            } catch (err) {
                console.error("loadHistoryAndConnect error", err);
                setLoading(false);
            }
        }

        loadHistoryAndConnect();

        return () => {
            mounted = false;
            if (wsRef.current) {
                try { wsRef.current.close(); } catch (e) { }
                wsRef.current = null;
            }
            try { ro.disconnect(); } catch (e) { }
            try { chart.remove(); } catch (e) { }
        };
        // re-run when symbol or interval changes
    }, [symbol, interval]);

    return (
        <Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Symbol</InputLabel>
                    <Select value={symbol} label="Symbol" onChange={(e) => setSymbol(e.target.value)}>
                        {DEFAULT_SYMBOLS.map(s => <MenuItem key={s} value={s}>{s.replace("USDT", " / USDT")}</MenuItem>)}
                        {/* allow manual symbol entry? keep simple for now */}
                    </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 110 }}>
                    <InputLabel>Interval</InputLabel>
                    <Select value={interval} label="Interval" onChange={(e) => setInterval(e.target.value)}>
                        {INTERVALS.map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}
                    </Select>
                </FormControl>

                {loading && <CircularProgress size={20} />}
            </Box>

            <div ref={containerRef} style={{ borderRadius: 12, overflow: "hidden", background: "#071024" }} />
        </Box>
    );
}
