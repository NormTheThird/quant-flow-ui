import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

// Item component for menu items
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  return (
    <MenuItem active={selected === title} 
              style={{color: colors.grey[100]}} 
              onClick={() => setSelected(title)} 
              icon={icon} 
              component={<Link to={to} />}>
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const CustomSidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box sx={{ height: "100vh",
               "& .ps-sidebar-container": { background: `${colors.primary[400]} !important`, height: "100vh !important", border: "none !important", boxShadow: "none !important" },
               "& .ps-sidebar-root": { border: "none !important", borderRight: "none !important" },
               "& .ps-menu-icon": { backgroundColor: "transparent !important" },
               "& .ps-menu-button": { padding: "5px 35px 5px 20px !important" },
               "& .ps-menu-button:hover": { color: "#868dfb !important", backgroundColor: "transparent !important" },
               "& .ps-menu-button.ps-active": { color: "#6870fa !important" }}}>
      <Sidebar collapsed={isCollapsed} style={{ height: "100vh" }}>
        <Menu>

          {/* LOGO AND MENU ICON */}
          <MenuItem onClick={() => setIsCollapsed(!isCollapsed)} 
                    icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
                    style={{ margin: "10px 0 20px 0",  color: colors.grey[100]}}>
            {!isCollapsed && (
              <Box display="flex"
                   justifyContent="space-between"
                   alignItems="center"
                   ml="15px">
                <Typography variant="h3" color={colors.grey[100]}>Quant Flow</Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img alt="profile-user"
                     width="100px"
                     height="100px"
                     src={`../../assets/user.png`}
                     style={{ cursor: "pointer", borderRadius: "50%" }}/>
              </Box>
              <Box textAlign="center">
                <Typography variant="h2"
                            color={colors.grey[100]}
                            fontWeight="bold"
                            sx={{ m: "10px 0 0 0" }}>
                  Trey Norman
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  VP Fancy Admin
                </Typography>
              </Box>
            </Box>
          )} */}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default CustomSidebar;