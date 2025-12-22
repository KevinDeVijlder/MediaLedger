import { Box, Typography, Button, Chip, Alert, Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../../../AppContext";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import StarHalfIcon from '@mui/icons-material/StarHalf';

export default function BoardgameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API = "http://localhost:3001";
  const { triggerRefresh, notifySuccess } = useApp();

  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);

  const ACCENT = "#FF6D00";

  useEffect(() => {
    async function load() {
      try {
        const data = await fetch(`${API}/boardgames/${id}`).then((r) =>
          r.json()
        );
        setGame(data);
      } catch {
        setError("Failed to load boardgame");
      }
    }
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this boardgame?")) return;
    try {
      const res = await fetch(`${API}/boardgames/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();

      triggerRefresh();
      notifySuccess("Boardgame deleted");
      navigate("/boardgames");
    } catch {
      setError("Failed to delete boardgame");
    }
  };

  if (!game) {
    return (
      <Box sx={{ p: 3 }}>
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Typography>Loading…</Typography>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1300, mx: "auto" }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {game.name}
          </Typography>
          {game.publisher && (
            <Typography sx={{ color: "text.secondary", mt: 0.5 }}>
              Published by {game.publisher}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            onClick={() => navigate(`/boardgames/${id}/edit`)}
            sx={{
              bgcolor: "#FF6D00",
              "&:hover": { bgcolor: "#e65a00" },
            }}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="outlined"
            onClick={handleDelete}
            sx={{
              borderColor: ACCENT,
              color: ACCENT,
              "&:hover": {
                backgroundColor: "rgba(255,109,0,0.08)",
                borderColor: ACCENT,
              },
            }}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {/* MAIN CARD */}
      <Box
        sx={{
          display: "flex",
          gap: { xs: 3, md: 4 },
          flexDirection: { xs: "column", md: "row" },
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: "0 8px 22px rgba(2,6,23,0.10)",
          p: { xs: 2, md: 3 },
        }}
      >
        {/* COVER */}
        <Box sx={{ width: { xs: "100%", md: 360 } }}>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              paddingTop: "100%",
              borderRadius: 3,
              overflow: "hidden",
              bgcolor: "rgba(2,6,23,0.15)",
              boxShadow: "0 8px 22px rgba(2,6,23,0.10)",
            }}
          >
            {game.cover_url ? (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${API}/${game.cover_url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
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
                }}
              >
                <Typography sx={{ color: "text.secondary" }}>
                  No cover image
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* DETAILS */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* META */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mb: 2,
            }}
          >
            {game.min_players != null && game.max_players != null && (
              <Chip
                icon={<PeopleAltIcon sx={{ verticalAlign: "middle", mr: 1 }} />}
                label={`Players: ${game.min_players}–${game.max_players}`}
              />
            )}
            {game.avg_playtime != null && (
              <Chip
                icon={<WatchLaterIcon sx={{ verticalAlign: "middle", mr: 1 }} />}
                label={`Playtime: ${game.avg_playtime} mins`}
              />
            )}
            {game.complexity_weight != null && (
              <Chip
                icon={<StarHalfIcon sx={{ verticalAlign: "middle", mr: 1 }} />}
                label={`Complexity: ${game.complexity_weight}`}
                color="warning"
              />
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* DESCRIPTION */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Description
          </Typography>
          <Typography sx={{ color: "text.secondary", lineHeight: 1.6 }}>
            {game.description || "No description provided."}
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
