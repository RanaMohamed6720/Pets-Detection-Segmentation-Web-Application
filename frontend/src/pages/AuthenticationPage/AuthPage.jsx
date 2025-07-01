import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { login, register } from "../../api/api";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { Box, useTheme } from "@mui/material";
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login: contextLogin } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (formData) => {
    try {
      const response = await login(formData);
      if (response.data.token) {
        await contextLogin(response.data.token);
        navigate("/analyze");
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const handleSignupSubmit = async (formData) => {
    try {
      const response = await register(formData);
      if (response.data.token) {
        await contextLogin(response.data.token);
        navigate("/analyze");
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "fixed",
        top: "80px",
        left: 0,
        right: 0,
        bottom: 0,
        background: theme.palette.background.default,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      {isLogin ? (
        <LoginForm
          onSwitchToSignup={toggleAuthMode}
          onSubmit={handleLoginSubmit}
        />
      ) : (
        <SignupForm
          onSwitchToLogin={toggleAuthMode}
          onSubmit={handleSignupSubmit}
        />
      )}
    </Box>
  );
}
