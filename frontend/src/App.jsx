import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPage from "./pages/AdminPage";
import Settings from "./pages/Settings";
import Invite from "./pages/Invite";
import ApiKeys from "./pages/ApiKeys";
import Logs from "./pages/Logs";
import api from "./api";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [themeMode, setThemeMode] = useState(localStorage.getItem("theme") || "dark");
  const [me, setMe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeMode);
    localStorage.setItem("theme", themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (token) {
      api.get("/user/me")
        .then(res => setMe(res.data))
        .catch(err => {
          console.error("me fetch failed:", err);
          setToken(null);
          localStorage.removeItem("token");
          navigate("/login");
        });
    } else {
      setMe(null);
    }
  }, [token]);

  const theme = React.useMemo(() => createTheme({ palette: { mode: themeMode } }), [themeMode]);

  const requireAuth = (element) => token ? element : <Navigate to="/login" />;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={(t) => { localStorage.setItem("token", t); setToken(t); }} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={requireAuth(<Dashboard me={me} setToken={setToken} themeMode={themeMode} setThemeMode={setThemeMode} />)} />
        <Route path="/settings" element={requireAuth(<Settings me={me} />)} />
        <Route path="/invite" element={requireAuth(<Invite me={me} />)} />
        <Route path="/apikeys" element={requireAuth(<ApiKeys me={me} />)} />
        <Route path="/logs" element={requireAuth(<Logs me={me} />)} />
        <Route path="/admin" element={requireAuth(<AdminPage me={me} />)} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
