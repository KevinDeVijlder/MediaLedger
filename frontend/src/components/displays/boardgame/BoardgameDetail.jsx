import { Box, Typography, Button, Chip, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "../../../AppContext";

export default function BoardgameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API = "http://localhost:3001";
  const { triggerRefresh, notifySuccess } = useApp();

  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetch(`${API}/boardgames/${id}`).then((r) =>
          r.json()
        );
        setGame(data);
      } catch (err) {
        setError("Failed to load boardgame");
      }
    }
    load();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this boardgame?")) return;
    try {
      const res = await fetch(`${API}/boardgames/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");

      triggerRefresh();
      notifySuccess("Boardgame deleted");
      navigate("/boardgames");
    } catch (err) {
      console.error(err);
      setError("Failed to delete boardgame");
    }
  };

  if (!game) {
    return (
      <Box sx={{ p: 3 }}>
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Typography>Loading...</Typography>
        )}
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
        <Typography variant="h4">{game.name}</Typography>
        <Box>
          <Button
            variant="contained"
            sx={{ mr: 1 }}
            onClick={() => navigate(`/boardgames/${id}/edit`)}
          >
            Edit
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </Box>
      </Box>

      {game.cover_url && (
        <img
          src={`${API}/${game.cover_url}`}
          alt={game.name}
          style={{ maxWidth: 300, display: "block", marginBottom: 16 }}
        />
      )}

      <Typography variant="subtitle1" gutterBottom>
        {game.description}
      </Typography>

      {game.publisher && <Typography>Publisher: {game.publisher}</Typography>}
      {game.min_players != null && game.max_players != null && (
        <Typography>
          Players: {game.min_players} - {game.max_players}
        </Typography>
      )}
      {game.avg_playtime != null && (
        <Typography>Avg playtime: {game.avg_playtime} mins</Typography>
      )}
      {game.complexity_weight != null && (
        <Typography>Complexity: {game.complexity_weight}</Typography>
      )}
    </Box>
  );
}
