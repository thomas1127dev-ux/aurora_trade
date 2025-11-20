// src/components/TopGainersLosers.jsx
import React, { useEffect, useState, useRef } from "react";
import { Paper, Typography, Box, List, ListItem, ListItemText, Divider, Chip } from "@mui/material";
import { motion } from "framer-motion";
import { get24hrAll } from "../api/binanceUS";

function pctStr(n) {
    if (n === null || n === undefined) return "-";
    const sign = n > 0 ? "+" : "";
    return `${sign}${Number(n).toFixed(2)}%`;
}

/**
 * Show top gainers and top losers from Binance US, filtered to USDT pairs by default.
 *
 * Props:
 *  - limit (default 10)
 *  - refreshInterval (ms, default 5000)
 */
export default function TopGainersLosers({ limit = 10, refreshInterval = 5000 }) {
    const [gainers, setGainers] = useState([]);
    const [losers, setLosers] = useState([]);
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;

        async function load() {
            try {
                const data = await get24hrAll();
                if (!Array.isArray(data)) return;
                // keep only USDT pairs (most common). You can change to USD pairs if needed.
                const filtered = data.filter(d => typeof d.symbol === "string" && /USDT$/.test(d.symbol));
                filtered.forEach(d => {
                    d.priceChangePercent = parseFloat(d.priceChangePercent || 0);
                    d.lastPrice = parseFloat(d.lastPrice || 0);
                    d.quoteVolume = parseFloat(d.quoteVolume || 0);
                });

                const sorted = filtered.sort((a, b) => b.priceChangePercent - a.priceChangePercent);
                if (!mounted.current) return;
                setGainers(sorted.slice(0, limit));
                setLosers(sorted.slice(-limit).reverse());
            } catch (err) {
                console.error("TopGainersLosers load error", err);
            }
        }

        load();
        const iv = setInterval(load, refreshInterval);

        return () => {
            mounted.current = false;
            clearInterval(iv);
        };
    }, [limit, refreshInterval]);

    return (
        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", md: "row" } }}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ flex: 1 }}>
                <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>Top {limit} 涨幅（24h）</Typography>
                    <List dense>
                        {gainers.map(item => (
                            <React.Fragment key={item.symbol}>
                                <ListItem
                                    secondaryAction={<Chip size="small" label={pctStr(item.priceChangePercent)} sx={{ bgcolor: "#052e16", color: "#7fffd4", minWidth: 80, mr: 1 }} />}>
                                    <ListItemText primary={`${item.symbol} · ${Number(item.lastPrice).toFixed(6)}`} secondary={`Vol: ${Number(item.quoteVolume).toFixed(2)}`} />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                        {gainers.length === 0 && <ListItem><ListItemText primary="暂无数据" /></ListItem>}
                    </List>
                </Paper>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ flex: 1 }}>
                <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>Top {limit} 跌幅（24h）</Typography>
                    <List dense>
                        {losers.map(item => (
                            <React.Fragment key={item.symbol}>
                                <ListItem
                                    secondaryAction={<Chip size="small" label={pctStr(item.priceChangePercent)} sx={{ bgcolor: "#2b0606", color: "#ffb3b3", minWidth: 80, mr: 1 }} />}>
                                    <ListItemText primary={`${item.symbol} · ${Number(item.lastPrice).toFixed(6)}`} secondary={`Vol: ${Number(item.quoteVolume).toFixed(2)}`} />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                        {losers.length === 0 && <ListItem><ListItemText primary="暂无数据" /></ListItem>}
                    </List>
                </Paper>
            </motion.div>
        </Box>
    );
}
