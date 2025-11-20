import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem, ListItemIcon } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SettingsIcon from "@mui/icons-material/Settings";
import KeyIcon from "@mui/icons-material/Key";
import CampaignIcon from "@mui/icons-material/Campaign";
import HistoryIcon from "@mui/icons-material/History";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function TopNav({ title, me, onToggleTheme, themeMode, onLogout, showAdmin }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const goDashboard = () => { navigate("/dashboard"); };
  const goSettings = () => { handleClose(); navigate("/settings"); };
  const goApiKeys = () => { handleClose(); navigate("/apikeys"); };
  const goInvite = () => { handleClose(); navigate("/invite"); };
  const goLogs = () => { handleClose(); navigate("/logs"); };
  const goAdmin = () => { handleClose(); navigate("/admin"); };

  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: "blur(6px)", borderBottom: "1px solid rgba(255,255,255,0.04)", boxShadow: themeMode === "dark" ? "0 0px 5px rgb(0 0 0)" : "0 0px 5px rgb(86 86 86)" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, cursor: "pointer" }} onClick={goDashboard}>{title}</Typography>
        </motion.div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <IconButton onClick={onToggleTheme} title="切换主题">
            <Brightness4Icon />
          </IconButton>

          <div>
            <IconButton onClick={handleOpen} size="small" sx={{ ml: 1 }}>
              {me && me.username ? <Avatar sx={{ width: 36, height: 36 }}>{me.username.slice(0, 1).toUpperCase()}</Avatar> : <AccountCircleIcon />}
            </IconButton>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose} PaperProps={{ sx: { minWidth: 220 } }}>
              <MenuItem onClick={() => { handleClose(); goDashboard(); }}>
                <ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>
                我的账户
              </MenuItem>

              <MenuItem onClick={goSettings}>
                <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                设置
              </MenuItem>

              <MenuItem onClick={goApiKeys}>
                <ListItemIcon><KeyIcon fontSize="small" /></ListItemIcon>
                API Keys
              </MenuItem>

              <MenuItem onClick={goInvite}>
                <ListItemIcon><CampaignIcon fontSize="small" /></ListItemIcon>
                邀请 & VIP
              </MenuItem>

              <MenuItem onClick={goLogs}>
                <ListItemIcon><HistoryIcon fontSize="small" /></ListItemIcon>
                审计日志
              </MenuItem>

              {showAdmin && (
                <MenuItem onClick={goAdmin}>
                  <ListItemIcon><AdminPanelSettingsIcon fontSize="small" /></ListItemIcon>
                  管理页面
                </MenuItem>
              )}

              <MenuItem onClick={() => { handleClose(); onLogout(); }}>
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                退出登录
              </MenuItem>
            </Menu>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  );
}
