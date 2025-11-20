import React from "react";
import { Container, Paper, Typography, Button } from "@mui/material";
import TopNav from "../components/TopNav";

export default function Invite({ me }) {
    return (
        <div>
            <TopNav title="Aurora" me={me || {}} onToggleTheme={() => { }} themeMode={"dark"} onLogout={() => { }} showAdmin={me?.is_staff} />
            <Container sx={{ mt: 3 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h5">邀请 & VIP</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>邀请好友并获得奖励，或在此处兑换 VIP 资格（占位页面）。</Typography>

                    <Typography sx={{ mt: 2 }}>你的邀请码： <strong>{me?.invite_code || "-"}</strong></Typography>
                    <Button sx={{ mt: 2 }} onClick={() => { navigator.clipboard.writeText(me?.invite_code || ""); alert("邀请码已复制"); }}>复制邀请码</Button>
                </Paper>
            </Container>
        </div>
    );
}
