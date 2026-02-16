import React, { useState } from "react";
import {
  Box,
  Container,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Menu, Inventory, Folder } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const drawerWidth = 240;

const MainLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    {
      text: "Catalog",
      icon: <Inventory />,
      path: "/",
    },
    {
      text: "Purchase Orders",
      icon: <Folder />,
      path: "/purchase-orders",
    },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
          boxShadow: "0 4px 20px rgba(25, 118, 210, 0.25)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Toolbar sx={{ py: 0.5 }}>
          <IconButton color="inherit" edge="start" onClick={toggleSidebar}>
            <Menu />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              letterSpacing: "0.5px",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              fontSize: "1.1rem",
              background: "linear-gradient(to right, #ffffff 0%, #e3f2fd 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Refinery Purchase Order System
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={sidebarOpen}
        sx={{
          width: sidebarOpen ? drawerWidth : 60,
          flexShrink: 0,
          whiteSpace: "nowrap",
          "& .MuiDrawer-paper": {
            width: sidebarOpen ? drawerWidth : 60,
            boxSizing: "border-box",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            overflowX: "hidden",
          },
        }}
        onClose={toggleSidebar}
      >
        <Toolbar />

        <List sx={{ mt: 2 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              disablePadding
              sx={{ display: "block" }}
              component={Link}
              to={item.path}
            >
              <ListItemButton
                selected={location.pathname === item.path}
                sx={{
                  minHeight: 48,
                  justifyContent: sidebarOpen ? "initial" : "center",
                  px: 2.5,
                  borderRadius: "8px",
                  mx: 1,
                  mb: 0.5,

                  backgroundColor:
                    location.pathname === item.path
                      ? "rgba(25, 118, 210, 0.12)"
                      : "transparent",
                  borderLeft:
                    location.pathname === item.path
                      ? "4px solid #1976d2"
                      : "4px solid transparent",
                  "&:hover": {
                    backgroundColor:
                      location.pathname === item.path
                        ? "rgba(25, 118, 210, 0.2)"
                        : "rgba(0, 0, 0, 0.04)",

                    borderLeft: "4px solid #1976d2",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "rgba(25, 118, 210, 0.12)",
                    "&:hover": {
                      backgroundColor: "rgba(25, 118, 210, 0.2)",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: sidebarOpen ? 3 : "auto",
                    justifyContent: "center",
                    color:
                      location.pathname === item.path
                        ? "#1976d2"
                        : "rgba(0, 0, 0, 0.6)",

                    transform:
                      location.pathname === item.path
                        ? "scale(1.1)"
                        : "scale(1)",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: sidebarOpen ? 1 : 0,
                    color:
                      location.pathname === item.path
                        ? "#1976d2"
                        : "rgba(0, 0, 0, 0.87)",
                    transition: "opacity 0.3s ease",
                    "& .MuiTypography-root": {
                      fontWeight: location.pathname === item.path ? 600 : 400,
                      fontSize: "0.95rem",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${sidebarOpen ? drawerWidth : 60}px)`,
          transition: (theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar />

        <Box
          sx={{
            minHeight: "100vh",
            pb: isMobile ? 10 : 4,
            background: "linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)",
          }}
        >
          <Container maxWidth="xl">{children}</Container>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
