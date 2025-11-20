import React from "react";
import { Container, Paper, Typography, Button, Grid, TextField } from "@mui/material";
import TopNav from "../components/TopNav";

export default function Settings({ me }) {
    // This is a placeholder: implement update profile, change password, email preferences, etc.
    return (
        <div>
            <TopNav title="Aurora" me={me || {}} onToggleTheme={() => { }} themeMode={"dark"} onLogout={() => { }} showAdmin={me?.is_staff} />
            <Container sx={{ mt: 3 }}>
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h5">账号设置</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>修改你的个人信息、密码、通知偏好等。</Typography>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={6}>
                            <TextField label="用户名" fullWidth defaultValue={me?.username || ""} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label="邮箱" fullWidth defaultValue={me?.email || ""} />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained">保存更改（示例）</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </div>
    );
}
