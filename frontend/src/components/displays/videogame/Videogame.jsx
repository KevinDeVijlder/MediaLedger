import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Button,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../AppContext";

import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import FactoryIcon from "@mui/icons-material/Factory";
import DevicesIcon from "@mui/icons-material/Devices";
import StarIcon from "@mui/icons-material/Star";

export default function Videogame() {
  const API = "http://localhost:3001";
  const navigate = useNavigate();
  const { refreshToken, successMessage } = useApp();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API}/videogames`)
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  }, [refreshToken]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1300, mx: "auto" }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Videogames
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/videogames/add")}
          sx={{
            bgcolor: "#6A5ACD",
            color: "#fff",
            fontWeight: 700,
            "&:hover": { bgcolor: "#5a4bcf" },
          }}
        >
          Add Videogame
        </Button>
      </Box>

      {items.length === 0 && (
        <Typography>No videogames found.</Typography>
      )}

      {successMessage && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {/* GRID */}
      <Box
        sx={{
          display: "grid",
          gap: { xs: 3, md: 4 },
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
        }}
      >
        {items.map((item) => (
          <Box key={item.id} sx={{ display: "flex", justifyContent: "center" }}>
            <VideogameCard
              item={item}
              api={API}
              onClick={() => navigate(`/videogames/${item.id}`)}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function VideogameCard({ item, api, onClick }) {
  const theme = useTheme();

  const getRatingColor = (rating) => {
    const r = Number(rating);
    if (!isFinite(r)) return "default";
    if (r >= 8) return "success";
    if (r >= 5) return "warning";
    return "error";
  };

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 8px 22px rgba(2,6,23,0.10)",
        transition: "box-shadow 220ms, transform 180ms",
        "&:hover": {
          boxShadow: "0 24px 60px rgba(2,6,23,0.16)",
        },
      }}
    >
      {/* COVER */}
      <Box
        sx={{
          width: "100%",
          paddingTop: "100%",
          position: "relative",
          bgcolor: "grey.100",
        }}
      >
        {item.cover_url ? (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${api}/${item.cover_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: 3,
            }}
          />
        ) : (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              color: "text.secondary",
            }}
          >
            <SportsEsportsIcon sx={{ fontSize: 48 }} />
          </Box>
        )}

        {/* Rating badge */}
        <Chip
          label={item.rating ?? "-"}
          size="small"
          color={getRatingColor(item.rating)}
          icon={<StarIcon sx={{ color: "#fff !important" }} />}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#fff",
            fontWeight: 800,
          }}
        />
      </Box>

      {/* DETAILS */}
      <CardContent sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }} noWrap>
          {item.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          <FactoryIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          {item.developer ?? item.publisher ?? "-"}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          <DevicesIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          {item.platform ?? "-"}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          <SportsEsportsIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          {item.genre ?? "-"} • {item.mode ?? "-"}
        </Typography>
      </CardContent>
    </Card>
  );
}
