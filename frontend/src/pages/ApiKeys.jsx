import React from "react";
import { Container, Paper, Typography, Button } from "@mui/material";
import TopNav from "../components/TopNav";

export default function ApiKeys({ me }) {
    return (
        <div>
            <TopNav title="Aurora" me={me || {}} onToggleTheme={() => { }} themeMode={"dark"} onLogout={() => { }} showAdmin={me?.is_staff} />
            <Container sx={{ mt: 3 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h5">API Keys 管理</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>生成/撤销 API Key，用于程序化访问（示例占位）。</Typography>
                    <Button variant="contained" sx={{ mt: 2 }}>创建新的 API Key（示例）</Button>
                </Paper>
            </Container>
        </div>
    );
}
