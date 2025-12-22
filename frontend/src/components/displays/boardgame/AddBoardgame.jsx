import { Box, Button, TextField, Typography, Alert, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../AppContext";
import { useTheme } from "@mui/material/styles";
import Delete from "@mui/icons-material/Delete";

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
    "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: ACCENT },
    "& .MuiInputLabel-root.Mui-focused": { color: ACCENT },
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
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
      const res = await fetch(`${API}/boardgames`, {
        method: "POST",
        body: formData,
      });
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
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1300, mx: "auto" }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
        Add Boardgame
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          gap: { xs: 2, md: 4 },
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* FORM */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            flex: 1,
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 3,
            boxShadow: "0 8px 22px rgba(2,6,23,0.10)",
            overflow: "hidden",
          }}
        >
          <TextField
            fullWidth
            label="Name"
            size="small"
            sx={{ mb: 2, ...fieldSx }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            fullWidth
            multiline
            rows={9}
            label="Description"
            size="small"
            sx={{ mb: 2, ...fieldSx }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <TextField
            fullWidth
            label="Publisher"
            size="small"
            sx={{ mb: 2, ...fieldSx }}
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
          />

          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <TextField
              type="number"
              label="Min players"
              size="small"
              sx={{ flex: "1 1 100px", ...fieldSx }}
              value={minPlayers}
              onChange={(e) => setMinPlayers(e.target.value)}
            />
            <TextField
              type="number"
              label="Max players"
              size="small"
              sx={{ flex: "1 1 100px", ...fieldSx }}
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(e.target.value)}
            />
            <TextField
              type="number"
              label="Avg playtime (mins)"
              size="small"
              sx={{ flex: "1 1 140px", ...fieldSx }}
              value={avgPlaytime}
              onChange={(e) => setAvgPlaytime(e.target.value)}
            />
            <TextField
              type="number"
              label="Complexity"
              size="small"
              sx={{ flex: "1 1 110px", ...fieldSx }}
              value={complexityWeight}
              onChange={(e) => setComplexityWeight(e.target.value)}
            />
          </Box>

          {/* UPLOAD + REMOVE ICON */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 3,
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              component="label"
              sx={{
                bgcolor: ACCENT,
                "&:hover": { bgcolor: "#e65a00" },
                color: "#fff",
              }}
            >
              Upload Cover
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  setImageFile(e.target.files?.[0] ?? null)
                }
              />
            </Button>

            {imageFile && (
              <>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {imageFile.name}
                </Typography>

                <IconButton
                  size="small"
                  onClick={handleRemoveImage}
                  sx={{
                    color: ACCENT,
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: ACCENT,
                "&:hover": { bgcolor: "#e65a00" },
                color: "#fff",
              }}
            >
              Save Boardgame
            </Button>

            <Button
              type="button"
              variant="outlined"
              onClick={() => navigate("/boardgames")}
              sx={{
                borderColor: ACCENT,
                color: ACCENT,
                "&:hover": {
                  backgroundColor: "rgba(255,109,0,0.08)",
                  borderColor: ACCENT,
                },
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>

        {/* PREVIEW */}
        <Box sx={{ width: { xs: "100%", md: 560 } }}>
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
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                backgroundImage: previewUrl ? `url(${previewUrl})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!previewUrl && (
                <Box sx={{ textAlign: "center", px: 2 }}>
                  <Typography sx={{ color: "text.secondary" }}>
                    Cover preview
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mt: 1 }}
                  >
                    Select an image to preview
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
