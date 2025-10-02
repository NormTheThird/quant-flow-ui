import { useState } from "react";
import { Box, TextField, Button, Typography, Alert, Paper, InputAdornment, IconButton, CircularProgress, Link, useTheme } from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { tokens } from "../../theme";
import { authenticationApi } from "../../services/api";

const Login = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
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

      authenticationApi.storeAuthData(result);
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
        background: colors.primary[500],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}>
      <Paper
        elevation={3}
        sx={{
          padding: "40px",
          borderRadius: "10px",
          backgroundColor: colors.primary[400],
          minWidth: "400px",
          maxWidth: "500px",
          width: "100%",
          border: `1px solid ${colors.grey[700]}`,
        }}>
        <Box sx={{ textAlign: "center", marginBottom: "30px" }}>
          <Typography
            variant="h2"
            sx={{
              color: colors.grey[100],
              fontWeight: "bold",
              marginBottom: "10px",
              fontSize: "2.5rem",
            }}>
            Quant Flow
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: colors.grey[200],
              fontWeight: "normal",
            }}>
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
            }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{
              marginBottom: "20px",
              backgroundColor: colors.greenAccent[700],
              color: colors.grey[100],
              "& .MuiAlert-icon": {
                color: colors.greenAccent[400],
              },
              "& .MuiAlert-message": {
                color: colors.grey[100],
              },
            }}>
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
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: colors.grey[100] }} />
                    </InputAdornment>
                  ),
                  sx: {
                    color: colors.grey[100],
                    backgroundColor: colors.primary[400],
                    "& input": {
                      color: `${colors.grey[100]} !important`,
                      backgroundColor: `${colors.primary[400]} !important`,
                      "&:-webkit-autofill": {
                        WebkitBoxShadow: `0 0 0 1000px ${colors.primary[400]} inset !important`,
                        WebkitTextFillColor: `${colors.grey[100]} !important`,
                        caretColor: colors.grey[100],
                        backgroundColor: `${colors.primary[400]} !important`,
                        transition: "background-color 5000s ease-in-out 0s !important",
                      },
                      "&:-webkit-autofill:hover": {
                        WebkitBoxShadow: `0 0 0 1000px ${colors.primary[400]} inset !important`,
                        WebkitTextFillColor: `${colors.grey[100]} !important`,
                        backgroundColor: `${colors.primary[400]} !important`,
                      },
                      "&:-webkit-autofill:focus": {
                        WebkitBoxShadow: `0 0 0 1000px ${colors.primary[400]} inset !important`,
                        WebkitTextFillColor: `${colors.grey[100]} !important`,
                        backgroundColor: `${colors.primary[400]} !important`,
                      },
                      "&:-webkit-autofill:active": {
                        WebkitBoxShadow: `0 0 0 1000px ${colors.primary[400]} inset !important`,
                        WebkitTextFillColor: `${colors.grey[100]} !important`,
                        backgroundColor: `${colors.primary[400]} !important`,
                      },
                    },
                    "&:-webkit-autofill": {
                      backgroundColor: `${colors.primary[400]} !important`,
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.grey[600],
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.grey[400],
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.greenAccent[500],
                    },
                  },
                },
                inputLabel: {
                  sx: {
                    color: colors.grey[300],
                    "&.Mui-focused": {
                      color: colors.grey[300],
                    },
                  },
                },
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
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: colors.grey[100] }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end" disabled={loading} sx={{ color: colors.grey[100] }}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      color: colors.grey[100],
                      backgroundColor: colors.primary[400],
                      "& input": {
                        color: `${colors.grey[100]} !important`,
                        backgroundColor: `${colors.primary[400]} !important`,
                        "&:-webkit-autofill": {
                          WebkitBoxShadow: `0 0 0 1000px ${colors.primary[400]} inset !important`,
                          WebkitTextFillColor: `${colors.grey[100]} !important`,
                          caretColor: colors.grey[100],
                          backgroundColor: `${colors.primary[400]} !important`,
                          transition: "background-color 5000s ease-in-out 0s !important",
                        },
                        "&:-webkit-autofill:hover": {
                          WebkitBoxShadow: `0 0 0 1000px ${colors.primary[400]} inset !important`,
                          WebkitTextFillColor: `${colors.grey[100]} !important`,
                          backgroundColor: `${colors.primary[400]} !important`,
                        },
                        "&:-webkit-autofill:focus": {
                          WebkitBoxShadow: `0 0 0 1000px ${colors.primary[400]} inset !important`,
                          WebkitTextFillColor: `${colors.grey[100]} !important`,
                          backgroundColor: `${colors.primary[400]} !important`,
                        },
                        "&:-webkit-autofill:active": {
                          WebkitBoxShadow: `0 0 0 1000px ${colors.primary[400]} inset !important`,
                          WebkitTextFillColor: `${colors.grey[100]} !important`,
                          backgroundColor: `${colors.primary[400]} !important`,
                        },
                      },
                      "&:-webkit-autofill": {
                        backgroundColor: `${colors.primary[400]} !important`,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.grey[600],
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.grey[400],
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: colors.greenAccent[500],
                      },
                    },
                  },
                  inputLabel: {
                    sx: {
                      color: colors.grey[300],
                      "&.Mui-focused": {
                        color: colors.grey[300],
                      },
                    },
                  },
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
              backgroundColor: colors.greenAccent[500],
              color: "#000000",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: colors.greenAccent[600],
              },
              "&:disabled": {
                backgroundColor: colors.grey[600],
              },
            }}>
            {loading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <CircularProgress size={20} sx={{ color: colors.grey[100] }} />
                {mode === "login" ? "Signing In..." : "Sending Instructions..."}
              </Box>
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

        <Box sx={{ textAlign: "center", marginTop: "20px" }}>
          {mode === "login" ? (
            <Link
              component="button"
              type="button"
              onClick={() => switchMode("forgot")}
              sx={{
                color: colors.greenAccent[500],
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}>
              Forgot your password?
            </Link>
          ) : (
            <Link
              component="button"
              type="button"
              onClick={() => switchMode("login")}
              sx={{
                color: colors.greenAccent[500],
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}>
              Back to Sign In
            </Link>
          )}
        </Box>

        <Box sx={{ textAlign: "center", marginTop: "20px" }}>
          <Typography
            variant="body2"
            sx={{
              color: colors.grey[300],
            }}>
            Automated Cryptocurrency Trading Platform
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
