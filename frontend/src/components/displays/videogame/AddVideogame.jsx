import { Box, Button, TextField, Typography, Alert, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../AppContext";
import { useTheme } from "@mui/material/styles";
import Delete from "@mui/icons-material/Delete";

export default function AddVideogame() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [developer, setDeveloper] = useState("");
  const [publisher, setPublisher] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [platform, setPlatform] = useState("");
  const [genre, setGenre] = useState("");
  const [mode, setMode] = useState("");
  const [rating, setRating] = useState("");
  const [ownershipType, setOwnershipType] = useState("");
  const [status, setStatus] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);

  const { triggerRefresh, notifySuccess } = useApp();
  const navigate = useNavigate();
  const API = "http://localhost:3001";
  const theme = useTheme();
  const ACCENT = "#6A5ACD";

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

    if (!title) return setError("Title is required.");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("developer", developer);
    formData.append("publisher", publisher);
    formData.append("release_year", releaseYear);
    formData.append("platform", platform);
    formData.append("genre", genre);
    formData.append("mode", mode);
    formData.append("rating", rating);
    formData.append("ownership_type", ownershipType);
    formData.append("status", status);
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(`${API}/videogames`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Create failed");

      triggerRefresh();
      notifySuccess("Videogame added");
      navigate("/videogames");
    } catch (err) {
      console.error(err);
      setError("Failed to add videogame");
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
        Add Videogame
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
          }}
        >
          <TextField
            fullWidth
            label="Title"
            size="small"
            sx={{ mb: 2, ...fieldSx }}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            fullWidth
            multiline
            rows={7}
            label="Description"
            size="small"
            sx={{ mb: 2, ...fieldSx }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <TextField
            fullWidth
            label="Developer"
            size="small"
            sx={{ mb: 2, ...fieldSx }}
            value={developer}
            onChange={(e) => setDeveloper(e.target.value)}
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
              label="Release year"
              type="number"
              size="small"
              sx={{ flex: "1 1 120px", ...fieldSx }}
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
            />
            <TextField
              label="Platform"
              size="small"
              sx={{ flex: "1 1 160px", ...fieldSx }}
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            />
            <TextField
              label="Genre"
              size="small"
              sx={{ flex: "1 1 140px", ...fieldSx }}
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            />
            <TextField
              label="Mode"
              size="small"
              sx={{ flex: "1 1 140px", ...fieldSx }}
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <TextField
              label="Rating"
              type="number"
              inputProps={{ step: 0.1, min: 0, max: 10 }}
              size="small"
              sx={{ flex: "1 1 120px", ...fieldSx }}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />
            <TextField
              label="Ownership"
              size="small"
              sx={{ flex: "1 1 160px", ...fieldSx }}
              value={ownershipType}
              onChange={(e) => setOwnershipType(e.target.value)}
            />
            <TextField
              label="Status"
              size="small"
              sx={{ flex: "1 1 160px", ...fieldSx }}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </Box>

          {/* IMAGE UPLOAD */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Button
              variant="contained"
              component="label"
              sx={{
                bgcolor: ACCENT,
                "&:hover": { bgcolor: "#5a4bcf" },
                color: "#fff",
              }}
            >
              Upload Cover
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
            </Button>

            {imageFile && (
              <>
                <Typography variant="body2" color="text.secondary">
                  {imageFile.name}
                </Typography>
                <IconButton size="small" onClick={handleRemoveImage} sx={{ color: ACCENT }}>
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
                "&:hover": { bgcolor: "#5a4bcf" },
                color: "#fff",
              }}
            >
              Save Videogame
            </Button>

            <Button
              variant="outlined"
              onClick={() => navigate("/videogames")}
              sx={{
                borderColor: ACCENT,
                color: ACCENT,
                "&:hover": {
                  backgroundColor: "rgba(106,90,205,0.08)",
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
                  <Typography color="text.secondary">Cover preview</Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
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
