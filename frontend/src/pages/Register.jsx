import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Paper, Typography, Button, Box, TextField } from "@mui/material";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../api";
import { motion } from "framer-motion";

const passwordRule = z.string().min(8, "密码至少8位")
  .refine(s => /[a-z]/.test(s), "需要小写字母")
  .refine(s => /[A-Z]/.test(s), "需要大写字母")
  .refine(s => /[0-9]/.test(s), "需要数字");

const schema = z.object({
  username: z.string().min(3, "用户名至少3位").max(20, "最多20位"),
  email: z.string().email("请输入有效邮箱"),
  code: z.string().min(4, "验证码位数不对"),
  password: passwordRule,
  confirm_password: z.string()
}).refine(data => data.password === data.confirm_password, { message: "两次密码不一致", path: ["confirm_password"] });

export default function Register() {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (countdown === 0 && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [countdown]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); }
  }, []);

  const { register, handleSubmit, formState: { errors }, getValues } = useForm({ resolver: zodResolver(schema) });

  const sendCode = async () => {
    const email = getValues("email");
    if (!email) return alert("请输入邮箱后再发送验证码");
    setSending(true);
    try {
      const res = await api.post("/user/send-code/", { email, purpose: "register" });
      alert(res.data.detail || "验证码已发送，请检查邮箱");
      // start countdown (60s)
      setCountdown(60);
      timerRef.current = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) { clearInterval(timerRef.current); timerRef.current = null; return 0; }
          return c - 1;
        });
      }, 1000);
    } catch (err) {
      // backend might return 429 or other messages
      const msg = err.response?.data?.detail || err.response?.data || err.message || "发送验证码失败";
      alert(msg);
    } finally { setSending(false); }
  };

  const onSubmit = async (data) => {
    try {
      await api.post("/user/register", data);
      alert("注册成功，请登录");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message || "注册失败";
      alert(msg);
    }
  };

  return (
    <Container className="auth-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Paper className="auth-card" elevation={8}>
          <Typography variant="h4" align="center">创建账户</Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField label="用户名" variant="outlined" fullWidth margin="normal" {...register("username")} error={!!errors.username} helperText={errors.username?.message} />

            <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
              <TextField label="邮箱" variant="outlined" fullWidth margin="normal" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
              <Button variant="outlined" sx={{ minWidth: 140, height: 56, mt: 2 }} onClick={sendCode} disabled={sending || countdown > 0}>
                {countdown > 0 ? `重新发送(${countdown}s)` : "发送验证码"}
              </Button>
            </Box>

            <TextField label="邮箱验证码" variant="outlined" fullWidth margin="normal" {...register("code")} error={!!errors.code} helperText={errors.code?.message} />

            <TextField label="密码" variant="outlined" type="password" fullWidth margin="normal" {...register("password")} error={!!errors.password} helperText={errors.password?.message} />
            <TextField label="确认密码" variant="outlined" type="password" fullWidth margin="normal" {...register("confirm_password")} error={!!errors.confirm_password} helperText={errors.confirm_password?.message} />

            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>注册</Button>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button variant="text" onClick={() => navigate("/login")}>已有账号，返回登录</Button>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
}
