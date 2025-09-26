import { useState } from "react";
import { Box, TextField, Button, Typography, Alert, Paper, InputAdornment, IconButton, CircularProgress, Link } from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { authenticationApi } from "../../services/api";

const Login = () => {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear messages when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await authenticationApi.authenticate({
        email: formData.email,
        password: formData.password,
      });

      // Store auth data using the service method
      authenticationApi.storeAuthData(result);

      // Redirect to dashboard
      window.location.reload();
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
    }

    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authenticationApi.forgotPassword(formData.email);
      setSuccess("Password reset instructions have been sent to your email");
      setFormData({ email: "", password: "" });
    } catch (error) {
      setError(error.message || "Failed to send reset instructions");
    }

    setLoading(false);
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccess("");
    setFormData({ email: "", password: "" });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#141b2d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: "40px",
          borderRadius: "10px",
          backgroundColor: "#1f2a40",
          minWidth: "400px",
          maxWidth: "500px",
          width: "100%",
          border: "1px solid #3d3d3d",
        }}
      >
        <Box sx={{ textAlign: "center", marginBottom: "30px" }}>
          <Typography
            variant="h2"
            sx={{
              color: "#e0e0e0",
              fontWeight: "bold",
              marginBottom: "10px",
              fontSize: "2.5rem",
            }}
          >
            QuantFlow
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "#c2c2c2",
              fontWeight: "normal",
            }}
          >
            {mode === "login" ? "Trading Platform" : "Reset Password"}
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              marginBottom: "20px",
              backgroundColor: "#2c100f",
              color: "#e0e0e0",
              "& .MuiAlert-icon": {
                color: "#db4f4a",
              },
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{
              marginBottom: "20px",
              backgroundColor: "#0f2922",
              color: "#e0e0e0",
              "& .MuiAlert-icon": {
                color: "#4cceac",
              },
            }}
          >
            {success}
          </Alert>
        )}

        <form onSubmit={mode === "login" ? handleLogin : handleForgotPassword}>
          <Box sx={{ marginBottom: "20px" }}>
            <TextField
              name="email"
              type="email"
              label="Email Address"
              variant="outlined"
              fullWidth
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: "#e0e0e0" }} />
                  </InputAdornment>
                ),
                sx: {
                  color: "#e0e0e0",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#666666",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#858585",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4cceac",
                  },
                },
              }}
              InputLabelProps={{
                sx: { color: "#a3a3a3" },
              }}
            />
          </Box>

          {mode === "login" && (
            <Box sx={{ marginBottom: "30px" }}>
              <TextField
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                variant="outlined"
                fullWidth
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#e0e0e0" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end" disabled={loading} sx={{ color: "#e0e0e0" }}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    color: "#e0e0e0",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#666666",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#858585",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#4cceac",
                    },
                  },
                }}
                InputLabelProps={{
                  sx: { color: "#a3a3a3" },
                }}
              />
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              padding: "12px",
              fontSize: "16px",
              backgroundColor: "#4cceac",
              color: "#e0e0e0",
              "&:hover": {
                backgroundColor: "#3da58a",
              },
              "&:disabled": {
                backgroundColor: "#666666",
              },
            }}
          >
            {loading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <CircularProgress size={20} sx={{ color: "#e0e0e0" }} />
                {mode === "login" ? "Signing In..." : "Sending Instructions..."}
              </Box>
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

        {/* Toggle between login and forgot password */}
        <Box sx={{ textAlign: "center", marginTop: "20px" }}>
          {mode === "login" ? (
            <Link
              component="button"
              type="button"
              onClick={() => switchMode("forgot")}
              sx={{
                color: "#4cceac",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Forgot your password?
            </Link>
          ) : (
            <Link
              component="button"
              type="button"
              onClick={() => switchMode("login")}
              sx={{
                color: "#4cceac",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Back to Sign In
            </Link>
          )}
        </Box>

        <Box sx={{ textAlign: "center", marginTop: "20px" }}>
          <Typography
            variant="body2"
            sx={{
              color: "#a3a3a3",
            }}
          >
            Automated Cryptocurrency Trading Platform
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
