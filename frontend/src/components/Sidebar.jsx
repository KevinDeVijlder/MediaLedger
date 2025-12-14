import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Box,
  Collapse,
} from "@mui/material";
import {
  Home,
  Widgets,
  BrowseGallery,
  Tune,
  Menu,
  MenuOpen,
  AddCircle,
  Create,
  CreateNewFolder,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import Logo from '../assets/logosmall.png'; // your logo path
import 'typeface-ubuntu';

const navItems = [
  { label: "Dashboard", icon: <Home />, path: "/" },
  { label: "Items", icon: <Widgets />, path: "/item" },
  { label: "Collections", icon: <BrowseGallery />, path: "/collection" },
];

export default function Sidebar({ isExpanded, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [addOpen, setAddOpen] = useState(false);

  const renderListItem = (item, active = false) => (
    <Tooltip key={item.label} title={isExpanded ? "" : item.label} placement="right">
      <ListItemButton
        onClick={() => navigate(item.path)}
        sx={{
          mb: 1,
          height: 56,
          bgcolor: active ? "rgba(255,255,255,0.1)" : "transparent",
          borderLeft: "5px solid transparent",
          borderLeftColor: active ? "#FF6D00" : "transparent",
          borderRight: "5px solid transparent", // invisible right border for centering
          borderRadius: 0.65,
          "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
          boxSizing: "border-box",
          display: "flex",
          justifyContent: isExpanded ? "flex-start" : "center",
        }}
      >
        <ListItemIcon sx={{ minWidth: 0, color: "#fff", mr: isExpanded ? 2 : 0 }}>
          {item.icon}
        </ListItemIcon>
        {isExpanded && (
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{ sx: { fontFamily: "Ubuntu" } }}
          />
        )}
      </ListItemButton>
    </Tooltip>
  );

  const renderAddButton = (icon, label, path, nested = false) => (
    <Tooltip title={isExpanded ? "" : label} placement="right">
      <ListItemButton
        onClick={() => navigate(path)}
        sx={{
          height: nested ? 48 : 56,
          borderLeft: "5px solid transparent",
          borderRight: "5px solid transparent", // invisible right border
          "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
          boxSizing: "border-box",
          display: "flex",
          justifyContent: isExpanded ? "flex-start" : "center",
        }}
      >
        <ListItemIcon sx={{ minWidth: 0, color: "#fff", mr: isExpanded ? 2 : 0 }}>
          {icon}
        </ListItemIcon>
        {isExpanded && (
          <ListItemText
            primary={label}
            primaryTypographyProps={{ sx: { fontFamily: "Ubuntu" } }}
          />
        )}
      </ListItemButton>
    </Tooltip>
  );

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: isExpanded ? 200 : 60,
        bgcolor: "#212121",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isExpanded ? "flex-start" : "center",
          p: 1,
          mb: 1,
        }}
      >
        <Box
          component="img"
          src={Logo}
          alt="App Logo"
          sx={{ height: 40, width: 40, transition: "all 0.3s" }}
        />
        {isExpanded && (
          <Box sx={{ ml: 1, fontFamily: "Ubuntu", fontWeight: "bold" }}>
            MediaLedger
          </Box>
        )}
      </Box>

      {/* Expand / Collapse */}
      <Box>
        <ListItemButton
          onClick={onToggle}
          sx={{
            mb: 1,                 // SAME as others
            height: 56,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            color: "rgba(255,255,255,0.4)",
            boxSizing: "border-box",
            display: "flex",
            justifyContent: isExpanded ? "flex-start" : "center",
          }}
        >
          <ListItemIcon sx={{ minWidth: 0, color: "rgba(255,255,255,0.4)", mr: isExpanded ? 2 : 0}}>
            {isExpanded ? <MenuOpen /> : <Menu />}
          </ListItemIcon>
          {isExpanded && (
            <ListItemText
              primary="Collapse"
              primaryTypographyProps={{ sx: { fontFamily: "Ubuntu"} }}
            />
          )}
        </ListItemButton>
      </Box>

      <List sx={{ flexGrow: 1, p: 0 }}>
        {/* Standard navigation */}
        {navItems.map((item) => renderListItem(item, location.pathname === item.path))}

        {/* ADD SECTION */}
        <ListItemButton
          onClick={() => setAddOpen((prev) => !prev)}
          sx={{
            mt: 1,
            height: 56,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            boxSizing: "border-box",
            display: "flex",
            justifyContent: isExpanded ? "flex-start" : "center",
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 0, color: "#fff", mr: isExpanded ? 2 : 0 }}>
            <AddCircle />
          </ListItemIcon>
          {isExpanded && (
            <ListItemText
              primary="Add"
              primaryTypographyProps={{ sx: { fontFamily: "Ubuntu" } }}
            />
          )}
        </ListItemButton>

        <Collapse in={addOpen} timeout="auto" unmountOnExit>
          <List disablePadding>
            {renderAddButton(<Create />, "Add Item", "/add-item", true)}
            {renderAddButton(<CreateNewFolder />, "Add Collection", "/add-collection", true)}
          </List>
        </Collapse>

        {/* Configuration */}
        {renderListItem(
          { label: "Configuration", icon: <Tune />, path: "/configuration" },
          location.pathname === "/configuration"
        )}
      </List>
    </Box>
  );
}
