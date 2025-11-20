import React from "react";
import { Container, Paper, Typography } from "@mui/material";
import TopNav from "../components/TopNav";

export default function Logs({ me }) {
    return (
        <div>
            <TopNav title="Aurora" me={me || {}} onToggleTheme={() => { }} themeMode={"dark"} onLogout={() => { }} showAdmin={me?.is_staff} />
            <Container sx={{ mt: 3 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h5">审计日志</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>系统操作与安全日志（仅示例）。</Typography>
                    <Typography variant="caption" sx={{ display: "block", mt: 2 }}>此处将展示用户操作、登录历史、敏感操作审计等（后台需提供对应 API）。</Typography>
                </Paper>
            </Container>
        </div>
    );
}
