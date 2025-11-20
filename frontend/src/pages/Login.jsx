import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Paper, Typography, Button, Box, TextField } from "@mui/material";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../api";
import { motion } from "framer-motion";

const schema = z.object({
  login: z.string().min(3, "请输入用户名或邮箱"),
  password: z.string().min(8, "密码至少8位")
});

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/user/login", data);
      if (res.data.access) {
        onLogin(res.data.access);
        navigate("/dashboard");
      } else {
        alert("登录失败");
      }
    } catch (err) {
      alert(err.response?.data?.detail || "登录出错");
    }
  };

  return (
    <Container className="auth-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Paper className="auth-card" elevation={8}>
          <Typography variant="h4" gutterBottom align="center">欢迎回到 Aurora</Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>使用用户名或邮箱登录</Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField label="用户名" variant="outlined" fullWidth margin="normal" {...register("login")} error={!!errors.login} helperText={errors.login?.message} />

            <TextField label="密码" variant="outlined" type="password" fullWidth margin="normal" {...register("password")} error={!!errors.password} helperText={errors.password?.message} />

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>登录</Button>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button variant="text" onClick={() => navigate("/register")}>没有账号？去注册</Button>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
}
