import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
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
        height: 440,
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
        {item.media_type_name && (
          <Box
            sx={(t) => ({
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "#FF6D00",
              color: "#fff",
              px: 1,
              py: 0.25,
              borderRadius: 1.5,
              fontSize: 12,
              fontWeight: 700,
              zIndex: 3,
              boxShadow: "0 6px 16px rgba(0,0,0,0.12)",
              pointerEvents: "none",
            })}
          >
            {item.media_type_name}
          </Box>
        )}
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

      <CardContent sx={{ flex: "0 0 140px", py: 2, overflow: "hidden", display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box>
          <Typography variant="h6" noWrap sx={{ fontWeight: 700 }}>
            {item.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }} noWrap>
            {item.type || ""}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
