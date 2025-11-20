// src/pages/Dashboard.jsx
import React from "react";
import { Container, Grid, Paper, Typography } from "@mui/material";
import TopNav from "../components/TopNav";
import { motion } from "framer-motion";

import KlineChart from "../components/KlineChart";
import TopGainersLosers from "../components/TopGainersLosers";

/**
 * Dashboard — 包含：
 *  - 实时 K 线（Binance US）
 *  - Top10 涨幅 / 跌幅（Binance US 24h）
 */
export default function Dashboard({ me, setToken, themeMode, setThemeMode }) {
  return (
    <div>
      <TopNav
        title="Aurora Trade"
        me={me}
        themeMode={themeMode}
        onToggleTheme={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
        onLogout={() => {
          setToken(null);
          localStorage.removeItem("token");
        }}
        showAdmin={me?.role === "admin"}
      />


      <Container maxWidth="xl" sx={{ mt: 3, mb: 6 }}>
        <Grid container spacing={3}>

          {/* K-line Chart */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Market K-line (Binance US)
                </Typography>
                <KlineChart initialSymbol="BTCUSDT" initialInterval="1m" />
              </Paper>
            </motion.div>
          </Grid>

          {/* Top Movers */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.06 }}
            >
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Market Movers
                </Typography>
                <TopGainersLosers limit={10} refreshInterval={5000} />
              </Paper>
            </motion.div>
          </Grid>

          {/* Announcement area */}
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12 }}
            >
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="subtitle1">公告</Typography>
                <Typography variant="body2" color="text.secondary">
                  这里显示站点公告内容。如需恢复你项目原本的公告后台数据，我可以整合回 Dashboard 页面。
                </Typography>
              </Paper>
            </motion.div>
          </Grid>

        </Grid>
      </Container>
    </div>
  );
}
