import { List, ListItemButton, ListItemIcon, ListItemText, Tooltip, Box } from "@mui/material";
import { Home, AddBox, Collections, Settings, Menu } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: <Home />, path: "/" },
  { label: "Add Item", icon: <AddBox />, path: "/add-item" },
  { label: "Add Collection", icon: <Collections />, path: "/add-collection" },
  { label: "Settings", icon: <Settings />, path: "/settings" },
];

export default function Sidebar({ isExpanded, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

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
      {/* Expand/Collapse Button */}
      <Box sx={{ p: 1 }}>
        <ListItemButton
          onClick={onToggle}
          sx={{
            justifyContent: isExpanded ? "flex-start" : "center",
            mb: 2,
            height: 56,
          }}
        >
          <ListItemIcon sx={{ minWidth: 0, color: "#fff", mr: isExpanded ? 2 : 0 }}>
            <Menu />
          </ListItemIcon>
          {isExpanded && <ListItemText primary="Menu" />}
        </ListItemButton>
      </Box>

      {/* Navigation Items */}
      <List sx={{ flexGrow: 1, p: 0 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Tooltip key={item.label} title={isExpanded ? "" : item.label} placement="right">
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  mb: 1,
                  borderRadius: 1,
                  height: 56,
                  justifyContent: "flex-start",
                  bgcolor: isActive ? "#262525" : "transparent",
                  borderLeft: isActive ? "5px solid #FF6D00" : "4px solid transparent",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, color: "#fff", justifyContent: "center", mr: isExpanded ? 2 : 0 }}>
                  {item.icon}
                </ListItemIcon>
                {isExpanded && <ListItemText primary={item.label} />}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );
}
