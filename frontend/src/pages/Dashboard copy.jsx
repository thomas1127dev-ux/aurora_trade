// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Container, Grid, Paper, Typography, Button } from "@mui/material";
import TopNav from "../components/TopNav";
import api from "../api";
import { motion } from "framer-motion";

export default function Dashboard({ me, setToken, themeMode, setThemeMode }) {
  const [ann, setAnn] = useState([]);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    api.get("/user/announcement/list").then(r => setAnn(r.data.announcements || [])).catch(() => { });
    if (me && me.is_staff) setShowAdmin(true);
  }, [me]);

  const logout = () => { localStorage.removeItem("token"); setToken(null); };

  return (
    <div className="dashboard-root">
      <TopNav title="Aurora Trade" me={me || {}} onToggleTheme={() => setThemeMode(themeMode === "dark" ? "light" : "dark")} themeMode={themeMode} onLogout={logout} showAdmin={showAdmin} />
      <Container sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Paper className="card" elevation={6} sx={{ p: 3 }}>
                <Typography variant="h5">欢迎, {me ? me.username : "用户"}</Typography>
                <Typography sx={{ mt: 1 }}>邀请码：{me ? me.invite_code : "-"} <Button size="small" onClick={() => { navigator.clipboard.writeText(me?.invite_code || ""); alert("已复制"); }}>复制</Button></Typography>
                <Typography sx={{ mt: 1 }}>铜币余额：{me ? me.coin_balance : 0}</Typography>
              </Paper>
            </motion.div>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <Paper className="card" sx={{ p: 2 }}>
                  <Typography variant="h6">邀请 & VIP</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>邀请好友，领取奖励。</Typography>
                  <Button href="/invite" sx={{ mt: 1 }}>前往</Button>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper className="card" sx={{ p: 2 }}>
                  <Typography variant="h6">API Keys</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>管理你的 API Keys。</Typography>
                  <Button href="/apikeys" sx={{ mt: 1 }}>前往</Button>
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Paper className="card" elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6">公告</Typography>
                {ann.map(a => <div key={a.id} className="announcement-item"><strong>{a.title}</strong><div className="muted">{a.content}</div></div>)}
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
