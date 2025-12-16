import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Item from "./components/items/Item";
import AddItem from "./components/items/AddItem";
import ItemDetail from "./components/items/ItemDetail";
import Collection from "./components/collection/Collection"
import AddCollection from "./components/collection/AddCollection";
import CollectionDetail from "./components/collection/CollectionDetail";
import Configuration from "./components/configuration";
import Create from "./components/create";
import Movies from "./components/displays/movie/movies";
import TvShows from "./components/displays/tvshow/tvshows";
import Games from "./components/displays/game/games";
import Books from "./components/displays/book/books";
import Boardgames from "./components/displays/boardgame/Boardgame";
import AddBoardgame from "./components/displays/boardgame/AddBoardgame";
import BoardgameDetail from "./components/displays/boardgame/BoardgameDetail";
import EditBoardgame from "./components/displays/boardgame/EditBoardgame";

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
          <Route path="/item" element={<Item />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tvshows" element={<TvShows />} />
          <Route path="/games" element={<Games />} />
          <Route path="/books" element={<Books />} />
          <Route path="/boardgames" element={<Boardgames />} />
          <Route path="/boardgames/add" element={<AddBoardgame />} />
          <Route path="/boardgames/:id" element={<BoardgameDetail />} />
          <Route path="/boardgames/:id/edit" element={<EditBoardgame />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/add-collection" element={<AddCollection />} />
          <Route path="/configuration" element={<Configuration />} />
          <Route path="/create" element={<Create />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/collections/:id" element={<CollectionDetail />} />
        </Routes>
      </Box>
    </Box>
  );
}
