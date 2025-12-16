import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../AppContext";

export default function AddBoardgame() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [publisher, setPublisher] = useState("");
  const [minPlayers, setMinPlayers] = useState(1);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [avgPlaytime, setAvgPlaytime] = useState(30);
  const [complexityWeight, setComplexityWeight] = useState(1.0);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);

  const { triggerRefresh, notifySuccess } = useApp();
  const navigate = useNavigate();
  const API = "http://localhost:3001";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name) return setError("Name is required.");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("publisher", publisher);
    formData.append("min_players", minPlayers);
    formData.append("max_players", maxPlayers);
    formData.append("avg_playtime", avgPlaytime);
    formData.append("complexity_weight", complexityWeight);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(`${API}/boardgames`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Create failed");

      triggerRefresh();
      notifySuccess("Boardgame added");
      navigate("/boardgames");
    } catch (err) {
      console.error(err);
      setError("Failed to add boardgame");
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 700 }}>
      <Typography variant="h5" gutterBottom>Add Boardgame</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField fullWidth label="Name" sx={{ mb: 2 }} value={name} onChange={(e) => setName(e.target.value)} />
        <TextField fullWidth multiline rows={4} label="Description" sx={{ mb: 2 }} value={description} onChange={(e) => setDescription(e.target.value)} />
        <TextField fullWidth label="Publisher" sx={{ mb: 2 }} value={publisher} onChange={(e) => setPublisher(e.target.value)} />

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField type="number" label="Min players" value={minPlayers} onChange={(e) => setMinPlayers(e.target.value)} />
          <TextField type="number" label="Max players" value={maxPlayers} onChange={(e) => setMaxPlayers(e.target.value)} />
          <TextField type="number" label="Avg playtime (mins)" value={avgPlaytime} onChange={(e) => setAvgPlaytime(e.target.value)} />
          <TextField type="number" label="Complexity" value={complexityWeight} onChange={(e) => setComplexityWeight(e.target.value)} />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Button variant="contained" component="label">Upload Cover<input type="file" accept="image/*" hidden onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} /></Button>
          {imageFile && <Typography sx={{ mt: 1 }}>{imageFile.name}</Typography>}
        </Box>

        <Button type="submit" variant="contained">Save Boardgame</Button>
      </form>
    </Box>
  );
}
