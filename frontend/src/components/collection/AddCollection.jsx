import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../AppContext";

export default function AddCollection() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(null);

  const { triggerRefresh, notifySuccess } = useApp();
  const navigate = useNavigate();
  const API = "http://localhost:3001";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description);
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`${API}/collections`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        setError(errData?.error || "Failed to add collection");
        return;
      }

      triggerRefresh();
      notifySuccess("Collection added successfully!");
      navigate("/collection");
    } catch (err) {
      console.error(err);
      setError("Failed to add collection");
    }
  };

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", mt: 4, px: 2 }}>
      {/* Page title */}
      <Typography
        variant="h4"
        sx={{
          fontFamily: "Ubuntu",
          fontWeight: 700,
          mb: 3,
        }}
      >
        Add Collection
      </Typography>

      <Paper
        elevation={0}
      >
        <Stack spacing={3}>
          {error && <Alert severity="error">{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Collection name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#FF6D00",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#FF6D00",
                  },
                }}
              />

              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={3}
                placeholder="Optional description of this collection"
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#FF6D00",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#FF6D00",
                  },
                }}
              />

              {/* Image upload */}
              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ textTransform: "none", bgcolor: "rgba(255, 109, 0, 0.9)" , color: "black", borderColor: "#FF6D00",  "&:hover": {
      bgcolor: "rgba(255, 109, 0, 1)",
    }}}
                >
                  Upload cover image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setImageFile(e.target.files[0]);
                      }
                    }}
                  />
                </Button>

                {imageFile && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, color: "#FF6D00" }}
                  >
                    Selected file: {imageFile.name}
                  </Typography>
                )}
              </Box>

              {/* Actions */}
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="text"
                  sx={{color: "rgba(255, 109, 0, 1)", "&:hover": {
      bgcolor: "rgba(255, 109, 0, 0.1)", 
                  }}}
                  onClick={() => navigate("/collection")}
                >
                  Cancel
                </Button>

                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    textTransform: "none",
                    px: 3, bgcolor: "rgba(255, 109, 0, 0.9)" , color: "black", borderColor: "#FF6D00",  "&:hover": {
      bgcolor: "rgba(255, 109, 0, 1)", 
                  }}}
                >
                  Add Collection
                </Button>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
}
