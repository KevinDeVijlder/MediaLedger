import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Alert,
  Button,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../AppContext";

import FactoryIcon from "@mui/icons-material/Factory";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WatchLaterIcon from "@mui/icons-material/WatchLater";

export default function Boardgame() {
  const API = "http://localhost:3001";
  const navigate = useNavigate();
  const { refreshToken, successMessage } = useApp();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch(`${API}/boardgames`)
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
          Boardgames
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/boardgames/add")}
          sx={{
            bgcolor: "#FF6D00",
            color: "#fff",
            fontWeight: 700,
            "&:hover": { bgcolor: "#e65a00" },
          }}
        >
          Add Boardgame
        </Button>
      </Box>

      {items.length === 0 && (
        <Typography>No boardgames found.</Typography>
      )}

      {successMessage && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      {/* GRID OF CARDS */}
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
            <BoardgameCard
              item={item}
              api={API}
              onClick={() => navigate(`/boardgames/${item.id}`)}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function BoardgameCard({ item, api, onClick }) {
  const theme = useTheme();

  const getBadgeColor = (val) => {
    const v = Number(val);
    if (!isFinite(v)) return "default";
    if (v <= 3) return "success";
    if (v > 3 && v <= 7) return "warning";
    if (v > 7 && v <= 9) return "error";
    return "secondary";
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
      <Box sx={{ width: "100%", paddingTop: "100%", position: "relative", bgcolor: "grey.100" }}>
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
              px: 2,
              color: "text.secondary",
            }}
          >
            <Typography>No cover image</Typography>
          </Box>
        )}
        {/* Complexity badge */}
        <Chip
          label={item.complexity_weight ?? "-"}
          size="small"
          color={getBadgeColor(item.complexity_weight)}
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
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          <FactoryIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          Publisher: {item.publisher ?? "-"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          <PeopleAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          Players: {item.min_players ?? "?"} - {item.max_players ?? "?"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <WatchLaterIcon sx={{ verticalAlign: "middle", mr: 1 }} />
          Avg playtime: {item.avg_playtime != null ? `${item.avg_playtime} mins` : "-"}
        </Typography>
      </CardContent>
    </Card>
  );
}
