import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import AddItem from "./components/AddItem";
import AddCollection from "./components/AddCollection";
import Settings from "./components/Settings";
import ItemDetail from "./components/ItemDetail";
import CollectionDetail from "./components/CollectionDetail";

export default function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() => {
    return localStorage.getItem("sidebarExpanded") === "true";
  });

  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => {
      localStorage.setItem("sidebarExpanded", !prev);
      return !prev;
    });
  };

  const sidebarWidth = isSidebarExpanded ? 200 : 60;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar isExpanded={isSidebarExpanded} onToggle={toggleSidebar} />

      {/* Main content shifts based on sidebar width */}
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          ml: `${sidebarWidth}px`,
          transition: "margin-left 0.3s",
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/add-collection" element={<AddCollection />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/collections/:id" element={<CollectionDetail />} />
        </Routes>
      </Box>
    </Box>
  );
}
