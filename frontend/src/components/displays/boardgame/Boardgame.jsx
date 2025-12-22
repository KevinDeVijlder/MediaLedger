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

import FactoryIcon from '@mui/icons-material/Factory';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import WatchLaterIcon from '@mui/icons-material/WatchLater';

export default function Boardgame() {
  const API = "http://localhost:3001";
  const navigate = useNavigate();
  const { refreshToken, triggerRefresh, successMessage, notifySuccess } =
    useApp();

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4">Boardgames</Typography>
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
        <Typography>No boardgames found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">Boardgames</Typography>
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

      {successMessage && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          alignItems: "start",
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
    if (v <= 3) return "success"; // green
    if (v > 3 && v <= 7) return "warning"; // yellow
    if (v > 7 && v <= 9) return "error"; // red
    return "secondary"; // purple
  };

  return (
    <Card
      onClick={onClick}
      className="boardgame-card"
      sx={(t) => ({
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: 420,
        borderRadius: 3,
        overflow: "hidden",
        boxShadow: "0 8px 22px rgba(2,6,23,0.10)",
        transition: "box-shadow 220ms, transform 180ms",
        "&:hover": {
          boxShadow: "0 24px 60px rgba(2,6,23,0.16)",
        },
        "&:hover .complexity-badge": {
          boxShadow: "0 8px 24px rgba(255,109,0,0.32)",
          transform: "scale(1.06)",
        },
        // keep the card background white; emphasis via shadow/lift only
        backdropFilter: "saturate(140%) blur(6px)",
      })}
    >
      <Box
        sx={(t) => ({
          width: "100%",
          aspectRatio: "3 / 3",
          backgroundColor: t.palette.grey[100],
          position: "relative",
          flex: "0 0 auto",
        })}
      >
        {/* Complexity badge */}
        <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 5 }}>
          <Chip
            className="complexity-badge"
            label={item.complexity_weight ?? "-"}
            size="small"
            color={getBadgeColor(item.complexity_weight)}
            sx={{
              color: "#fff",
              fontWeight: 800,
              transition: "box-shadow 220ms, transform 220ms",
            }}
          />
        </Box>
        {item.cover_url ? (
          <CardMedia
            component="img"
            image={`${api}/${item.cover_url}`}
            alt={item.name}
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
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.05))`,
              }}
            />
            <Typography variant="h6" sx={{ zIndex: 1 }}>
              {item.name}
            </Typography>
          </Box>
        )}
      </Box>

      <CardContent
        className="boardgame-bottom"
        sx={{
          flex: "0 0 160px",
          py: 2.5,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          transition: "background 240ms",
        }}
      >
        <Box>
          <Typography
            variant="h6"
            noWrap
            sx={{ fontWeight: 800, letterSpacing: 0.2 }}
          >
            {item.name}
          </Typography>
          <Box
            className="boardgame-underline"
            sx={{
              display: "none",
              width: 0,
              height: 4,
              background: "#FF6D00",
              borderRadius: 2,
              mt: 1,
              transition: "width 260ms",
            }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            <FactoryIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Publisher: {item.publisher != null ? `${item.publisher}` : "-"}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <PeopleAltIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Players: {item.min_players ?? "?"} - {item.max_players ?? "?"}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            <WatchLaterIcon sx={{ verticalAlign: "middle", mr: 1 }} /> Avg playtime:{" "}
            {item.avg_playtime != null ? `${item.avg_playtime} mins` : "-"}
          </Typography>

          {/* complexity shown as top-right badge only */}
        </Box>
      </CardContent>
    </Card>
  );
}
