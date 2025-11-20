import React from "react";
import { Container, Paper, Typography } from "@mui/material";
import TopNav from "../components/TopNav";

export default function AdminPage({me}){
  return (
    <div>
      <TopNav title="Aurora Admin" me={me||{}} onToggleTheme={()=>{}} themeMode={"dark"} onLogout={()=>{}} showAdmin={true}/>
      <Container sx={{mt:3}}>
        <Paper sx={{p:3}}>
          <Typography variant="h5">管理后台（示例）</Typography>
          <Typography variant="body2" sx={{mt:1}}>这里是管理页面占位，后续可以扩展用户管理、公告管理、系统设置等功能。</Typography>
        </Paper>
      </Container>
    </div>
  );
}
