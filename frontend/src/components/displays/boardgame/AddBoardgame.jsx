import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../AppContext";
import { useTheme } from "@mui/material/styles";

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
  const theme = useTheme();
  const ACCENT = "#FF6D00";

  const [previewUrl, setPreviewUrl] = useState(null);
  const fieldSx = {
    '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: ACCENT },
    '& .MuiInputLabel-root.Mui-focused': { color: ACCENT },
  };

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

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>Add Boardgame</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', gap: { xs: 2, md: 4 }, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1, bgcolor: 'background.paper', p: 3, borderRadius: 2, boxShadow: 1 }}>
          <TextField fullWidth label="Name" variant="outlined" size="small" sx={{ mb: 2, ...fieldSx }} value={name} onChange={(e) => setName(e.target.value)} />
          <TextField fullWidth multiline rows={4} label="Description" variant="outlined" size="small" sx={{ mb: 2, ...fieldSx }} value={description} onChange={(e) => setDescription(e.target.value)} />
          <TextField fullWidth label="Publisher" variant="outlined" size="small" sx={{ mb: 2, ...fieldSx }} value={publisher} onChange={(e) => setPublisher(e.target.value)} />

          <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField type="number" label="Min players" variant="outlined" size="small" sx={{ flex: '1 1 100px', ...fieldSx }} value={minPlayers} onChange={(e) => setMinPlayers(e.target.value)} />
            <TextField type="number" label="Max players" variant="outlined" size="small" sx={{ flex: '1 1 100px', ...fieldSx }} value={maxPlayers} onChange={(e) => setMaxPlayers(e.target.value)} />
            <TextField type="number" label="Avg playtime (mins)" variant="outlined" size="small" sx={{ flex: '1 1 140px', ...fieldSx }} value={avgPlaytime} onChange={(e) => setAvgPlaytime(e.target.value)} />
            <TextField type="number" label="Complexity" variant="outlined" size="small" sx={{ flex: '1 1 110px', ...fieldSx }} value={complexityWeight} onChange={(e) => setComplexityWeight(e.target.value)} />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Button variant="contained" component="label" sx={{ bgcolor: ACCENT, '&:hover': { bgcolor: '#e65a00' }, color: '#fff' }}>
              Upload Cover
              <input type="file" accept="image/*" hidden onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
            </Button>
            {imageFile && <Typography variant="body2" sx={{ color: 'text.secondary' }}>{imageFile.name}</Typography>}
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button type="submit" variant="contained" sx={{ bgcolor: ACCENT, '&:hover': { bgcolor: '#e65a00' }, color: '#fff' }}>Save Boardgame</Button>
            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate('/boardgames')}
              sx={{
                borderColor: ACCENT,
                color: ACCENT,
                '&:hover': { backgroundColor: 'rgba(255,109,0,0.08)', borderColor: ACCENT },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>

        <Box sx={{ width: { xs: '100%', md: 360 }, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <Box sx={{ width: '100%', aspectRatio: '2 / 3', borderRadius: 2, overflow: 'hidden', boxShadow: 3, bgcolor: 'grey.100', display: 'grid', placeItems: 'center' }}>
            {previewUrl ? (
              <img src={previewUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            ) : (
              <Box sx={{ textAlign: 'center', px: 2 }}>
                <Typography sx={{ color: 'text.secondary' }}>Cover preview</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>Select an image to preview</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
