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
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../AppContext";

export default function Items() {
  const API = "http://localhost:3001";
  const navigate = useNavigate();

  // 🔹 Global app context
  const { refreshToken, successMessage, clearSuccess } = useApp();

  // 🔹 Data
  const [items, setItems] = useState([]);

  // 🔄 Fetch items (runs on refreshToken change)
  useEffect(() => {
    fetch(`${API}/items`)
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  }, [refreshToken]);

  if (items.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Items
        </Typography>
        <Typography>No items found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Items
      </Typography>

      {/* 🔔 Success message */}
      {successMessage && (
        <Alert severity="info" sx={{ mb: 3 }} onClose={clearSuccess}>
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <ItemCard
              item={item}
              api={API}
              onClick={() => navigate(`/items/${item.id}`)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

function ItemCard({ item, api, onClick }) {
  const theme = useTheme();

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        width: 200,
        height: 360,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 6px 18px rgba(15,23,42,0.08)",
        transition: "transform 200ms ease, box-shadow 200ms ease",
        '&:hover': {
          transform: "translateY(-6px)",
          boxShadow: "0 18px 40px rgba(15,23,42,0.14)",
        },
        bgcolor: theme.palette.background.paper,
        m: "auto",
      }}
    >
      <Box
        sx={(t) => ({
          width: "100%",
          aspectRatio: "2 / 3",
          backgroundColor: t.palette.grey[100],
          position: "relative",
          flex: "0 0 auto",
        })}
      >
        {item.cover_url ? (
          <CardMedia
            component="img"
            image={`${api}/${item.cover_url}`}
            alt={item.title}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 2,
              textAlign: "center",
              color: (t) => t.palette.text.secondary,
            }}
          >
            <Box sx={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(180deg, rgba(0,0,0,0.03), rgba(0,0,0,0.06))`,
            }} />
            <Typography variant="h6" sx={{ zIndex: 1 }}>
              {item.title}
            </Typography>
          </Box>
        )}
      </Box>

      <CardContent sx={{ flex: "0 0 64px", py: 1, overflow: "hidden" }}>
        <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>
          {item.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" noWrap>
          {item.media_type_name || item.type || ""}
        </Typography>

        <Box sx={{ mt: 1, display: "flex", gap: 0.5, flexWrap: "wrap", alignItems: 'center' }}>
          {item.tags?.slice(0, 4).map((t) => (
            <Chip key={t.id} label={t.name} size="small" />
          ))}
          {item.collections?.slice(0, 2).map((c) => (
            <Chip key={c.id} label={c.name} color="primary" size="small" />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
