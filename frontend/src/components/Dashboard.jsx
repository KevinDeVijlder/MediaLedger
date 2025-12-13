import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";

export default function Dashboard() {
  const API = "http://localhost:3001";
  const navigate = useNavigate();

  // 🔹 Global app context
  const { refreshToken, successMessage, clearSuccess } = useApp();

  // 🔹 Toggles (persisted)
  const [showItems, setShowItems] = useState(
    () => JSON.parse(localStorage.getItem("showItems")) ?? true
  );
  const [showCollections, setShowCollections] = useState(
    () => JSON.parse(localStorage.getItem("showCollections")) ?? true
  );

  // 🔹 Data
  const [items, setItems] = useState([]);
  const [collections, setCollections] = useState([]);

  // 💾 Persist toggles
  useEffect(() => {
    localStorage.setItem("showItems", JSON.stringify(showItems));
  }, [showItems]);

  useEffect(() => {
    localStorage.setItem("showCollections", JSON.stringify(showCollections));
  }, [showCollections]);

  // 🔄 Fetch data (runs on refreshToken change)
  useEffect(() => {
    fetch(`${API}/items`)
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));

    fetch(`${API}/collections`)
      .then((res) => res.json())
      .then((data) => setCollections(Array.isArray(data) ? data : []))
      .catch(() => setCollections([]));
  }, [refreshToken]);

  const renderGrid = (list) => {
    if (!list || list.length === 0) {
      return <Typography>No items found.</Typography>;
    }

    return (
      <Grid container spacing={3}>
        {list.map((entry) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={`card-${entry.id}-${entry.title || entry.name}`}
          >
            <Card
              sx={{ cursor: "pointer" }}
              onClick={() =>
                entry.type
                  ? navigate(`/items/${entry.id}`)
                  : navigate(`/collections/${entry.id}`)
              }
            >
              {entry.cover_url ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={`${API}/${entry.cover_url}`}
                  alt={entry.title || entry.name}
                />
              ) : (
                <Box
                  sx={{
                    height: 200,
                    bgcolor: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="subtitle1">
                    {entry.title || entry.name}
                  </Typography>
                </Box>
              )}

              <CardContent>
                <Typography variant="h6">{entry.title || entry.name}</Typography>

                {entry.type && (
                  <Typography variant="body2" color="text.secondary">
                    Type: {entry.type}
                  </Typography>
                )}

                {entry.platform_name && (
                  <Typography variant="body2" color="text.secondary">
                    Platform: {entry.platform_name}
                  </Typography>
                )}

                {entry.media_type_name && (
                  <Typography variant="body2" color="text.secondary">
                    Media: {entry.media_type_name}
                  </Typography>
                )}

                {entry.tags?.length > 0 && (
                  <Box
                    sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}
                  >
                    {entry.tags.map((t) => (
                      <Chip key={t.id} label={t.name} size="small" />
                    ))}
                  </Box>
                )}

                {entry.collections?.length > 0 && (
                  <Box
                    sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}
                  >
                    {entry.collections.map((c) => (
                      <Chip key={c.id} label={c.name} color="primary" size="small" />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  // 🔀 Combined list
  const displayedList = [
    ...(showItems ? items : []),
    ...(showCollections ? collections : []),
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Media Library
      </Typography>

      {/* 🔔 Success message */}
      {successMessage && (
        <Alert severity="info" sx={{ mb: 3 }} onClose={clearSuccess}>
          {successMessage}
        </Alert>
      )}

      {/* 🔘 Toggles */}
      <ToggleButtonGroup sx={{ mb: 3 }}>
        <ToggleButton
          value="items"
          selected={showItems}
          onChange={() => setShowItems((prev) => !prev)}
        >
          Items
        </ToggleButton>
        <ToggleButton
          value="collections"
          selected={showCollections}
          onChange={() => setShowCollections((prev) => !prev)}
        >
          Collections
        </ToggleButton>
      </ToggleButtonGroup>

      {displayedList.length === 0 ? (
        <Typography>No items to display.</Typography>
      ) : (
        renderGrid(displayedList)
      )}
    </Box>
  );
}
