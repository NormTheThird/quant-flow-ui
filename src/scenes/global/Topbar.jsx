import { useState } from "react";
import { Box, IconButton, useTheme, Menu, MenuItem, Typography, Divider } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { authenticationApi } from "../../services/api";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Get user data from auth service (with error handling)
  let username = "User";
  try {
    const authData = authenticationApi.getAuthData?.();
    username = authData?.user?.name || authData?.user?.email || "User";
  } catch (error) {
    console.error("Error getting auth data:", error);
  }

  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAccountSettings = () => {
    handleUserMenuClose();
    console.log("Navigate to account settings");
  };

  const handleLogout = async () => {
    handleUserMenuClose();
    try {
      if (authenticationApi.logout) {
        await authenticationApi.logout();
      } else {
        // Fallback: just clear storage if logout method doesn't exist
        sessionStorage.clear();
        localStorage.clear();
      }
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Box display="flex" justifyContent="flex-end" p={2}>
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton onClick={handleUserMenuClick}>
          <PersonOutlinedIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleUserMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: colors.primary[400],
                border: `1px solid ${colors.grey[700]}`,
                minWidth: "200px",
                mt: 1,
              },
            },
          }}>
          <MenuItem disabled sx={{ opacity: "1 !important" }}>
            <Typography variant="subtitle2" sx={{ color: colors.grey[100], fontWeight: "bold" }}>
              {username}
            </Typography>
          </MenuItem>

          <Divider sx={{ backgroundColor: colors.grey[700] }} />

          <MenuItem onClick={handleAccountSettings} sx={{ color: colors.grey[100] }}>
            <AccountCircleOutlinedIcon sx={{ mr: 2, fontSize: "20px" }} />
            Account Settings
          </MenuItem>

          <MenuItem onClick={handleLogout} sx={{ color: colors.grey[100] }}>
            <LogoutOutlinedIcon sx={{ mr: 2, fontSize: "20px" }} />
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;
