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
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../AppContext";

export default function Boardgame() {
  const API = "http://localhost:3001";
  const navigate = useNavigate();
  const { refreshToken, triggerRefresh, successMessage, notifySuccess } = useApp();

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API}/boardgames`)
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  }, [refreshToken]);

  if (items.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h4">Boardgames</Typography>
          <Button variant="contained" onClick={() => navigate("/boardgames/add")}>Add Boardgame</Button>
        </Box>
        <Typography>No boardgames found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Boardgames</Typography>
        <Button variant="contained" onClick={() => navigate("/boardgames/add")}>Add Boardgame</Button>
      </Box>

      {successMessage && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card sx={{ cursor: "pointer" }} onClick={() => navigate(`/boardgames/${item.id}`)}>
              {item.cover_url ? (
                <CardMedia component="img" height="200" image={`${API}/${item.cover_url}`} alt={item.name} />
              ) : (
                <Box sx={{ height: 200, bgcolor: "#eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Typography variant="subtitle1">{item.name}</Typography>
                </Box>
              )}

              <CardContent>
                <Typography variant="h6">{item.name}</Typography>

                {item.publisher && (
                  <Typography variant="body2" color="text.secondary">Publisher: {item.publisher}</Typography>
                )}

                {item.min_players != null && item.max_players != null && (
                  <Typography variant="body2" color="text.secondary">Players: {item.min_players} - {item.max_players}</Typography>
                )}

                {item.avg_playtime != null && (
                  <Typography variant="body2" color="text.secondary">Avg playtime: {item.avg_playtime} mins</Typography>
                )}

                {item.tags?.length > 0 && (
                  <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {item.tags.map((t) => (
                      <Chip key={t.id} label={t.name} size="small" />
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
