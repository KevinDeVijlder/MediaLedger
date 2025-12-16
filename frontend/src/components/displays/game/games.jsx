import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../AppContext";

export default function Games() {
  const API = "http://localhost:3001";
  const navigate = useNavigate();

  const { refreshToken, successMessage, clearSuccess } = useApp();

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API}/items`)
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  }, [refreshToken]);

  const games = items.filter((it) => it.type === "game");

  if (games.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Games
        </Typography>
        <Typography>No games found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Games
      </Typography>

      {successMessage && (
        <Alert severity="info" sx={{ mb: 3 }} onClose={clearSuccess}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {games.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card sx={{ cursor: "pointer" }} onClick={() => navigate(`/items/${item.id}`)}>
              {item.cover_url ? (
                <CardMedia
                  component="img"
                  height="200"
                  image={`${API}/${item.cover_url}`}
                  alt={item.title}
                />
              ) : (
                <Box sx={{ height: 200, bgcolor: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography variant="subtitle1">{item.title}</Typography>
                </Box>
              )}

              <CardContent>
                <Typography variant="h6">{item.title}</Typography>

                {item.type && (
                  <Typography variant="body2" color="text.secondary">Type: {item.type}</Typography>
                )}

                {item.platform_name && (
                  <Typography variant="body2" color="text.secondary">Platform: {item.platform_name}</Typography>
                )}

                {item.media_type_name && (
                  <Typography variant="body2" color="text.secondary">Media: {item.media_type_name}</Typography>
                )}

                {item.tags?.length > 0 && (
                  <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {item.tags.map((t) => (
                      <Chip key={t.id} label={t.name} size="small" />
                    ))}
                  </Box>
                )}

                {item.collections?.length > 0 && (
                  <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {item.collections.map((c) => (
                      <Chip key={c.id} label={c.name} color="primary" size="small" />
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
