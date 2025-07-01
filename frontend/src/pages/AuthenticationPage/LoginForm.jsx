import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  CircularProgress,
  Fade,
  Zoom,
} from "@mui/material";
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  VpnKey,
  ArrowForward,
  AccountCircle,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

const FormContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  padding: theme.spacing(3),
}));

const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "16px",
  width: "100%",
  maxWidth: 480,
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  padding: theme.spacing(1.5),
  borderRadius: "12px",
  fontWeight: "600",
  letterSpacing: "0.5px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[4],
  },
}));

const LoginForm = ({ onSwitchToSignup, onSubmit }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await onSubmit(formData);
      if (!result.success) {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ submit: "Login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };


  const handleSwitchToSignup = () => {
    setErrors({});
    onSwitchToSignup();
  };

  return (
    
    <FormContainer maxWidth="sm">
      <Zoom in={true} style={{ transitionDelay: "100ms" }}>
        <FormPaper elevation={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 4,
            }}
          >
            <AccountCircle
              sx={{ fontSize: 60, color: "primary.main", mb: 1 }}
            />
            <Typography
              component="h1"
              variant="h4"
              gutterBottom
              fontWeight="bold"
            >
              Welcome Back
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Sign in to continue to PetDetect
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              required
              id="email"
              name="email"
              label="Email Address"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              margin="normal"
              required
              id="password"
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ mb: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: "right", mt: 1 }}>
              <Link href="#" variant="body2" underline="hover">
                Forgot password?
              </Link>
            </Box>

            {errors.submit && (
              <Fade in={!!errors.submit}>
                <Typography
                  color="error"
                  variant="body2"
                  sx={{ mt: 2, textAlign: "center" }}
                >
                  <VpnKey
                    fontSize="small"
                    sx={{ verticalAlign: "middle", mr: 1 }}
                  />
                  {errors.submit}
                </Typography>
              </Fade>
            )}

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <SubmitButton
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                endIcon={!isLoading && <ArrowForward />}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </SubmitButton>
            </motion.div>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Typography variant="body1" align="center">
            Don't have an account?{" "}
            <Link
              component="button"
              variant="body1"
              onClick={handleSwitchToSignup}
              underline="hover"
              sx={{ fontWeight: 600 }}
            >
              Create one now
            </Link>
          </Typography>
        </FormPaper>
      </Zoom>
      </FormContainer>
  );
};

export default LoginForm;
