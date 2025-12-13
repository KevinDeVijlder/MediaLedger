import { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useApp } from "../AppContext";

export default function AddCollection() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  const { triggerRefresh, notifySuccess } = useApp(); // ✅ Correct usage
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
      if (image) formData.append("image", image);

      const res = await fetch(`${API}/collections`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        setError(errData?.error || "Failed to add collection");
        return;
      }

      // 🔄 Trigger refresh and show success
      triggerRefresh();
      notifySuccess("Collection added successfully!");
      navigate("/"); // Navigate to dashboard
    } catch (err) {
      console.error(err);
      setError("Failed to add collection");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add New Collection
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Collection Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={2}
          sx={{ mb: 2 }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ marginBottom: "16px" }}
        />
        <Button variant="contained" type="submit" fullWidth>
          Add Collection
        </Button>
      </form>
    </Box>
  );
}
